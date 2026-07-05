# 📋 Todo List Management System

Một ứng dụng **Quản lý Công việc (Todo List)** được xây dựng theo mô hình **Full-Stack** nhằm phục vụ bài test **Intern Developer**.

Dự án bao gồm:

- 🎨 **Frontend:** React + Vite + TypeScript
- ⚙️ **Backend:** Node.js + Express
- 🗄️ **Database:** MongoDB

Ứng dụng cho phép người dùng quản lý công việc, theo dõi tiến độ, tìm kiếm, lọc, phân trang và nhiều tính năng hỗ trợ trải nghiệm người dùng hiện đại.

---

# ✨ Demo Account

Để tiện cho việc đánh giá, hệ thống đã có sẵn tài khoản demo.

| Email / Username | Password |
|------------------|----------|
| **admin** | **123456** |

> Hoặc bạn có thể tự đăng ký tài khoản mới.

---

# 🚀 Features

## 📌 Core Features

### ✅ Authentication

- Đăng ký tài khoản
- Đăng nhập bằng JWT Authentication
- Mã hóa mật khẩu bằng BCrypt
- Tự động lưu phiên đăng nhập

---

### 📝 Task Management

- Xem danh sách công việc
- Thêm công việc mới
- Chỉnh sửa công việc
- Xóa công việc
- Đánh dấu hoàn thành / chưa hoàn thành chỉ với một lần click

---

### 📊 Dashboard

- Hiển thị:
  - To-Do Tasks
  - Completed Tasks
- Biểu đồ tròn thống kê trạng thái công việc
- Nút **Load More** để tải thêm dữ liệu

---

### 📂 My Tasks

- Danh sách công việc chi tiết
- Phân trang (Pagination)
- Tìm kiếm theo tiêu đề
- Lọc theo:
  - Status
  - Priority

---

### 🔍 Search

Thanh tìm kiếm toàn cục hoạt động trên:

- Dashboard
- My Tasks

Kết quả hiển thị theo thời gian thực.

---

# ⭐ Bonus Features

Ngoài các yêu cầu bắt buộc, dự án còn triển khai thêm nhiều tính năng nâng cao.

### 🎨 UI / UX

- Responsive trên Mobile / Tablet / Desktop
- Dark Mode / Light Mode
- Giao diện hiện đại
- Modal trực quan
- Confirm Dialog trước khi xóa

---

### 🔒 Validation & Security

- Không cho chọn ngày trong quá khứ
- Validate dữ liệu ở cả Frontend và Backend
- Password Strength Meter khi đăng ký
- Xử lý lỗi 401 không reload trang

---

### 📷 Upload Image

- Đính kèm hình ảnh cho Task
- Upload bằng Multer

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- BCryptJS
- Multer

---

# 📦 Installation

## Requirements

- Node.js >= 18
- MongoDB (Local hoặc MongoDB Atlas)

---

# 🚀 Run Backend

```bash
cd backend
npm install
```

Tạo file `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo-list-db
JWT_SECRET=your_secret_key
```

Khởi động server

```bash
npm run dev
```

---

# 🚀 Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt:

```
http://localhost:5173
```

---


# 📁 Project Structure

```
.
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validations
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   └── utils
│   └── vite.config.ts
│
└── README.md
```

---

# 📸 Main Functions

- 🔐 Authentication
- 📋 Task CRUD
- 📊 Dashboard Statistics
- 🔍 Search Tasks
- 🎯 Filter by Status & Priority
- 📄 Pagination
- 📷 Upload Image
- 🌙 Dark / Light Mode
- 📱 Responsive Design

---

# 💡 Highlights

- Clean Architecture
- RESTful API
- JWT Authentication
- Responsive UI
- MongoDB + Mongoose
- TypeScript Frontend
- Secure Password Hashing
- Image Upload
- Modern UI/UX

---

# 👨‍💻 Author

Developed as an **Intern Developer Technical Assessment**.