# Hướng dẫn chạy hệ thống

## Yêu cầu
- Docker Desktop phải được cài đặt và chạy
- Port 3000, 8080, 5432 chưa được sử dụng

## Khởi động hệ thống

### Cách 1: Sử dụng Docker Compose (Khuyến nghị)

```powershell
# Di chuyển vào thư mục project
cd d:\9.cong_viec_tren_lop\web_cafe

# Khởi động tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng hệ thống
docker-compose down

# Xóa toàn bộ dữ liệu
docker-compose down -v
```

### Cách 2: Chạy local (Development)

#### Backend
```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend
```powershell
cd frontend
npm install
npm start
```

## Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## Tài khoản mặc định

**Root Admin:**
- Username: `root`
- Password: `root123`

## Tính năng chính

### Người dùng (USER)
- Đăng ký tài khoản
- Đăng nhập
- Xem menu
- Đặt bàn và order món
- Xem order của mình

### Quản trị viên (ADMIN)
- Tất cả tính năng của USER
- Quản lý menu (thêm/sửa/xóa món)
- Quản lý bàn (thêm/sửa/xóa bàn, cập nhật trạng thái)
- Quản lý order (xem tất cả order, cập nhật trạng thái)
- Xem báo cáo doanh thu theo ngày

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Menu
- `GET /api/menu` - Lấy danh sách menu
- `GET /api/menu/available` - Lấy menu còn hàng
- `POST /api/menu` - Tạo món mới (Admin)
- `PUT /api/menu/{id}` - Cập nhật món (Admin)
- `DELETE /api/menu/{id}` - Xóa món (Admin)

### Tables
- `GET /api/tables` - Lấy danh sách bàn
- `GET /api/tables/available` - Lấy bàn trống
- `POST /api/tables` - Tạo bàn mới (Admin)
- `PUT /api/tables/{id}` - Cập nhật bàn (Admin)
- `PATCH /api/tables/{id}/status` - Cập nhật trạng thái (Admin)
- `DELETE /api/tables/{id}` - Xóa bàn (Admin)

### Orders
- `GET /api/orders` - Lấy tất cả order (Admin)
- `GET /api/orders/my-orders` - Lấy order của mình
- `POST /api/orders` - Tạo order mới
- `PATCH /api/orders/{id}/status` - Cập nhật trạng thái (Admin)

### Reports
- `GET /api/reports/today` - Báo cáo hôm nay (Admin)
- `GET /api/reports/daily?date=YYYY-MM-DD` - Báo cáo theo ngày (Admin)

## Cấu trúc Database

### Tables
- `users` - Thông tin người dùng
- `menu_items` - Danh sách món trong menu
- `tables` - Danh sách bàn
- `orders` - Đơn hàng
- `order_items` - Chi tiết món trong đơn hàng

## Troubleshooting

### Lỗi port đã được sử dụng
```powershell
# Kiểm tra port đang chạy
netstat -ano | findstr :8080
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Dừng process nếu cần
taskkill /PID <PID> /F
```

### Reset database
```powershell
docker-compose down -v
docker-compose up -d
```

### Rebuild images
```powershell
docker-compose build --no-cache
docker-compose up -d
```

## Mở rộng

### Thay đổi database
Chỉnh sửa `docker-compose.yml` và `application.properties` để sử dụng MySQL, SQL Server, hoặc MongoDB.

### Thêm tính năng
1. Thêm entity/model mới trong backend
2. Tạo repository, service, controller tương ứng
3. Tạo API service và component/page trong frontend

## Hỗ trợ
Nếu gặp vấn đề, vui lòng kiểm tra logs:
```powershell
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```
