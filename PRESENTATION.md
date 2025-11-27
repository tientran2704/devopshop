# HỆ THỐNG QUẢN LÝ QUÁN CAFE
## Tóm tắt dự án cho thuyết trình

---

## 📋 1. GIỚI THIỆU DỰ ÁN

### 1.1. Tên dự án
**Hệ Thống Quản Lý Quán Cafe** (Cafe Management System)

### 1.2. Mục đích
Xây dựng hệ thống quản lý toàn diện cho quán cafe, hỗ trợ:
- Quản lý menu, bàn, đơn hàng
- Xử lý thanh toán (QR Code, VNPay, MoMo, ZaloPay)
- Quản lý kho hàng và giá cả
- Báo cáo doanh thu và thống kê
- Quản lý người dùng và phân quyền

### 1.3. Đối tượng sử dụng
- **Khách hàng (USER)**: Đặt bàn, xem menu, đặt món, thanh toán
- **Quản trị viên (ADMIN)**: Quản lý toàn bộ hệ thống

---

## 🛠️ 2. CÔNG NGHỆ SỬ DỤNG

### 2.1. Frontend
- **Framework**: React 18
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **UI**: Custom CSS với responsive design
- **QR Code**: qrcode.react library

### 2.2. Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas - Cloud)
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

### 2.3. DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Cloud Platform**: Render.com
  - Frontend: `https://cafe-frontend-25ua.onrender.com`
  - Backend: `https://devops-1-9r3z.onrender.com`
- **Version Control**: Git & GitHub
  - Repository: `https://github.com/tientran2704/devopshop.git`

### 2.4. Database Schema
- **Users**: Thông tin người dùng (username, password, role, email, phone)
- **MenuItems**: Sản phẩm trong menu (name, price, description, image, available)
- **CafeTables**: Thông tin bàn (tableNumber, capacity, status)
- **Orders**: Đơn hàng (tableId, userId, items, total, status, paymentMethod)
- **Ingredients**: Nguyên liệu (name, unit, stockQuantity, minStock)
- **StockTransactions**: Lịch sử nhập/xuất kho
- **PriceHistory**: Lịch sử thay đổi giá
- **Promotions**: Khuyến mãi (name, discount, startDate, endDate, active)
- **PaymentConfig**: Cấu hình thanh toán (QR Code, VNPay, MoMo, ZaloPay, Bank Transfer)

---

## ⚙️ 3. TÍNH NĂNG CHI TIẾT

### 3.1. Xác thực & Phân quyền
- ✅ Đăng ký tài khoản (vai trò mặc định: USER)
- ✅ Đăng nhập với JWT token
- ✅ Phân quyền: USER và ADMIN
- ✅ Tài khoản root mặc định:
  - Username: `root`
  - Password: `root123`
  - Role: ADMIN

### 3.2. Quản lý Menu (Admin)
- ✅ Thêm/Sửa/Xóa sản phẩm
- ✅ Upload hình ảnh sản phẩm
- ✅ Quản lý giá và mô tả
- ✅ Bật/tắt trạng thái có sẵn
- ✅ Xem menu công khai (User)

### 3.3. Quản lý Bàn (Admin)
- ✅ Tạo/Sửa/Xóa bàn
- ✅ Quản lý trạng thái bàn:
  - `AVAILABLE`: Bàn trống
  - `OCCUPIED`: Bàn đang có khách
  - `PAID`: Bàn đã thanh toán
- ✅ Xem danh sách bàn trống (User)

### 3.4. Đặt Bàn & Order (User)
- ✅ Xem danh sách bàn trống
- ✅ Đặt bàn và tạo order
- ✅ Chọn món từ menu
- ✅ Chọn số lượng món
- ✅ Xem order của mình
- ✅ Đặt hàng online (không cần bàn)

### 3.5. Quản lý Order (Admin)
- ✅ Xem tất cả order theo bàn
- ✅ Xem order online
- ✅ Cập nhật trạng thái order:
  - `PENDING`: Đang chờ
  - `CONFIRMED`: Đã xác nhận
  - `PREPARING`: Đang chuẩn bị
  - `READY`: Sẵn sàng
  - `COMPLETED`: Hoàn thành
  - `CANCELLED`: Đã hủy
- ✅ Chuyển bàn cho order
- ✅ Xử lý thanh toán

### 3.6. Thanh Toán
- ✅ Thanh toán bằng QR Code (upload hình ảnh)
- ✅ Thanh toán bằng VNPay
- ✅ Thanh toán bằng MoMo
- ✅ Thanh toán bằng ZaloPay
- ✅ Chuyển khoản ngân hàng
- ✅ Quản lý cấu hình thanh toán (Admin)
- ✅ Xem QR Code thanh toán cho order

### 3.7. Quản lý Kho Hàng (Admin)
- ✅ Quản lý nguyên liệu (Ingredients)
- ✅ Nhập kho (Import)
- ✅ Xuất kho (Export)
- ✅ Điều chỉnh tồn kho (Adjust)
- ✅ Cảnh báo tồn kho thấp (Low Stock Alert)
- ✅ Xem lịch sử giao dịch kho

### 3.8. Quản lý Giá (Admin)
- ✅ Cập nhật giá sản phẩm
- ✅ Xem lịch sử thay đổi giá
- ✅ Lọc lịch sử theo sản phẩm

### 3.9. Quản lý Khuyến Mãi (Admin)
- ✅ Tạo/Sửa/Xóa khuyến mãi
- ✅ Thiết lập % giảm giá
- ✅ Thiết lập thời gian áp dụng (startDate, endDate)
- ✅ Bật/tắt khuyến mãi
- ✅ Xem khuyến mãi đang hoạt động

### 3.10. Quản lý Người Dùng (Admin)
- ✅ Xem danh sách tất cả người dùng
- ✅ Thay đổi vai trò (USER ↔ ADMIN)
- ✅ Xóa người dùng (trừ root)
- ✅ Bảo vệ tài khoản root

### 3.11. Báo Cáo & Thống Kê (Admin)
- ✅ Báo cáo doanh thu theo ngày
- ✅ Báo cáo doanh thu theo tháng
- ✅ Tổng số khách trong ngày
- ✅ Tổng doanh thu trong ngày
- ✅ Lọc báo cáo theo ngày cụ thể

### 3.12. Thông Tin Cá Nhân
- ✅ Xem thông tin tài khoản
- ✅ Hiển thị vai trò, email, số điện thoại
- ✅ Xem ngày tạo tài khoản

---

## 📡 4. API ENDPOINTS

### 4.1. Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập

### 4.2. Menu
- `GET /api/menu` - Lấy danh sách menu (Admin)
- `GET /api/menu/available` - Lấy menu còn hàng (Public)
- `POST /api/menu` - Tạo món mới (Admin)
- `PUT /api/menu/:id` - Cập nhật món (Admin)
- `DELETE /api/menu/:id` - Xóa món (Admin)

### 4.3. Tables
- `GET /api/tables` - Lấy danh sách bàn (Admin)
- `GET /api/tables/available` - Lấy bàn trống (Public)
- `POST /api/tables` - Tạo bàn mới (Admin)
- `PUT /api/tables/:id` - Cập nhật bàn (Admin)
- `PATCH /api/tables/:id/status` - Cập nhật trạng thái (Admin)
- `DELETE /api/tables/:id` - Xóa bàn (Admin)

### 4.4. Orders
- `GET /api/orders` - Lấy tất cả order (Admin)
- `GET /api/orders/my-orders` - Lấy order của mình (User)
- `GET /api/orders/table/:tableId` - Lấy order theo bàn
- `GET /api/orders/:id` - Lấy order theo ID
- `POST /api/orders` - Tạo order mới (User)
- `POST /api/orders/online` - Tạo order online (User)
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái (Admin)
- `PATCH /api/orders/:id/transfer-table` - Chuyển bàn (Admin)
- `POST /api/orders/:id/process-payment` - Xử lý thanh toán
- `GET /api/orders/:id/qr-payment` - Lấy QR thanh toán
- `GET /api/orders/:id/payment-status` - Kiểm tra trạng thái thanh toán

### 4.5. Reports
- `GET /api/reports/today` - Báo cáo hôm nay (Admin)
- `GET /api/reports/daily?date=YYYY-MM-DD` - Báo cáo theo ngày (Admin)
- `GET /api/reports/monthly?year=YYYY&month=MM` - Báo cáo theo tháng (Admin)

### 4.6. Inventory
- `GET /api/inventory` - Lấy danh sách nguyên liệu (Admin)
- `GET /api/inventory/low-stock` - Cảnh báo tồn kho thấp (Admin)
- `GET /api/inventory/:id` - Lấy nguyên liệu theo ID (Admin)
- `POST /api/inventory` - Tạo nguyên liệu mới (Admin)
- `PUT /api/inventory/:id` - Cập nhật nguyên liệu (Admin)
- `DELETE /api/inventory/:id` - Xóa nguyên liệu (Admin)
- `POST /api/inventory/:id/import` - Nhập kho (Admin)
- `POST /api/inventory/:id/export` - Xuất kho (Admin)
- `POST /api/inventory/:id/adjust` - Điều chỉnh tồn kho (Admin)
- `GET /api/inventory/transactions` - Lịch sử giao dịch (Admin)

### 4.7. Prices
- `PUT /api/prices/menu/:menuItemId` - Cập nhật giá (Admin)
- `GET /api/prices/history` - Lịch sử thay đổi giá (Admin)
- `GET /api/prices/history/menu/:menuItemId` - Lịch sử giá theo sản phẩm (Admin)

### 4.8. Promotions
- `GET /api/promotions` - Lấy danh sách khuyến mãi (Admin)
- `GET /api/promotions/active` - Lấy khuyến mãi đang hoạt động (Public)
- `GET /api/promotions/:id` - Lấy khuyến mãi theo ID (Admin)
- `POST /api/promotions` - Tạo khuyến mãi mới (Admin)
- `PUT /api/promotions/:id` - Cập nhật khuyến mãi (Admin)
- `DELETE /api/promotions/:id` - Xóa khuyến mãi (Admin)
- `POST /api/promotions/:id/toggle` - Bật/tắt khuyến mãi (Admin)

### 4.9. Payment Config
- `GET /api/payment-config` - Lấy danh sách cấu hình (Admin)
- `GET /api/payment-config/active` - Lấy cấu hình đang hoạt động (Public)
- `GET /api/payment-config/:id` - Lấy cấu hình theo ID (Admin)
- `POST /api/payment-config` - Tạo cấu hình mới (Admin)
- `PUT /api/payment-config/:id` - Cập nhật cấu hình (Admin)
- `DELETE /api/payment-config/:id` - Xóa cấu hình (Admin)
- `POST /api/payment-config/:id/toggle` - Bật/tắt cấu hình (Admin)

### 4.10. Users
- `GET /api/users` - Lấy danh sách người dùng (Admin)
- `GET /api/users/me` - Lấy thông tin cá nhân (User)
- `GET /api/users/:id` - Lấy người dùng theo ID (Admin)
- `PATCH /api/users/:id/role` - Thay đổi vai trò (Admin)
- `DELETE /api/users/:id` - Xóa người dùng (Admin)

---

## 🚀 5. HƯỚNG DẪN CÀI ĐẶT & CHẠY

### 5.1. Yêu cầu hệ thống
- Node.js 16+ (cho backend)
- npm hoặc yarn
- MongoDB Atlas account (hoặc MongoDB local)
- Docker Desktop (nếu chạy bằng Docker)

### 5.2. Cài đặt Local

#### Backend
```bash
cd backend-nodejs
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### 5.3. Chạy bằng Docker Compose
```bash
docker-compose up -d
```

### 5.4. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: MongoDB Atlas (cloud)

### 5.5. Tài khoản mặc định
- **Username**: `root`
- **Password**: `root123`
- **Role**: ADMIN

---

## 🌐 6. DEPLOYMENT

### 6.1. GitHub Repository
- **URL**: `https://github.com/tientran2704/devopshop.git`
- **Branch**: `main`

### 6.2. CI/CD Pipeline
- **GitHub Actions**: Tự động build và test khi push code
- **Workflow**: `Devopshop CI/CD Pipeline`
- **Jobs**: 
  - Install dependencies
  - Run backend tests (if any)
  - Build frontend

### 6.3. Cloud Deployment (Render.com)
- **Frontend**: 
  - URL: `https://cafe-frontend-25ua.onrender.com`
  - Environment: Production
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
  
- **Backend**: 
  - URL: `https://devops-1-9r3z.onrender.com`
  - Environment Variables:
    - `MONGODB_URI`: MongoDB Atlas connection string
    - `JWT_SECRET`: Secret key for JWT
    - `CORS_ORIGIN`: Allowed frontend origins
    - `PORT`: 8080

### 6.4. Environment Variables
**Frontend (Render)**:
- `REACT_APP_API_URL`: `https://devops-1-9r3z.onrender.com`

**Backend (Render)**:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `CORS_ORIGIN`: `http://localhost:3000,https://cafe-frontend-25ua.onrender.com`
- `PORT`: 8080

---

## 📊 7. KIẾN TRÚC HỆ THỐNG

### 7.1. Kiến trúc tổng quan
```
┌─────────────┐
│   Frontend  │  React 18 (SPA)
│   (React)   │  Port: 3000
└──────┬──────┘
       │ HTTP/REST API
       │
┌──────▼──────┐
│   Backend   │  Node.js + Express
│  (Express)  │  Port: 8080
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB   │  MongoDB Atlas (Cloud)
│   Atlas    │
└────────────┘
```

### 7.2. Cấu trúc thư mục
```
DevOpsDT/
├── backend-nodejs/
│   ├── config/
│   │   └── initData.js          # Khởi tạo dữ liệu mặc định
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── CafeTable.js
│   │   ├── Order.js
│   │   ├── Ingredient.js
│   │   ├── StockTransaction.js
│   │   ├── PriceHistory.js
│   │   ├── Promotion.js
│   │   └── PaymentConfig.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── tables.js
│   │   ├── orders.js
│   │   ├── reports.js
│   │   ├── inventory.js
│   │   ├── prices.js
│   │   ├── promotions.js
│   │   ├── paymentConfig.js
│   │   └── users.js
│   ├── utils/
│   │   └── jwt.js
│   ├── uploads/                 # Thư mục lưu file upload
│   ├── server.js                # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js         # Axios configuration
│   │   │   └── services.js      # API service functions
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MenuManagement.jsx
│   │   │   ├── TableManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   ├── BookTable.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── InventoryManagement.jsx
│   │   │   ├── PriceManagement.jsx
│   │   │   ├── PromotionManagement.jsx
│   │   │   ├── PaymentManagement.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ViewMenu.jsx
│   │   │   ├── OrderOnline.jsx
│   │   │   └── Payment.jsx
│   │   ├── utils/
│   │   │   └── authDebug.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # GitHub Actions CI/CD
│
├── docker-compose.yml
├── README.md
├── SETUP.md
└── PRESENTATION.md
```

---

## 🔒 8. BẢO MẬT

### 8.1. Authentication & Authorization
- ✅ JWT Token-based authentication
- ✅ Password hashing với bcryptjs (10 rounds)
- ✅ Protected routes với middleware
- ✅ Role-based access control (USER/ADMIN)

### 8.2. API Security
- ✅ CORS configuration cho phép origins cụ thể
- ✅ Input validation
- ✅ Error handling không tiết lộ thông tin nhạy cảm
- ✅ Token expiration

### 8.3. Data Protection
- ✅ Password không được trả về trong API response
- ✅ Bảo vệ tài khoản root (không thể xóa/đổi role)
- ✅ Admin không thể tự xóa quyền của mình

---

## 📈 9. TÍNH NĂNG NỔI BẬT

### 9.1. Quản lý đa dạng phương thức thanh toán
- Hỗ trợ 5 phương thức: QR Code, VNPay, MoMo, ZaloPay, Bank Transfer
- Upload và quản lý QR Code thanh toán
- Cấu hình linh hoạt cho từng phương thức

### 9.2. Quản lý kho hàng thông minh
- Cảnh báo tồn kho thấp tự động
- Lịch sử nhập/xuất kho chi tiết
- Điều chỉnh tồn kho linh hoạt

### 9.3. Quản lý giá và lịch sử
- Theo dõi lịch sử thay đổi giá
- Xem lịch sử theo từng sản phẩm

### 9.4. Hệ thống khuyến mãi
- Tạo khuyến mãi với % giảm giá
- Thiết lập thời gian áp dụng
- Bật/tắt khuyến mãi dễ dàng

### 9.5. Báo cáo đa dạng
- Báo cáo theo ngày
- Báo cáo theo tháng
- Thống kê số khách và doanh thu

---

## 🎯 10. ĐIỂM MẠNH CỦA DỰ ÁN

1. **Full-stack Application**: Hoàn chỉnh từ frontend đến backend
2. **Modern Tech Stack**: Sử dụng công nghệ hiện đại (React 18, Node.js, MongoDB)
3. **Cloud Deployment**: Deploy trên Render.com, có thể truy cập từ mọi nơi
4. **CI/CD Pipeline**: Tự động hóa build và test với GitHub Actions
5. **Docker Support**: Có thể chạy bằng Docker Compose
6. **Responsive Design**: Giao diện thân thiện, hỗ trợ nhiều thiết bị
7. **Comprehensive Features**: Đầy đủ tính năng cho quản lý quán cafe
8. **Security**: Bảo mật tốt với JWT, password hashing, role-based access

---

## 🔮 11. HƯỚNG PHÁT TRIỂN TƯƠNG LAI

1. **Mobile App**: Phát triển ứng dụng mobile (React Native)
2. **Real-time Updates**: WebSocket cho cập nhật real-time
3. **Payment Gateway Integration**: Tích hợp thực tế với VNPay, MoMo API
4. **Email Notifications**: Gửi email xác nhận đơn hàng
5. **Loyalty Program**: Chương trình tích điểm khách hàng
6. **Analytics Dashboard**: Dashboard phân tích dữ liệu nâng cao
7. **Multi-language Support**: Hỗ trợ đa ngôn ngữ
8. **Print Receipt**: In hóa đơn tự động

---

## 📞 12. THÔNG TIN LIÊN HỆ

- **Repository**: https://github.com/tientran2704/devopshop
- **Frontend Demo**: https://cafe-frontend-25ua.onrender.com
- **Backend API**: https://devops-1-9r3z.onrender.com

---

## 📝 13. GHI CHÚ THUYẾT TRÌNH

### Slide 1: Giới thiệu
- Tên dự án, mục đích, đối tượng sử dụng

### Slide 2: Công nghệ
- Frontend: React 18
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Deployment: Render.com
- CI/CD: GitHub Actions

### Slide 3: Tính năng chính
- Quản lý menu, bàn, order
- Thanh toán đa dạng
- Quản lý kho, giá, khuyến mãi
- Báo cáo và thống kê

### Slide 4: Demo
- Đăng nhập với tài khoản root
- Demo các tính năng chính
- Hiển thị giao diện

### Slide 5: Kiến trúc & Deployment
- Sơ đồ kiến trúc
- CI/CD Pipeline
- Cloud deployment

### Slide 6: Kết luận
- Điểm mạnh của dự án
- Hướng phát triển tương lai

---

**Chúc bạn thuyết trình thành công! 🎉**

