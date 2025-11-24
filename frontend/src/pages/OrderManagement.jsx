import React, { useState, useEffect } from 'react';
import { orderService, tableService } from '../api/services';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [transferringOrderId, setTransferringOrderId] = useState(null);
  const [selectedNewTableId, setSelectedNewTableId] = useState('');

  useEffect(() => {
    loadOrders();
    loadTables();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadTables = async () => {
    try {
      const response = await tableService.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      loadOrders();
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleTransferTable = async (orderId) => {
    if (!selectedNewTableId) {
      alert('Vui lòng chọn bàn mới');
      return;
    }
    try {
      await orderService.transferTable(orderId, selectedNewTableId);
      setTransferringOrderId(null);
      setSelectedNewTableId('');
      loadOrders();
      loadTables();
      alert('Chuyển bàn thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi chuyển bàn');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'badge-pending',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled',
    };
    const labels = {
      PENDING: 'Đang chờ',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Hủy',
    };
    return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Quản Lý Order</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Bàn</th>
                <th>Khách hàng</th>
                <th>Món</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const orderId = order._id || order.id;
                const table = order.tableId || order.table;
                const user = order.userId || order.user;
                return (
                  <tr key={orderId}>
                    <td>#{orderId?.toString().slice(-6) || 'N/A'}</td>
                    <td>
                      {table?.tableNumber ? `Bàn ${table.tableNumber}` : 'N/A'}
                    </td>
                    <td>{user?.fullName || user?.username || 'N/A'}</td>
                    <td>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '0.25rem' }}>
                            {item.menuItemName || item.menuItem?.name || 'N/A'} x{item.quantity}
                          </div>
                        ))
                      ) : (
                        <span style={{ color: '#666' }}>Không có món</span>
                      )}
                    </td>
                    <td>{order.totalAmount?.toLocaleString('vi-VN') || '0'} ₫</td>
                    <td>{getStatusBadge(order.status || 'PENDING')}</td>
                    <td>
                      {order.orderTime
                        ? new Date(order.orderTime).toLocaleString('vi-VN')
                        : '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <select
                          value={order.status || 'PENDING'}
                          onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                          style={{ padding: '0.25rem' }}
                        >
                          <option value="PENDING">Đang chờ</option>
                          <option value="COMPLETED">Hoàn thành</option>
                          <option value="CANCELLED">Hủy</option>
                        </select>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => setTransferringOrderId(orderId)}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                          >
                            Chuyển bàn
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chuyển bàn */}
      {transferringOrderId && (
        <div className="modal-overlay" onClick={() => setTransferringOrderId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Chuyển bàn cho Order #{transferringOrderId?.toString().slice(-6) || transferringOrderId}</h3>
            <div className="form-group">
              <label>Chọn bàn mới (chỉ hiển thị bàn trống)</label>
              <select
                value={selectedNewTableId}
                onChange={(e) => setSelectedNewTableId(e.target.value)}
              >
                <option value="">-- Chọn bàn --</option>
                {tables
                  .filter((table) => table.status === 'AVAILABLE')
                  .map((table) => {
                    const tableId = table._id || table.id;
                    return (
                      <option key={tableId} value={tableId}>
                        Bàn {table.tableNumber} - {table.capacity || table.seats || 0} chỗ
                      </option>
                    );
                  })}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => handleTransferTable(transferringOrderId)}
                className="btn btn-primary"
              >
                Xác nhận chuyển
              </button>
              <button
                onClick={() => {
                  setTransferringOrderId(null);
                  setSelectedNewTableId('');
                }}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
