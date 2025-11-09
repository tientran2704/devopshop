import React, { useState, useEffect } from 'react';
import { orderService } from '../api/services';

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Lỗi khi tải danh sách đơn hàng');
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
        <h2>Đơn Hàng Của Tôi</h2>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            Bạn chưa có đơn hàng nào
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bàn</th>
                  <th>Món</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thời gian đặt</th>
                  <th>Thời gian hoàn thành</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>Bàn {order.table.tableNumber}</td>
                    <td>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>
                          {item.menuItem.name} x{item.quantity}
                          {item.notes && (
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>
                              {' '}
                              ({item.notes})
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      {order.totalAmount?.toLocaleString('vi-VN')} ₫
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{new Date(order.orderTime).toLocaleString('vi-VN')}</td>
                    <td>
                      {order.completedTime
                        ? new Date(order.completedTime).toLocaleString('vi-VN')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
