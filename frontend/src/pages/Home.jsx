import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api/services';

function Home() {
  const isAdmin = authService.isAdmin();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#6f4e37', marginBottom: '1rem' }}>
          ☕ Chào mừng đến với Quán Cafe
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          Hệ thống quản lý quán cafe hiện đại và tiện lợi
        </p>

        <div className="grid" style={{ marginTop: '2rem' }}>
          {isAdmin ? (
            <>
              <Link to="/admin/menu" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <h3>📋 Quản Lý Menu</h3>
                <p>Thêm, sửa, xóa các món trong menu</p>
              </Link>

              <Link to="/admin/tables" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <h3>🪑 Quản Lý Bàn</h3>
                <p>Quản lý bàn và trạng thái bàn</p>
              </Link>

              <Link to="/admin/orders" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <h3>📦 Quản Lý Order</h3>
                <p>Xem và cập nhật trạng thái order</p>
              </Link>

              <Link to="/admin/reports" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                <h3>📊 Báo Cáo</h3>
                <p>Xem báo cáo doanh thu và khách hàng</p>
              </Link>
            </>
          ) : (
            <Link to="/book-table" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <h3>🍽️ Đặt Bàn</h3>
              <p>Chọn bàn và order món ăn</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
