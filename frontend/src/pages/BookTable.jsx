import React, { useState, useEffect } from 'react';
import { tableService, menuService, orderService, promotionService } from '../api/services';

function BookTable() {
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTables();
    loadMenu();
    loadPromotions();
  }, []);

  const loadTables = async () => {
    try {
      const response = await tableService.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await menuService.getAvailable();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const loadPromotions = async () => {
    try {
      const response = await promotionService.getActive();
      setPromotions(response.data || []);
    } catch (error) {
      console.error('Error loading promotions:', error);
    }
  };

  const handleSelectTable = (table) => {
    // Cho phép đặt bàn nếu status là AVAILABLE hoặc PAID (đã thanh toán = có thể đặt lại)
    if (table.status !== 'AVAILABLE' && table.status !== 'PAID') {
      alert('Bàn này không khả dụng');
      return;
    }
    setSelectedTable(table);
    setShowModal(true);
  };

  // Tính giá sau khi áp dụng promotion
  const calculatePriceWithPromotion = (menuItem) => {
    const menuItemId = menuItem._id || menuItem.id;
    const originalPrice = menuItem.price || 0;
    
    // Tìm promotion áp dụng cho món này
    const applicablePromotion = promotions.find(promo => {
      if (!promo.active) return false;
      const now = new Date();
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      if (now < startDate || now > endDate) return false;
      
      // Nếu promotion có menuItemId, chỉ áp dụng cho món đó
      if (promo.menuItemId) {
        let promoMenuItemId = promo.menuItemId;
        // Nếu là object, lấy _id hoặc id
        if (typeof promoMenuItemId === 'object') {
          promoMenuItemId = promoMenuItemId._id || promoMenuItemId.id || promoMenuItemId;
        }
        // So sánh ID (chuyển về string để so sánh)
        const promoIdStr = promoMenuItemId?.toString() || '';
        const menuIdStr = menuItemId?.toString() || '';
        return promoIdStr === menuIdStr;
      }
      // Nếu không có menuItemId, áp dụng cho tất cả món
      return true;
    });

    if (!applicablePromotion) {
      return { originalPrice, finalPrice: originalPrice, discount: 0, promotion: null };
    }

    let finalPrice = originalPrice;
    let discount = 0;

    switch (applicablePromotion.type) {
      case 'PERCENTAGE':
        discount = (originalPrice * applicablePromotion.discountValue) / 100;
        finalPrice = originalPrice - discount;
        break;
      case 'FIXED_AMOUNT':
        discount = applicablePromotion.discountValue;
        finalPrice = Math.max(0, originalPrice - discount);
        break;
      case 'BUY_ONE_GET_ONE':
        // Giảm giá 50% (mua 1 tặng 1)
        discount = originalPrice * 0.5;
        finalPrice = originalPrice - discount;
        break;
      default:
        finalPrice = originalPrice;
    }

    return { originalPrice, finalPrice, discount, promotion: applicablePromotion };
  };

  const handleAddItem = (menuItem) => {
    const menuItemId = menuItem._id || menuItem.id;
    if (!menuItemId) {
      console.error('Menu item ID is undefined:', menuItem);
      return;
    }
    
    const priceInfo = calculatePriceWithPromotion(menuItem);
    const finalPrice = priceInfo.finalPrice;
    
    const existing = selectedItems.find((item) => item.menuItemId === menuItemId);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1, price: finalPrice, originalPrice: priceInfo.originalPrice }
            : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        { 
          menuItemId: menuItemId, 
          quantity: 1, 
          name: menuItem.name, 
          price: finalPrice,
          originalPrice: priceInfo.originalPrice,
          promotion: priceInfo.promotion
        },
      ]);
    }
  };

  const handleRemoveItem = (menuItemId) => {
    setSelectedItems(selectedItems.filter((item) => item.menuItemId !== menuItemId));
  };

  const handleUpdateQuantity = (menuItemId, quantity) => {
    if (quantity < 1) return;
    setSelectedItems(
      selectedItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một món');
      return;
    }

    if (!selectedTable) {
      alert('Vui lòng chọn bàn');
      return;
    }

    const tableId = selectedTable._id || selectedTable.id;
    if (!tableId) {
      alert('Lỗi: Không tìm thấy ID bàn');
      return;
    }

    // Validate all menu item IDs
    const invalidItems = selectedItems.filter(item => !item.menuItemId);
    if (invalidItems.length > 0) {
      alert('Lỗi: Một số món không có ID hợp lệ. Vui lòng thử lại.');
      return;
    }

    try {
      const orderData = {
        tableId: tableId,
        items: selectedItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: '',
        })),
      };
      await orderService.create(orderData);
      alert('Đặt bàn thành công!');
      setShowModal(false);
      setSelectedTable(null);
      setSelectedItems([]);
      loadTables();
    } catch (error) {
      alert('Lỗi khi đặt bàn: ' + (error.response?.data?.message || error.message));
    }
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const getTotalDiscount = () => {
    return selectedItems.reduce((sum, item) => {
      if (item.originalPrice && item.price) {
        const discountPerItem = item.originalPrice - item.price;
        return sum + discountPerItem * item.quantity;
      }
      return sum;
    }, 0);
  };

  const formatPromotionText = (promotion) => {
    if (!promotion) return '';
    switch (promotion.type) {
      case 'PERCENTAGE':
        return `Giảm ${promotion.discountValue}%`;
      case 'FIXED_AMOUNT':
        return `Giảm ${promotion.discountValue?.toLocaleString('vi-VN')} ₫`;
      case 'BUY_ONE_GET_ONE':
        return 'Mua 1 tặng 1';
      default:
        return 'Khuyến mãi';
    }
  };

  const getStatusBadge = (status) => {
    // Bàn đã thanh toán (PAID) hiển thị như "Trống" vì có thể đặt lại
    const displayStatus = status === 'PAID' ? 'AVAILABLE' : status;
    
    const badges = {
      AVAILABLE: 'badge-available',
      OCCUPIED: 'badge-occupied',
      PAID: 'badge-available', // Hiển thị như AVAILABLE
    };
    const labels = {
      AVAILABLE: 'Trống',
      OCCUPIED: 'Đã đặt',
      PAID: 'Trống', // Hiển thị như "Trống"
    };
    return <span className={`badge ${badges[displayStatus]}`}>{labels[displayStatus]}</span>;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Đặt Bàn</h2>
        <p style={{ marginBottom: '1rem', color: '#666' }}>Chọn bàn trống để đặt</p>

        <div className="grid">
          {tables.map((table) => {
            const tableId = table._id || table.id;
            return (
              <div
                key={tableId}
                className="card"
                style={{
                  cursor: (table.status === 'AVAILABLE' || table.status === 'PAID') ? 'pointer' : 'not-allowed',
                  opacity: (table.status === 'AVAILABLE' || table.status === 'PAID') ? 1 : 0.6,
                  border: (table.status === 'AVAILABLE' || table.status === 'PAID') ? '2px solid #6f4e37' : '1px solid #ddd',
                }}
                onClick={() => handleSelectTable(table)}
              >
                <h3>Bàn {table.tableNumber}</h3>
                <p>Sức chứa: {table.capacity} người</p>
                {getStatusBadge(table.status)}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <h2>Đặt Bàn {selectedTable.tableNumber}</h2>

            {/* Hiển thị promotions đang active */}
            {promotions.length > 0 && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '0.75rem', 
                background: '#fff3cd', 
                borderRadius: '4px',
                border: '1px solid #ffc107'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#856404' }}>
                  🎉 Khuyến mãi đang diễn ra:
                </div>
                {promotions.map((promo) => {
                  const promoId = promo._id || promo.id;
                  return (
                    <div key={promoId} style={{ fontSize: '0.875rem', color: '#856404', marginBottom: '0.25rem' }}>
                      • <strong>{promo.name}</strong>: {promo.description || formatPromotionText(promo)}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3>Menu</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {menuItems.map((item) => {
                    const itemId = item._id || item.id;
                    const priceInfo = calculatePriceWithPromotion(item);
                    const hasPromotion = priceInfo.promotion !== null;
                    
                    return (
                      <div
                        key={itemId}
                        style={{
                          padding: '1rem',
                          border: hasPromotion ? '2px solid #ffc107' : '1px solid #ddd',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                          cursor: 'pointer',
                          background: hasPromotion ? '#fff9e6' : 'white',
                        }}
                        onClick={() => handleAddItem(item)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                            <div style={{ color: '#666', fontSize: '0.875rem' }}>{item.description}</div>
                            {hasPromotion && (
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#856404', 
                                marginTop: '0.25rem',
                                fontWeight: 'bold'
                              }}>
                                🎉 {formatPromotionText(priceInfo.promotion)}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {hasPromotion ? (
                              <>
                                <div style={{ 
                                  textDecoration: 'line-through', 
                                  color: '#999', 
                                  fontSize: '0.875rem' 
                                }}>
                                  {priceInfo.originalPrice?.toLocaleString('vi-VN')} ₫
                                </div>
                                <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                  {priceInfo.finalPrice?.toLocaleString('vi-VN')} ₫
                                </div>
                              </>
                            ) : (
                              <div style={{ color: '#6f4e37', fontWeight: 'bold' }}>
                                {priceInfo.originalPrice?.toLocaleString('vi-VN')} ₫
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3>Order của bạn</h3>
                {selectedItems.length === 0 ? (
                  <p style={{ color: '#666' }}>Chưa có món nào</p>
                ) : (
                  <>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedItems.map((item) => (
                        <div
                          key={item.menuItemId}
                          style={{
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                            {item.originalPrice && item.originalPrice !== item.price ? (
                              <div>
                                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                                  {item.originalPrice?.toLocaleString('vi-VN')} ₫
                                </span>
                                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                  {item.price?.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                            ) : (
                              <div style={{ color: '#666' }}>{item.price?.toLocaleString('vi-VN')} ₫</div>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity - 1)}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleUpdateQuantity(item.menuItemId, item.quantity + 1)}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleRemoveItem(item.menuItemId)}
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
                      {getTotalDiscount() > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                          <span>Tổng tiền gốc:</span>
                          <span style={{ textDecoration: 'line-through' }}>
                            {(getTotalAmount() + getTotalDiscount()).toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      )}
                      {getTotalDiscount() > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#d32f2f', fontWeight: 'bold' }}>
                          <span>Tiết kiệm:</span>
                          <span>-{getTotalDiscount().toLocaleString('vi-VN')} ₫</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', paddingTop: '0.5rem', borderTop: '1px solid #ddd' }}>
                        <span>Tổng cộng:</span>
                        <span style={{ color: '#6f4e37' }}>{getTotalAmount().toLocaleString('vi-VN')} ₫</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setSelectedTable(null);
                  setSelectedItems([]);
                }}
              >
                Hủy
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmitOrder}>
                Đặt bàn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookTable;
