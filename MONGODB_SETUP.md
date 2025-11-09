# Hướng dẫn cấu hình MongoDB Atlas

## Bước 1: Tạo MongoDB Atlas Cluster (nếu chưa có)
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Đăng ký/Đăng nhập tài khoản
3. Tạo cluster miễn phí (M0)

## Bước 2: Lấy connection string
Connection string mẫu đã có:
```
mongodb+srv://<db_username>:<db_password>@cluster0.hntwotb.mongodb.net/?appName=Cluster0
```

## Bước 3: Cấu hình trong docker-compose.yml
Thay thế `<db_username>` và `<db_password>` bằng thông tin thực tế:

```yaml
backend:
  environment:
    MONGODB_URI: mongodb+srv://your_username:your_password@cluster0.hntwotb.mongodb.net/?appName=Cluster0
    MONGODB_DATABASE: cafe_db
```

## Bước 4: Whitelist IP
1. Vào MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Chọn "Allow Access from Anywhere" (0.0.0.0/0) hoặc thêm IP cụ thể

## Bước 5: Tạo Database User
1. Database Access → Add New Database User
2. Tạo username và password
3. Grant quyền "Read and write to any database"

## Bước 6: Khởi động lại dự án
```bash
docker-compose down
docker-compose up -d --build
```

## Thay đổi chính từ PostgreSQL sang MongoDB:
- ✅ Xóa container PostgreSQL
- ✅ Chuyển JPA entities → MongoDB documents
- ✅ Chuyển JpaRepository → MongoRepository
- ✅ ID từ Long → String
- ✅ OrderItem từ Entity → Embedded Document
- ✅ Relationship: @ManyToOne/@OneToMany → @DBRef

## Kiểm tra kết nối
Sau khi khởi động, kiểm tra logs:
```bash
docker-compose logs backend
```

Tìm dòng: "Connected to MongoDB successfully" hoặc "Started CafeManagementApplication"
