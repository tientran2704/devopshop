# BACKEND - HỆ THỐNG QUẢN LÝ QUÁN CAFE
## Hướng dẫn thuyết trình chi tiết về Backend

---

## 📋 MỤC LỤC THUYẾT TRÌNH

1. [Giới thiệu Backend](#1-giới-thiệu-backend)
2. [Kiến trúc & Công nghệ](#2-kiến-trúc--công-nghệ)
3. [Cấu trúc Project](#3-cấu-trúc-project)
4. [Entry Point - server.js](#4-entry-point---serverjs)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Database Models](#6-database-models)
7. [API Routes](#7-api-routes)
8. [Middleware](#8-middleware)
9. [Error Handling](#9-error-handling)
10. [Deployment & CI/CD](#10-deployment--cicd)
11. [Demo & Code Walkthrough](#11-demo--code-walkthrough)

---

## 1. GIỚI THIỆU BACKEND

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Backend của hệ thống được xây dựng bằng Node.js và Express.js, đóng vai trò là API server cung cấp các endpoint RESTful cho frontend."
> - "Backend xử lý tất cả logic nghiệp vụ, kết nối với database MongoDB Atlas, và đảm bảo bảo mật thông qua JWT authentication."

### 1.1. Vai trò của Backend
- **API Server**: Cung cấp RESTful API cho frontend
- **Business Logic**: Xử lý logic nghiệp vụ (quản lý menu, order, thanh toán, kho hàng)
- **Data Layer**: Kết nối và quản lý dữ liệu với MongoDB
- **Security**: Xác thực và phân quyền người dùng
- **File Management**: Xử lý upload file (hình ảnh menu, QR code thanh toán)

### 1.2. Công nghệ chính
- **Runtime**: Node.js (JavaScript runtime)
- **Framework**: Express.js (Web framework)
- **Database**: MongoDB Atlas (Cloud database)
- **ORM/ODM**: Mongoose (MongoDB object modeling)
- **Authentication**: JWT (JSON Web Token)
- **Security**: bcryptjs (Password hashing)
- **File Upload**: Multer (Multipart form data)

---

## 2. KIẾN TRÚC & CÔNG NGHỆ

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Backend sử dụng kiến trúc MVC (Model-View-Controller), nhưng trong trường hợp này là Model-Route-Controller vì chúng ta chỉ cung cấp API."
> - "Luồng xử lý request: Client → Express Middleware → Route Handler → Model (Database) → Response"

### 2.1. Kiến trúc tổng quan

```
┌─────────────┐
│   Client    │  (Frontend React)
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request (REST API)
       │
┌──────▼─────────────────────────────────┐
│         Express.js Server              │
│  ┌─────────────────────────────────┐   │
│  │  Middleware Layer               │   │
│  │  - CORS                         │   │
│  │  - Body Parser                 │   │
│  │  - Authentication (JWT)        │   │
│  │  - Authorization (Role-based)   │   │
│  └───────────┬───────────────────┘   │
│              │                        │
│  ┌───────────▼───────────────────┐   │
│  │  Route Handlers                │   │
│  │  - /api/auth                   │   │
│  │  - /api/menu                   │   │
│  │  - /api/orders                 │   │
│  │  - /api/tables                 │   │
│  │  - ... (10 routes)            │   │
│  └───────────┬───────────────────┘   │
│              │                        │
│  ┌───────────▼───────────────────┐   │
│  │  Models (Mongoose)              │   │
│  │  - User                         │   │
│  │  - MenuItem                     │   │
│  │  - Order                        │   │
│  │  - ... (9 models)              │   │
│  └───────────┬───────────────────┘   │
└──────────────┼────────────────────────┘
               │
               │ MongoDB Query
               │
┌──────────────▼──────────────┐
│    MongoDB Atlas (Cloud)    │
│    - Database: cafe_db      │
│    - Collections: 9 tables  │
└─────────────────────────────┘
```

### 2.2. Request Flow chi tiết

```
1. Client gửi HTTP Request
   ↓
2. Express nhận request
   ↓
3. CORS Middleware kiểm tra origin
   ↓
4. Body Parser parse JSON/Form data
   ↓
5. Route matching (ví dụ: POST /api/auth/login)
   ↓
6. Authentication Middleware (nếu cần)
   - Kiểm tra JWT token trong header
   - Verify token và lấy user info
   ↓
7. Authorization Middleware (nếu cần)
   - Kiểm tra role (USER/ADMIN)
   ↓
8. Route Handler xử lý logic
   - Validate input
   - Query database qua Model
   - Xử lý business logic
   ↓
9. Response trả về JSON
   ↓
10. Error Handler (nếu có lỗi)
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở Postman hoặc browser console
> - Gửi request: `GET https://devops-1-9r3z.onrender.com/api/health`
> - Giải thích từng bước trong flow

---

## 3. CẤU TRÚC PROJECT

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Cấu trúc project backend được tổ chức theo mô hình MVC, tách biệt rõ ràng giữa models, routes, và middleware."
> - "Mỗi module có file riêng để dễ bảo trì và mở rộng."

### 3.1. Cấu trúc thư mục

```
backend-nodejs/
├── config/
│   └── initData.js          # Khởi tạo dữ liệu mặc định (root user)
│
├── middleware/
│   └── auth.js              # JWT authentication & authorization middleware
│
├── models/                  # Mongoose Models (Database Schema)
│   ├── User.js              # Model người dùng
│   ├── MenuItem.js          # Model sản phẩm menu
│   ├── CafeTable.js         # Model bàn
│   ├── Order.js             # Model đơn hàng
│   ├── Ingredient.js        # Model nguyên liệu
│   ├── StockTransaction.js  # Model lịch sử kho
│   ├── PriceHistory.js      # Model lịch sử giá
│   ├── Promotion.js         # Model khuyến mãi
│   └── PaymentConfig.js     # Model cấu hình thanh toán
│
├── routes/                  # API Route Handlers
│   ├── auth.js              # /api/auth (login, register)
│   ├── menu.js              # /api/menu
│   ├── tables.js            # /api/tables
│   ├── orders.js            # /api/orders
│   ├── reports.js           # /api/reports
│   ├── inventory.js         # /api/inventory
│   ├── prices.js            # /api/prices
│   ├── promotions.js        # /api/promotions
│   ├── paymentConfig.js     # /api/payment-config
│   └── users.js             # /api/users
│
├── utils/
│   └── jwt.js               # JWT token generation utility
│
├── uploads/                 # Thư mục lưu file upload
│   └── qr-codes/            # QR code images
│
├── server.js                # Entry point - Main application file
├── package.json             # Dependencies & scripts
└── Dockerfile               # Docker configuration
```

### 3.2. Giải thích từng thư mục

**📁 config/**: Cấu hình và khởi tạo dữ liệu
- `initData.js`: Tự động tạo root user khi server khởi động

**📁 middleware/**: Middleware functions
- `auth.js`: Xác thực JWT và kiểm tra quyền truy cập

**📁 models/**: Database schemas (Mongoose)
- Mỗi file định nghĩa schema và model cho một collection trong MongoDB

**📁 routes/**: API endpoints
- Mỗi file xử lý một nhóm endpoints liên quan

**📁 utils/**: Utility functions
- `jwt.js`: Hàm tạo và verify JWT token

**📁 uploads/**: File storage
- Lưu trữ file upload (hình ảnh menu, QR code)

---

## 4. ENTRY POINT - server.js

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "File server.js là entry point của ứng dụng, nơi khởi tạo Express server và cấu hình tất cả middleware, routes."
> - "Đây là file đầu tiên được chạy khi start server."

### 4.1. Code walkthrough

```javascript
// 1. Import dependencies
require('dotenv').config();  // Load environment variables
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
```

**Giải thích:**
- `dotenv`: Đọc biến môi trường từ file `.env`
- `express`: Framework web
- `cors`: Xử lý Cross-Origin Resource Sharing
- `mongoose`: MongoDB ODM

### 4.2. CORS Configuration

```javascript
// CORS: cho phép frontend local + frontend deploy
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn('❌ CORS blocked for origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

**Giải thích:**
- Cho phép requests từ các origins được cấu hình
- Hỗ trợ cả local development và production deployment
- `credentials: true`: Cho phép gửi cookies/headers authentication

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "CORS là cơ chế bảo mật của browser, ngăn chặn requests từ domain khác. Chúng ta cấu hình để cho phép frontend gọi API."

### 4.3. Body Parser Middleware

```javascript
app.use(express.json());        // Parse JSON body
app.use(express.urlencoded({ extended: true }));  // Parse form data
```

**Giải thích:**
- `express.json()`: Parse request body dạng JSON
- `express.urlencoded()`: Parse form data (application/x-www-form-urlencoded)

### 4.4. Static Files

```javascript
app.use('/uploads', express.static('uploads'));
```

**Giải thích:**
- Serve static files từ thư mục `uploads`
- Ví dụ: `http://localhost:8080/uploads/qr-codes/qr-123.jpg`

### 4.5. MongoDB Connection

```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://...')
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    // Initialize data
    const initializeData = require('./config/initData');
    await initializeData();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
```

**Giải thích:**
- Kết nối MongoDB Atlas (cloud database)
- Sau khi kết nối thành công, tự động khởi tạo dữ liệu mặc định (root user)

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "MongoDB Atlas là cloud database, không cần cài đặt local."
> - "Connection string được lưu trong biến môi trường để bảo mật."

### 4.6. Routes Registration

```javascript
// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
// ... other routes

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
// ... other routes
```

**Giải thích:**
- Mỗi route file xử lý một nhóm endpoints
- Tất cả routes có prefix `/api`

### 4.7. Error Handling

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    status: 404
  });
});
```

**Giải thích:**
- Middleware xử lý lỗi: Bắt tất cả errors và trả về JSON response
- 404 handler: Xử lý routes không tồn tại

### 4.8. Server Start

```javascript
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Authentication xác định người dùng là ai, Authorization xác định người dùng được phép làm gì."
> - "Chúng ta sử dụng JWT (JSON Web Token) để xác thực, và role-based access control để phân quyền."

### 5.1. JWT Authentication Flow

```
1. User đăng nhập
   POST /api/auth/login
   { username, password }
   ↓
2. Server verify username/password
   ↓
3. Server tạo JWT token
   - Payload: { userId, username, role }
   - Secret: JWT_SECRET
   - Expires: 24h
   ↓
4. Server trả về token
   { token: "eyJhbGc...", username, role }
   ↓
5. Client lưu token vào localStorage
   ↓
6. Client gửi token trong header mỗi request
   Authorization: Bearer eyJhbGc...
   ↓
7. Server verify token và lấy user info
   ↓
8. Server xử lý request với user context
```

### 5.2. JWT Token Generation (utils/jwt.js)

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'cafe_secret_key_2025...',
    { expiresIn: '24h' }
  );
};

module.exports = { generateToken };
```

**Giải thích:**
- `jwt.sign()`: Tạo token với payload (userId) và secret key
- `expiresIn: '24h'`: Token hết hạn sau 24 giờ

### 5.3. Authentication Middleware (middleware/auth.js)

```javascript
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Vui lòng đăng nhập để truy cập'
      });
    }

    // 2. Extract token
    const token = authHeader.substring(7); // Bỏ "Bearer "
    
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Tìm user trong database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Người dùng không tồn tại'
      });
    }

    // 5. Attach user info to request
    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    };
    
    // 6. Continue to next middleware/route
    next();
  } catch (error) {
    // Token invalid or expired
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};
```

**Giải thích:**
- Kiểm tra token có trong header không
- Verify token với secret key
- Lấy thông tin user từ database
- Gắn user info vào `req.user` để route handler sử dụng

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở Postman
> - Gửi request không có token → 401 Unauthorized
> - Gửi request với token hợp lệ → 200 OK

### 5.4. Authorization Middleware

```javascript
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next(); // Cho phép tiếp tục
  } else {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Bạn không có quyền truy cập tài nguyên này'
    });
  }
};
```

**Giải thích:**
- Kiểm tra role của user
- Chỉ ADMIN mới được phép truy cập
- USER sẽ nhận 403 Forbidden

### 5.5. Sử dụng trong Routes

```javascript
// Route chỉ cần authentication
router.get('/me', authMiddleware, async (req, res) => {
  // req.user đã có sẵn từ authMiddleware
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Route cần cả authentication và authorization
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  // Chỉ ADMIN mới vào được đây
  const users = await User.find();
  res.json(users);
});
```

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Middleware được áp dụng theo thứ tự: authMiddleware trước, adminMiddleware sau."
> - "Nếu authMiddleware fail → không chạy adminMiddleware."

---

## 6. DATABASE MODELS

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Mongoose là ODM (Object Document Mapper) cho MongoDB, giúp định nghĩa schema và validate dữ liệu."
> - "Mỗi model tương ứng với một collection trong MongoDB."

### 6.1. User Model (models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,  // Cho phép null nhưng nếu có thì phải unique
    trim: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  }
}, {
  timestamps: true  // Tự động thêm createdAt, updatedAt
});

// Pre-save hook: Hash password trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method: So sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');
```

**Giải thích:**
- `required: true`: Bắt buộc phải có
- `unique: true`: Giá trị duy nhất
- `enum`: Chỉ cho phép các giá trị trong mảng
- `default`: Giá trị mặc định
- `timestamps: true`: Tự động thêm createdAt, updatedAt
- `pre('save')`: Hook chạy trước khi save, dùng để hash password
- `methods.comparePassword`: Custom method để so sánh password

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Password được hash bằng bcrypt với 10 rounds trước khi lưu vào database."
> - "Đây là best practice để bảo mật, không bao giờ lưu password dạng plain text."

### 6.2. Order Model (models/Order.js)

```javascript
const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  menuItemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CafeTable',
    required: false  // Optional cho delivery/pickup
  },
  orderType: {
    type: String,
    enum: ['DINE_IN', 'DELIVERY', 'PICKUP'],
    default: 'DINE_IN'
  },
  items: [orderItemSchema],  // Nested schema
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Pre-save hook: Tính tổng tiền tự động
orderSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
```

**Giải thích:**
- `ref: 'MenuItem'`: Reference đến collection khác (populate)
- `[orderItemSchema]`: Array of nested documents
- `pre('save')`: Tự động tính totalAmount trước khi save

### 6.3. Tất cả Models

| Model | Collection | Mô tả |
|-------|-----------|-------|
| User | `users` | Người dùng (USER/ADMIN) |
| MenuItem | `menu_items` | Sản phẩm trong menu |
| CafeTable | `cafe_tables` | Bàn trong quán |
| Order | `orders` | Đơn hàng |
| Ingredient | `ingredients` | Nguyên liệu |
| StockTransaction | `stock_transactions` | Lịch sử nhập/xuất kho |
| PriceHistory | `price_histories` | Lịch sử thay đổi giá |
| Promotion | `promotions` | Khuyến mãi |
| PaymentConfig | `payment_configs` | Cấu hình thanh toán |

---

## 7. API ROUTES

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Mỗi route file xử lý một nhóm endpoints liên quan."
> - "Routes được tổ chức theo RESTful convention."

### 7.1. Auth Routes (routes/auth.js)

**Endpoints:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

**Code example:**

```javascript
// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, email, phone } = req.body;

    // 1. Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Username already exists'
      });
    }

    // 2. Kiểm tra email (nếu có)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Email already exists'
        });
      }
    }

    // 3. Tạo user mới
    const user = new User({
      username,
      password,  // Sẽ được hash tự động bởi pre-save hook
      fullName,
      email,
      phone,
      role: 'USER'  // Mặc định là USER
    });

    await user.save();

    // 4. Tạo JWT token
    const token = generateToken(user._id.toString());

    // 5. Trả về token và user info
    res.json({
      token,
      username: user.username,
      fullName: user.fullName,
      role: user.role
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

**Giải thích:**
- Validate input (username, email unique)
- Tạo user mới (password tự động hash)
- Tạo JWT token
- Trả về token để client lưu

### 7.2. Menu Routes (routes/menu.js)

**Endpoints:**
- `GET /api/menu` - Lấy danh sách (Admin)
- `GET /api/menu/available` - Lấy menu còn hàng (Public)
- `POST /api/menu` - Tạo món mới (Admin)
- `PUT /api/menu/:id` - Cập nhật (Admin)
- `DELETE /api/menu/:id` - Xóa (Admin)

**Code example:**

```javascript
// Get all menu items (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error getting menu:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Get available menu items (Public)
router.get('/available', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true })
      .sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Error getting available menu:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

### 7.3. Order Routes (routes/orders.js)

**Endpoints:**
- `GET /api/orders` - Lấy tất cả (Admin)
- `GET /api/orders/my-orders` - Lấy order của mình (User)
- `POST /api/orders` - Tạo order mới (User)
- `PATCH /api/orders/:id/status` - Cập nhật trạng thái (Admin)

**Code example:**

```javascript
// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tableId, items, orderType, deliveryAddress, deliveryPhone } = req.body;

    // 1. Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Order must have at least one item'
      });
    }

    // 2. Validate menu items exist and get prices
    const menuItemIds = items.map(item => item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });
    
    if (menuItems.length !== items.length) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Some menu items not found'
      });
    }

    // 3. Build order items with prices
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(m => m._id.toString() === item.menuItemId);
      return {
        menuItemId: menuItem._id,
        menuItemName: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price
      };
    });

    // 4. Create order
    const order = new Order({
      userId: req.user.id,
      tableId: tableId || null,
      orderType: orderType || 'DINE_IN',
      items: orderItems,
      deliveryAddress,
      deliveryPhone,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    });

    // totalAmount sẽ được tính tự động bởi pre-save hook
    await order.save();

    // 5. Update table status if dine-in
    if (tableId && orderType === 'DINE_IN') {
      await CafeTable.findByIdAndUpdate(tableId, { status: 'OCCUPIED' });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Khi tạo order, chúng ta validate menu items, lấy giá từ database để tránh giá bị thay đổi."
> - "Tổng tiền được tính tự động bởi pre-save hook trong model."

### 7.4. Tất cả Routes

| Route File | Base Path | Endpoints | Auth Required |
|-----------|-----------|-----------|---------------|
| auth.js | `/api/auth` | register, login | ❌ |
| menu.js | `/api/menu` | CRUD operations | ✅ (Admin) |
| tables.js | `/api/tables` | CRUD operations | ✅ (Admin) |
| orders.js | `/api/orders` | CRUD, status update | ✅ |
| reports.js | `/api/reports` | daily, monthly | ✅ (Admin) |
| inventory.js | `/api/inventory` | CRUD, import/export | ✅ (Admin) |
| prices.js | `/api/prices` | update, history | ✅ (Admin) |
| promotions.js | `/api/promotions` | CRUD, toggle | ✅ (Admin) |
| paymentConfig.js | `/api/payment-config` | CRUD, toggle | ✅ (Admin) |
| users.js | `/api/users` | CRUD, role update | ✅ (Admin) |

---

## 8. MIDDLEWARE

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Middleware là các functions chạy giữa request và response."
> - "Có thể dùng để xác thực, log, transform data, v.v."

### 8.1. Built-in Middleware

**CORS:**
```javascript
app.use(cors({ origin: allowedOrigins, credentials: true }));
```

**Body Parser:**
```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Static Files:**
```javascript
app.use('/uploads', express.static('uploads'));
```

### 8.2. Custom Middleware

**Authentication:**
- Kiểm tra JWT token
- Verify token và lấy user info
- Attach user vào `req.user`

**Authorization:**
- Kiểm tra role (ADMIN)
- Chặn nếu không đủ quyền

**Error Handling:**
- Bắt tất cả errors
- Trả về JSON response chuẩn

**404 Handler:**
- Xử lý routes không tồn tại

---

## 9. ERROR HANDLING

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Error handling quan trọng để ứng dụng không crash và trả về response có ý nghĩa cho client."

### 9.1. Error Types

**400 Bad Request:**
- Input validation failed
- Missing required fields
- Invalid data format

**401 Unauthorized:**
- No token provided
- Invalid/expired token
- User not found

**403 Forbidden:**
- User không có quyền (không phải ADMIN)

**404 Not Found:**
- Resource không tồn tại
- Route không tồn tại

**500 Internal Server Error:**
- Database error
- Unexpected error

### 9.2. Error Response Format

```javascript
{
  error: "Error Type",
  message: "Human-readable error message",
  status: 400
}
```

### 9.3. Try-Catch Pattern

```javascript
router.post('/example', async (req, res) => {
  try {
    // Business logic
    const result = await doSomething();
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});
```

---

## 10. DEPLOYMENT & CI/CD

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Backend được deploy lên Render.com, một cloud platform miễn phí."
> - "CI/CD pipeline tự động build và test khi push code lên GitHub."

### 10.1. Environment Variables

**Local (.env):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
PORT=8080
```

**Production (Render.com):**
- Cấu hình trong Render dashboard
- Tự động load khi deploy

### 10.2. GitHub Actions CI/CD

**File: `.github/workflows/ci-cd.yml`**

```yaml
name: Devopshop CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

**Giải thích:**
- Tự động chạy khi push code
- Install dependencies
- Run tests (nếu có)
- Build project

### 10.3. Render.com Deployment

**Configuration:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node
- **Port**: 8080

**Auto-deploy:**
- Tự động deploy khi push code lên GitHub
- Health check: `/api/health`

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở GitHub repository
> - Show Actions tab với workflow runs
> - Mở Render.com dashboard
> - Show deployment logs

---

## 11. DEMO & CODE WALKTHROUGH

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Bây giờ tôi sẽ demo một flow hoàn chỉnh từ request đến response."

### 11.1. Demo Flow: User Login

**Step 1: Client gửi request**
```http
POST https://devops-1-9r3z.onrender.com/api/auth/login
Content-Type: application/json

{
  "username": "root",
  "password": "root123"
}
```

**Step 2: Server xử lý (routes/auth.js)**
```javascript
// 1. Validate input
if (!username || !password) {
  return res.status(400).json({ error: 'Bad Request' });
}

// 2. Tìm user trong database
const user = await User.findOne({ username });

// 3. Verify password
const isPasswordValid = await user.comparePassword(password);

// 4. Tạo JWT token
const token = generateToken(user._id.toString());

// 5. Trả về response
res.json({ token, username, role });
```

**Step 3: Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "root",
  "fullName": "Root Administrator",
  "role": "ADMIN"
}
```

### 11.2. Demo Flow: Get Menu (với Authentication)

**Step 1: Client gửi request với token**
```http
GET https://devops-1-9r3z.onrender.com/api/menu
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Step 2: Middleware xử lý**
```javascript
// authMiddleware
1. Lấy token từ header
2. Verify token
3. Tìm user trong database
4. Attach user vào req.user

// adminMiddleware
5. Kiểm tra req.user.role === 'ADMIN'
6. Cho phép tiếp tục
```

**Step 3: Route handler**
```javascript
// routes/menu.js
const menuItems = await MenuItem.find().sort({ createdAt: -1 });
res.json(menuItems);
```

**Step 4: Response**
```json
[
  {
    "_id": "...",
    "name": "Cà phê đen",
    "price": 20000,
    "description": "...",
    "available": true
  },
  ...
]
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở Postman hoặc browser
> - Gửi request login → lấy token
> - Copy token
> - Gửi request get menu với token trong header
> - Show response

---

## 📝 CHECKLIST TRƯỚC KHI THUYẾT TRÌNH

### ✅ Chuẩn bị

- [ ] Đã test tất cả endpoints trên Postman
- [ ] Đã chuẩn bị demo flow login → get menu
- [ ] Đã mở sẵn code trong IDE
- [ ] Đã mở GitHub repository
- [ ] Đã mở Render.com dashboard
- [ ] Đã test API trên production: `https://devops-1-9r3z.onrender.com`

### ✅ Nội dung cần nhấn mạnh

1. **Kiến trúc rõ ràng**: MVC pattern, separation of concerns
2. **Bảo mật**: JWT authentication, password hashing, role-based access
3. **Database**: MongoDB với Mongoose, schema validation
4. **Error handling**: Comprehensive error handling
5. **Deployment**: CI/CD với GitHub Actions, deploy trên Render.com

### ✅ Câu hỏi có thể gặp

**Q: Tại sao dùng MongoDB thay vì SQL?**
A: MongoDB phù hợp với dữ liệu không có cấu trúc cố định, dễ scale, và schema linh hoạt.

**Q: JWT token có bảo mật không?**
A: Có, token được ký bằng secret key, có expiration time, và được verify mỗi request.

**Q: Làm sao xử lý khi token hết hạn?**
A: Client phải đăng nhập lại để lấy token mới.

**Q: Có thể scale backend không?**
A: Có, có thể deploy nhiều instances, dùng load balancer, và MongoDB Atlas hỗ trợ scaling.

---

## 🎯 KẾT LUẬN

### Điểm mạnh của Backend

1. ✅ **Kiến trúc rõ ràng**: Tách biệt models, routes, middleware
2. ✅ **Bảo mật tốt**: JWT, password hashing, role-based access
3. ✅ **Error handling**: Xử lý lỗi đầy đủ
4. ✅ **RESTful API**: Tuân thủ REST conventions
5. ✅ **Database design**: Schema hợp lý, có validation
6. ✅ **Deployment**: CI/CD tự động, deploy trên cloud

### Hướng phát triển

1. **Caching**: Redis để cache data
2. **Rate Limiting**: Giới hạn số request
3. **Logging**: Winston hoặc Morgan để log
4. **Testing**: Unit tests, integration tests
5. **API Documentation**: Swagger/OpenAPI
6. **Real-time**: WebSocket cho updates real-time

---

**Chúc bạn thuyết trình thành công! 🚀**

