import React, { useState, useEffect } from 'react';
import { reportService } from '../api/services';

function Reports() {
  const [report, setReport] = useState(null);
  const [reportType, setReportType] = useState('daily'); // 'daily' or 'monthly'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  useEffect(() => {
    loadReport();
  }, [selectedDate, selectedMonth, reportType]);

  const loadReport = async () => {
    try {
      let response;
      if (reportType === 'daily') {
        response = await reportService.getDailyReport(selectedDate);
      } else {
        response = await reportService.getMonthlyReport(selectedMonth.year, selectedMonth.month);
      }
      setReport(response.data);
    } catch (error) {
      console.error('Error loading report:', error);
    }
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedMonth({ year: parseInt(year), month: parseInt(month) });
  };

  const getMonthInputValue = () => {
    return `${selectedMonth.year}-${String(selectedMonth.month).padStart(2, '0')}`;
  };

  if (!report) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Báo Cáo Doanh Thu</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1rem' }}>
            <label>Loại báo cáo</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Theo ngày</option>
              <option value="monthly">Theo tháng</option>
            </select>
          </div>

          {reportType === 'daily' ? (
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label>Chọn ngày</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          ) : (
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label>Chọn tháng</label>
              <input
                type="month"
                value={getMonthInputValue()}
                onChange={handleMonthChange}
              />
            </div>
          )}
        </div>

        <div className="grid">
          <div className="card" style={{ background: '#e3f2fd' }}>
            <h3>Tổng số đơn hàng</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2', margin: '0.5rem 0' }}>
              {report.totalOrders}
            </p>
          </div>

          <div className="card" style={{ background: '#f3e5f5' }}>
            <h3>Tổng số khách</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7b1fa2', margin: '0.5rem 0' }}>
              {report.totalCustomers}
            </p>
          </div>

          <div className="card" style={{ background: '#e8f5e9' }}>
            <h3>Tổng doanh thu</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#388e3c', margin: '0.5rem 0' }}>
              {report.totalRevenue?.toLocaleString('vi-VN')} ₫
            </p>
          </div>

          <div className="card" style={{ background: '#fff3e0' }}>
            <h3>Đơn hoàn thành</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f57c00', margin: '0.5rem 0' }}>
              {report.completedOrders}
            </p>
          </div>

          <div className="card" style={{ background: '#fce4ec' }}>
            <h3>Đơn đang chờ</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c2185b', margin: '0.5rem 0' }}>
              {report.pendingOrders}
            </p>
          </div>

          <div className="card" style={{ background: '#ffebee' }}>
            <h3>Đơn đã hủy</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d32f2f', margin: '0.5rem 0' }}>
              {report.cancelledOrders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
