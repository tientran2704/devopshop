# FRONTEND - HỆ THỐNG QUẢN LÝ QUÁN CAFE
## Hướng dẫn thuyết trình chi tiết về Frontend

---

## 📋 MỤC LỤC THUYẾT TRÌNH

1. [Giới thiệu Frontend](#1-giới-thiệu-frontend)
2. [Kiến trúc & Công nghệ](#2-kiến-trúc--công-nghệ)
3. [Cấu trúc Project](#3-cấu-trúc-project)
4. [Entry Point - App.jsx](#4-entry-point---appjsx)
5. [Routing System](#5-routing-system)
6. [State Management](#6-state-management)
7. [API Integration](#7-api-integration)
8. [Components](#8-components)
9. [Pages](#9-pages)
10. [Authentication Flow](#10-authentication-flow)
11. [UI/UX Design](#11-uiux-design)
12. [Deployment](#12-deployment)
13. [Demo & Code Walkthrough](#13-demo--code-walkthrough)

---

## 1. GIỚI THIỆU FRONTEND

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Frontend của hệ thống được xây dựng bằng React 18, một thư viện JavaScript phổ biến để xây dựng giao diện người dùng."
> - "Frontend đóng vai trò là client-side application, tương tác với người dùng và gọi API backend để lấy/xử lý dữ liệu."

### 1.1. Vai trò của Frontend
- **User Interface**: Giao diện người dùng thân thiện, dễ sử dụng
- **User Experience**: Trải nghiệm mượt mà, responsive trên mọi thiết bị
- **Client-Side Logic**: Xử lý logic phía client (form validation, routing, state management)
- **API Communication**: Giao tiếp với backend qua RESTful API
- **Authentication**: Quản lý đăng nhập, lưu token, bảo vệ routes

### 1.2. Công nghệ chính
- **Framework**: React 18 (JavaScript library)
- **Routing**: React Router DOM v6 (Client-side routing)
- **HTTP Client**: Axios (API requests)
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Styling**: Custom CSS với responsive design
- **Build Tool**: Create React App (Webpack, Babel)
- **QR Code**: qrcode.react library

---

## 2. KIẾN TRÚC & CÔNG NGHỆ

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Frontend sử dụng kiến trúc Component-based, mỗi component là một phần độc lập có thể tái sử dụng."
> - "Luồng dữ liệu: User Action → Component State → API Call → Backend → Response → Update UI"

### 2.1. Kiến trúc tổng quan

```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│  ┌───────────────────────────────┐   │
│  │      React Application        │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │   App.jsx (Router)      │  │   │
│  │  │   - Routes               │  │   │
│  │  │   - Navigation          │  │   │
│  │  └───────────┬─────────────┘  │   │
│  │              │                │   │
│  │  ┌───────────▼─────────────┐  │   │
│  │  │   Pages/Components       │  │   │
│  │  │   - Home                 │  │   │
│  │  │   - MenuManagement       │  │   │
│  │  │   - OrderManagement      │  │   │
│  │  │   - ... (16 pages)       │  │   │
│  │  └───────────┬─────────────┘  │   │
│  │              │                │   │
│  │  ┌───────────▼─────────────┐  │   │
│  │  │   API Services           │  │   │
│  │  │   - axios.js             │  │   │
│  │  │   - services.js          │  │   │
│  │  └───────────┬─────────────┘  │   │
│  └──────────────┼────────────────┘   │
└─────────────────┼────────────────────┘
                  │ HTTP Request
                  │ (REST API)
                  │
┌─────────────────▼────────────────────┐
│      Backend API Server               │
│      (Express.js + MongoDB)          │
└───────────────────────────────────────┘
```

### 2.2. Component Lifecycle & Data Flow

```
1. Component Mount
   ↓
2. useEffect Hook chạy
   ↓
3. Gọi API Service
   ↓
4. Axios gửi HTTP Request
   - Thêm JWT token vào header
   ↓
5. Backend xử lý và trả response
   ↓
6. Axios nhận response
   ↓
7. Update Component State (useState)
   ↓
8. Component Re-render với data mới
   ↓
9. User thấy UI được cập nhật
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở browser DevTools → Network tab
> - Thực hiện một action (ví dụ: load menu)
> - Show request/response trong Network tab
> - Giải thích flow

---

## 3. CẤU TRÚC PROJECT

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Cấu trúc project được tổ chức theo mô hình feature-based, mỗi feature có components và pages riêng."
> - "Tách biệt rõ ràng giữa UI components, business logic (API), và routing."

### 3.1. Cấu trúc thư mục

```
frontend/
├── public/
│   └── index.html              # HTML template
│
├── src/
│   ├── api/                    # API Integration Layer
│   │   ├── axios.js            # Axios configuration & interceptors
│   │   └── services.js        # API service functions
│   │
│   ├── components/             # Reusable Components
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   └── PrivateRoute.jsx    # Route protection component
│   │
│   ├── pages/                   # Page Components
│   │   ├── Home.jsx             # Dashboard/Home page
│   │   ├── MenuManagement.jsx   # Admin: Quản lý menu
│   │   ├── TableManagement.jsx  # Admin: Quản lý bàn
│   │   ├── OrderManagement.jsx  # Admin: Quản lý order
│   │   ├── PriceManagement.jsx  # Admin: Quản lý giá
│   │   ├── PromotionManagement.jsx  # Admin: Khuyến mãi
│   │   ├── InventoryManagement.jsx  # Admin: Quản lý kho
│   │   ├── PaymentManagement.jsx    # Admin: Cấu hình thanh toán
│   │   ├── UserManagement.jsx        # Admin: Quản lý user
│   │   ├── Reports.jsx              # Admin: Báo cáo
│   │   ├── Profile.jsx              # Thông tin cá nhân
│   │   ├── ViewMenu.jsx             # User: Xem menu
│   │   ├── BookTable.jsx           # User: Đặt bàn
│   │   ├── OrderOnline.jsx          # User: Đặt món online
│   │   ├── MyOrders.jsx             # User: Đơn hàng của tôi
│   │   └── Payment.jsx              # User: Thanh toán
│   │
│   ├── utils/                  # Utility Functions
│   │   └── authDebug.js        # Debug utilities
│   │
│   ├── App.jsx                 # Main App Component (Router)
│   ├── index.js                 # Entry point
│   └── index.css               # Global styles
│
├── package.json                 # Dependencies & scripts
└── build/                       # Production build (after npm run build)
```

### 3.2. Giải thích từng thư mục

**📁 public/**: Static files
- `index.html`: HTML template, React sẽ render vào `<div id="root">`

**📁 src/api/**: API Integration
- `axios.js`: Cấu hình Axios, interceptors, error handling
- `services.js`: Các hàm gọi API (authService, menuService, ...)

**📁 src/components/**: Reusable Components
- Components có thể dùng lại ở nhiều pages
- Header, Login, Register, PrivateRoute

**📁 src/pages/**: Page Components
- Mỗi file là một page/route riêng
- 16 pages: 9 admin pages + 7 user pages

**📁 src/utils/**: Utilities
- Helper functions, debug tools

---

## 4. ENTRY POINT - App.jsx

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "App.jsx là component chính, nơi định nghĩa routing và cấu trúc ứng dụng."
> - "Đây là nơi React Router được cấu hình để điều hướng giữa các pages."

### 4.1. Code walkthrough

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
// ... import các pages
```

**Giải thích:**
- `BrowserRouter`: Router component, quản lý URL và navigation
- `Routes`: Container cho các routes
- `Route`: Định nghĩa một route
- `Navigate`: Redirect component

### 4.2. Authentication Check

```javascript
function App() {
  const isAuthenticated = authService.getCurrentUser() !== null;
  
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* Routes */}
        </Routes>
      </div>
    </Router>
  );
}
```

**Giải thích:**
- Kiểm tra user đã đăng nhập chưa
- Nếu chưa đăng nhập → redirect về `/login`

### 4.3. Public Routes

```javascript
<Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
<Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
```

**Giải thích:**
- Nếu đã đăng nhập → redirect về home
- Nếu chưa đăng nhập → hiển thị Login/Register

### 4.4. Protected Routes (User)

```javascript
<Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
<Route path="/menu" element={<PrivateRoute><ViewMenu /></PrivateRoute>} />
<Route path="/book-table" element={<PrivateRoute><BookTable /></PrivateRoute>} />
<Route path="/order-online" element={<PrivateRoute><OrderOnline /></PrivateRoute>} />
<Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
```

**Giải thích:**
- `PrivateRoute`: Component bảo vệ route
- Chỉ user đã đăng nhập mới truy cập được
- Nếu chưa đăng nhập → redirect về `/login`

### 4.5. Admin Routes

```javascript
<Route 
  path="/admin/menu" 
  element={<PrivateRoute adminOnly={true}><MenuManagement /></PrivateRoute>} 
/>
<Route 
  path="/admin/tables" 
  element={<PrivateRoute adminOnly={true}><TableManagement /></PrivateRoute>} 
/>
// ... các admin routes khác
```

**Giải thích:**
- `adminOnly={true}`: Chỉ ADMIN mới truy cập được
- USER sẽ bị redirect về home

### 4.6. 404 Handler

```javascript
<Route path="*" element={<Navigate to="/" />} />
```

**Giải thích:**
- Route không tồn tại → redirect về home

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở browser
> - Thử truy cập `/admin/menu` khi chưa đăng nhập → redirect `/login`
> - Đăng nhập với USER → truy cập `/admin/menu` → redirect về `/`
> - Đăng nhập với ADMIN → truy cập `/admin/menu` → OK

---

## 5. ROUTING SYSTEM

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "React Router là thư viện routing phổ biến nhất cho React, cho phép điều hướng không cần reload page (SPA)."
> - "Tất cả routing được xử lý ở client-side, tạo trải nghiệm mượt mà."

### 5.1. React Router v6 Features

**BrowserRouter:**
- Sử dụng HTML5 History API
- URL đẹp: `/admin/menu` thay vì `/#/admin/menu`

**Routes & Route:**
- Declarative routing
- Nested routes support

**Navigate:**
- Programmatic navigation
- Redirect

**useNavigate Hook:**
- Navigate programmatically trong component

**useLocation Hook:**
- Lấy thông tin về current location

### 5.2. PrivateRoute Component

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/services';

function PrivateRoute({ children, adminOnly = false }) {
  const user = authService.getCurrentUser();
  
  // 1. Kiểm tra đã đăng nhập chưa
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // 2. Kiểm tra quyền ADMIN (nếu cần)
  if (adminOnly && !authService.isAdmin()) {
    return <Navigate to="/" />;
  }
  
  // 3. Cho phép truy cập
  return children;
}

export default PrivateRoute;
```

**Giải thích:**
- `children`: Component con được render nếu có quyền
- `adminOnly`: Flag để kiểm tra quyền ADMIN
- Nếu không đủ điều kiện → redirect

### 5.3. Route Structure

**Public Routes:**
- `/login` - Đăng nhập
- `/register` - Đăng ký

**User Routes (cần đăng nhập):**
- `/` - Trang chủ
- `/menu` - Xem menu
- `/book-table` - Đặt bàn
- `/order-online` - Đặt món online
- `/my-orders` - Đơn hàng của tôi
- `/profile` - Thông tin cá nhân
- `/payment/:orderId` - Thanh toán

**Admin Routes (cần ADMIN):**
- `/admin/menu` - Quản lý menu
- `/admin/tables` - Quản lý bàn
- `/admin/orders` - Quản lý order
- `/admin/prices` - Quản lý giá
- `/admin/promotions` - Khuyến mãi
- `/admin/inventory` - Quản lý kho
- `/admin/payment` - Cấu hình thanh toán
- `/admin/users` - Quản lý user
- `/admin/reports` - Báo cáo

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Tổng cộng có 18 routes: 2 public, 7 user, 9 admin."
> - "Mỗi route được bảo vệ bởi PrivateRoute để đảm bảo bảo mật."

---

## 6. STATE MANAGEMENT

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "React sử dụng Hooks để quản lý state, không cần Redux cho dự án này vì state đơn giản."
> - "useState cho local state, useEffect cho side effects (API calls)."

### 6.1. useState Hook

**Cú pháp:**
```javascript
const [state, setState] = useState(initialValue);
```

**Ví dụ:**
```javascript
function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);  // Array
  const [loading, setLoading] = useState(false);  // Boolean
  const [error, setError] = useState(null);       // String/Object
  const [formData, setFormData] = useState({      // Object
    name: '',
    price: 0,
    description: ''
  });

  // Update state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
}
```

**Giải thích:**
- `useState`: Hook để tạo state
- `setState`: Function để update state
- State update → Component re-render

### 6.2. useEffect Hook

**Cú pháp:**
```javascript
useEffect(() => {
  // Side effect code
}, [dependencies]);
```

**Ví dụ:**
```javascript
function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);

  // Chạy khi component mount (lần đầu render)
  useEffect(() => {
    loadMenuItems();
  }, []); // Empty array = chỉ chạy 1 lần

  // Chạy khi menuItems thay đổi
  useEffect(() => {
    console.log('Menu items updated:', menuItems);
  }, [menuItems]); // Dependencies

  const loadMenuItems = async () => {
    try {
      const response = await menuService.getAll();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };
}
```

**Giải thích:**
- `useEffect`: Hook để xử lý side effects
- Empty array `[]`: Chạy 1 lần khi mount
- Có dependencies: Chạy lại khi dependencies thay đổi

### 6.3. State Flow Example

```
1. Component Mount
   ↓
2. useState khởi tạo state (menuItems = [])
   ↓
3. useEffect chạy (dependencies = [])
   ↓
4. Gọi API loadMenuItems()
   ↓
5. API trả về data
   ↓
6. setMenuItems(data) → Update state
   ↓
7. Component re-render với data mới
   ↓
8. UI hiển thị menu items
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở React DevTools → Components tab
> - Show state của một component
> - Thực hiện action → show state update

---

## 7. API INTEGRATION

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Axios là HTTP client phổ biến, dễ sử dụng hơn fetch API."
> - "Chúng ta cấu hình Axios với interceptors để tự động thêm token và xử lý lỗi."

### 7.1. Axios Configuration (api/axios.js)

**Base URL:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Giải thích:**
- `REACT_APP_API_URL`: Environment variable cho production
- Local dev: `http://localhost:8080`
- Production: `https://devops-1-9r3z.onrender.com`

### 7.2. Request Interceptor

```javascript
api.interceptors.request.use(
  (config) => {
    // 1. Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // 2. Thêm token vào header nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Log request (development)
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Giải thích:**
- Tự động thêm JWT token vào mọi request
- Token được lưu trong localStorage sau khi login

### 7.3. Response Interceptor

```javascript
api.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  (error) => {
    // Error handling
    if (error.response) {
      const status = error.response.status;
      
      // 401 Unauthorized → Redirect to login
      if (status === 401 && !isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // 403 Forbidden → Show error message
      if (status === 403) {
        console.warn('Permission denied');
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Giải thích:**
- Tự động xử lý lỗi 401 (logout và redirect)
- Tự động xử lý lỗi 403 (permission denied)

### 7.4. API Services (api/services.js)

**Cấu trúc:**
```javascript
import api from './axios';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
};

export const menuService = {
  getAll: () => api.get('/api/menu'),
  getAvailable: () => api.get('/api/menu/available'),
  create: (data) => api.post('/api/menu', data),
  update: (id, data) => api.put(`/api/menu/${id}`, data),
  delete: (id) => api.delete(`/api/menu/${id}`),
};

// ... các services khác
```

**Giải thích:**
- Mỗi service là một object với các methods
- Mỗi method gọi API endpoint tương ứng
- Trả về Promise (async/await)

### 7.5. Sử dụng trong Component

```javascript
import { menuService } from '../api/services';

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const response = await menuService.getAll();
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Không thể tải menu');
    }
  };

  const handleDelete = async (id) => {
    try {
      await menuService.delete(id);
      loadMenu(); // Reload sau khi xóa
    } catch (error) {
      alert('Không thể xóa món');
    }
  };
}
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở browser DevTools → Network tab
> - Thực hiện action (load menu, delete item)
> - Show request với Authorization header
> - Show response data

---

## 8. COMPONENTS

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Components là building blocks của React app, mỗi component là một phần UI độc lập."
> - "Có 4 reusable components: Header, Login, Register, PrivateRoute."

### 8.1. Header Component

**Chức năng:**
- Hiển thị navigation menu
- Hiển thị thông tin user (role, name)
- Nút logout
- Menu khác nhau cho USER và ADMIN

**Code structure:**
```javascript
function Header() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  // Menu items khác nhau cho USER và ADMIN
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header>
      <div className="header-brand">
        <h1>Quản Lý Quán Cafe</h1>
      </div>
      <nav>
        {navItems.map(item => (
          <Link to={item.to}>{item.label}</Link>
        ))}
      </nav>
      <div>
        <span>{user.fullName}</span>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </header>
  );
}
```

**Giải thích:**
- `useNavigate`: Hook để navigate programmatically
- `authService.isAdmin()`: Kiểm tra role
- Conditional rendering: Menu khác nhau theo role

### 8.2. Login Component

**Chức năng:**
- Form đăng nhập (username, password)
- Validate input
- Gọi API login
- Lưu token vào localStorage
- Redirect sau khi login thành công

**Code structure:**
```javascript
function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(
        formData.username,
        formData.password
      );
      // Login thành công → redirect
      navigate('/');
    } catch (error) {
      setError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {error && <p>{error}</p>}
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

### 8.3. Register Component

**Tương tự Login nhưng:**
- Thêm fields: fullName, email, phone
- Gọi API register thay vì login
- Validation phức tạp hơn

### 8.4. PrivateRoute Component

**Đã giải thích ở phần Routing System**

---

## 9. PAGES

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Có 16 pages: 9 cho ADMIN, 7 cho USER."
> - "Mỗi page là một component riêng, xử lý một chức năng cụ thể."

### 9.1. User Pages

**Home.jsx:**
- Dashboard với shortcuts
- Hiển thị khác nhau cho USER và ADMIN

**ViewMenu.jsx:**
- Hiển thị menu công khai (available items)
- User có thể xem nhưng không chỉnh sửa

**BookTable.jsx:**
- Xem danh sách bàn trống
- Đặt bàn và tạo order

**OrderOnline.jsx:**
- Đặt món online (không cần bàn)
- Chọn món, số lượng, địa chỉ giao hàng

**MyOrders.jsx:**
- Xem danh sách order của mình
- Filter theo trạng thái

**Payment.jsx:**
- Thanh toán cho order
- Chọn phương thức thanh toán
- Hiển thị QR code

**Profile.jsx:**
- Xem thông tin cá nhân
- Hiển thị role, email, phone

### 9.2. Admin Pages

**MenuManagement.jsx:**
- CRUD menu items
- Upload hình ảnh
- Bật/tắt available

**TableManagement.jsx:**
- CRUD tables
- Cập nhật trạng thái bàn

**OrderManagement.jsx:**
- Xem tất cả orders
- Cập nhật trạng thái order
- Chuyển bàn

**PriceManagement.jsx:**
- Cập nhật giá sản phẩm
- Xem lịch sử thay đổi giá

**PromotionManagement.jsx:**
- CRUD promotions
- Thiết lập % giảm giá, thời gian

**InventoryManagement.jsx:**
- Quản lý nguyên liệu
- Nhập/xuất kho
- Cảnh báo tồn kho thấp

**PaymentManagement.jsx:**
- Cấu hình thanh toán
- Upload QR code
- Cấu hình VNPay, MoMo, ZaloPay

**UserManagement.jsx:**
- Xem danh sách users
- Thay đổi role
- Xóa user

**Reports.jsx:**
- Báo cáo doanh thu
- Báo cáo theo ngày/tháng
- Thống kê số khách

### 9.3. Page Structure Example

```javascript
function MenuManagement() {
  // 1. State
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  // 2. Load data on mount
  useEffect(() => {
    loadMenu();
  }, []);

  // 3. API functions
  const loadMenu = async () => {
    const response = await menuService.getAll();
    setMenuItems(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await menuService.create(formData);
      loadMenu(); // Reload
      resetForm();
    } catch (error) {
      alert('Lỗi khi tạo món');
    } finally {
      setLoading(false);
    }
  };

  // 4. Render UI
  return (
    <div>
      <h1>Quản lý Menu</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
      <div>
        {menuItems.map(item => (
          <div key={item._id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

**Pattern chung:**
1. State management (useState)
2. Load data (useEffect)
3. API calls (async functions)
4. Event handlers
5. Render UI

---

## 10. AUTHENTICATION FLOW

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Authentication flow xử lý đăng nhập, lưu token, và bảo vệ routes."
> - "Token được lưu trong localStorage và tự động thêm vào mọi API request."

### 10.1. Login Flow

```
1. User nhập username/password
   ↓
2. Submit form → handleSubmit()
   ↓
3. Gọi authService.login(username, password)
   ↓
4. Axios gửi POST /api/auth/login
   ↓
5. Backend verify và trả về token
   ↓
6. Frontend lưu token vào localStorage
   ↓
7. Lưu user info vào localStorage
   ↓
8. Redirect về home page
   ↓
9. Header hiển thị user info
```

### 10.2. Token Storage

```javascript
// Lưu token
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));

// Lấy token
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Xóa token (logout)
localStorage.removeItem('token');
localStorage.removeItem('user');
```

**Giải thích:**
- `localStorage`: Browser storage, persist sau khi đóng browser
- Token được lưu để dùng cho các request sau

### 10.3. Protected Route Flow

```
1. User truy cập /admin/menu
   ↓
2. PrivateRoute kiểm tra user
   ↓
3. Nếu chưa đăng nhập → redirect /login
   ↓
4. Nếu đã đăng nhập nhưng không phải ADMIN → redirect /
   ↓
5. Nếu là ADMIN → render MenuManagement component
   ↓
6. Component mount → useEffect chạy
   ↓
7. Gọi API với token trong header
   ↓
8. Backend verify token → trả data
   ↓
9. Component render với data
```

### 10.4. Auto Logout on 401

```javascript
// Trong axios interceptor
if (status === 401 && !isAuthEndpoint) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

**Giải thích:**
- Khi token hết hạn hoặc invalid
- Backend trả 401
- Frontend tự động logout và redirect

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Đăng nhập → show token trong localStorage (DevTools)
> - Truy cập protected route → OK
> - Xóa token thủ công → refresh page → redirect /login

---

## 11. UI/UX DESIGN

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "UI được thiết kế với CSS custom, responsive trên mọi thiết bị."
> - "UX tập trung vào trải nghiệm người dùng, dễ sử dụng, thân thiện."

### 11.1. Design Principles

**Consistency:**
- Màu sắc nhất quán (brown/cafe theme)
- Typography đồng bộ
- Spacing và layout chuẩn

**Responsive:**
- Mobile-first approach
- Breakpoints cho tablet, desktop
- Flexible grid layout

**User Feedback:**
- Loading states
- Error messages
- Success notifications
- Form validation

### 11.2. Color Scheme

**Primary Colors:**
- Brown (#8B4513): Buttons, highlights
- White: Background, cards
- Gray: Text, borders

**Status Colors:**
- Green: Success, available
- Red: Error, danger
- Orange: Warning
- Blue: Info

### 11.3. Component Styling

**CSS Classes:**
- `.container`: Main container
- `.card`: Card component
- `.btn`: Button styles
- `.form`: Form styles
- `.header`: Header styles

**Inline Styles:**
- Một số components dùng inline styles
- Dễ customize theo props

### 11.4. Responsive Design

```css
/* Mobile */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở browser → resize window
> - Show responsive layout
> - Test trên mobile (DevTools device mode)

---

## 12. DEPLOYMENT

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Frontend được build thành static files và deploy lên Render.com."
> - "Build process tối ưu code, minify, và bundle để tăng performance."

### 12.1. Build Process

**Build Command:**
```bash
npm run build
```

**Output:**
- `build/` folder chứa static files
- HTML, CSS, JS đã được minify và optimize
- Assets được hash để cache busting

### 12.2. Environment Variables

**Development:**
```env
REACT_APP_API_URL=http://localhost:8080
```

**Production (Render.com):**
```env
REACT_APP_API_URL=https://devops-1-9r3z.onrender.com
```

**Giải thích:**
- `REACT_APP_*`: Prefix bắt buộc cho React env vars
- Build time: Env vars được inject vào code khi build

### 12.3. Render.com Configuration

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment**: Static Site

**Auto-deploy:**
- Tự động deploy khi push code lên GitHub
- Health check: Root URL

### 12.4. Production URL

**Frontend:**
- `https://cafe-frontend-25ua.onrender.com`

**Backend:**
- `https://devops-1-9r3z.onrender.com`

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở production URL
> - Show app đang chạy
> - Test một vài chức năng

---

## 13. DEMO & CODE WALKTHROUGH

### 🎯 **Ghi chú thuyết trình:**
> **Nói gì:**
> - "Bây giờ tôi sẽ demo một flow hoàn chỉnh từ login đến thực hiện một action."

### 13.1. Demo Flow: User Login → View Menu → Create Order

**Step 1: Login**
```
1. User vào /login
2. Nhập username: "root", password: "root123"
3. Click "Đăng nhập"
4. Frontend gọi authService.login()
5. Axios POST /api/auth/login
6. Backend trả token
7. Frontend lưu token vào localStorage
8. Redirect về /
```

**Step 2: View Menu**
```
1. User click "Xem Menu"
2. Navigate to /menu
3. ViewMenu component mount
4. useEffect chạy → gọi menuService.getAvailable()
5. Axios GET /api/menu/available (với token trong header)
6. Backend trả danh sách menu
7. Component render menu items
```

**Step 3: Create Order**
```
1. User chọn món và số lượng
2. Click "Đặt món"
3. handleSubmit() gọi orderService.create()
4. Axios POST /api/orders (với token)
5. Backend tạo order
6. Frontend redirect về /my-orders
7. MyOrders component load và hiển thị order mới
```

### 13.2. Code Walkthrough: Login Component

```javascript
function Login() {
  // 1. State
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    try {
      // 3. Call API
      const response = await authService.login(
        formData.username,
        formData.password
      );
      
      // 4. Success → redirect
      navigate('/');
    } catch (error) {
      // 5. Error → show message
      setError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  // 6. Render form
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.username}
        onChange={(e) => 
          setFormData({ ...formData, username: e.target.value })
        }
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => 
          setFormData({ ...formData, password: e.target.value })
        }
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

### 13.3. Code Walkthrough: MenuManagement Component

```javascript
function MenuManagement() {
  // State
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  // Load data on mount
  useEffect(() => {
    loadMenu();
  }, []);

  // Load menu from API
  const loadMenu = async () => {
    try {
      const response = await menuService.getAll();
      setMenuItems(response.data);
    } catch (error) {
      alert('Không thể tải menu');
    }
  };

  // Create new menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await menuService.create(formData);
      loadMenu(); // Reload list
      setShowModal(false); // Close modal
      resetForm();
    } catch (error) {
      alert('Lỗi khi tạo món');
    }
  };

  // Delete menu item
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa?')) return;
    
    try {
      await menuService.delete(id);
      loadMenu(); // Reload list
    } catch (error) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div>
      <h1>Quản lý Menu</h1>
      <button onClick={() => setShowModal(true)}>+ Thêm món</button>
      
      {showModal && (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
        </form>
      )}
      
      <div>
        {menuItems.map(item => (
          <div key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.price} VNĐ</p>
            <button onClick={() => handleDelete(item._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 🎯 **Ghi chú thuyết trình:**
> **Demo:**
> - Mở code trong IDE
> - Walk through một component
> - Show state changes trong React DevTools
> - Show API calls trong Network tab

---

## 📝 CHECKLIST TRƯỚC KHI THUYẾT TRÌNH

### ✅ Chuẩn bị

- [ ] Đã test tất cả pages trên local
- [ ] Đã test trên production URL
- [ ] Đã chuẩn bị demo flow: Login → View Menu → Create Order
- [ ] Đã mở sẵn code trong IDE
- [ ] Đã mở browser DevTools
- [ ] Đã mở React DevTools extension
- [ ] Đã test responsive trên mobile

### ✅ Nội dung cần nhấn mạnh

1. **Component-based Architecture**: Tái sử dụng, dễ maintain
2. **React Hooks**: useState, useEffect cho state management
3. **Routing**: React Router với protected routes
4. **API Integration**: Axios với interceptors
5. **Authentication**: Token-based với localStorage
6. **Responsive Design**: Mobile-first approach

### ✅ Câu hỏi có thể gặp

**Q: Tại sao dùng React thay vì Vue/Angular?**
A: React phổ biến, cộng đồng lớn, nhiều tài liệu, dễ học.

**Q: Có dùng Redux không?**
A: Không, vì state đơn giản, chỉ cần useState và useEffect.

**Q: Làm sao xử lý khi token hết hạn?**
A: Axios interceptor tự động logout và redirect khi nhận 401.

**Q: Có SEO-friendly không?**
A: Không, vì là SPA. Có thể dùng Next.js nếu cần SEO.

**Q: Performance như thế nào?**
A: Code được minify và bundle, lazy loading có thể thêm sau.

---

## 🎯 KẾT LUẬN

### Điểm mạnh của Frontend

1. ✅ **Component-based**: Dễ maintain và mở rộng
2. ✅ **React Hooks**: Modern React, code sạch
3. ✅ **Routing**: Protected routes, role-based access
4. ✅ **API Integration**: Axios với interceptors, error handling
5. ✅ **Authentication**: Token-based, auto logout
6. ✅ **Responsive**: Mobile-friendly
7. ✅ **User Experience**: Loading states, error messages

### Hướng phát triển

1. **State Management**: Redux hoặc Context API nếu state phức tạp
2. **UI Library**: Material-UI hoặc Ant Design
3. **Testing**: Jest + React Testing Library
4. **Performance**: Code splitting, lazy loading
5. **PWA**: Progressive Web App
6. **TypeScript**: Type safety
7. **Storybook**: Component documentation

---

**Chúc bạn thuyết trình thành công! 🚀**

