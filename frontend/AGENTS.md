# AI Agent Guidelines & Architecture - Frontend (React + shadcn/ui)

Tài liệu này cung cấp toàn bộ ngữ cảnh, kiến trúc hệ thống và quy chuẩn mã nguồn của phần Frontend (React + Vite + Tailwind CSS + shadcn/ui) dựa trên bản thiết kế giao diện **To-Do System**. Tất cả các AI Agent cần tuân thủ cấu trúc này để tạo ra UI đồng bộ.

---

## 1. Stack Công Nghệ & Nguyên Tắc UI
- **Framework:** React.js (Khởi tạo bằng Vite)
- **Styling:** Tailwind CSS (Màu chủ đạo: Red-Orange `#FF523B` kết hợp Slate/Neutral cho Dark/Light mode).
- **Component Library:** `shadcn/ui` (Sử dụng cơ chế CLI sinh code cục bộ thông qua Radix UI primitives).
- **State Management:** React Context API hoặc Zustand (Quản lý trạng thái Auth và danh sách Tasks đồng bộ từ API).
- **Data Fetching:** Axios / TanStack Query (React Query) kết nối trực tiếp với Backend Express.

---

## 2. Kiến Trúc Thư Mục Frontend
Mã nguồn Frontend áp dụng quy chuẩn phân vùng nguyên tử (Atomic-inspired design):

```text
frontend/
├── src/
│   ├── assets/             # Hình ảnh tĩnh, SVG, Icons (Sử dụng Lucide React)
│   ├── components/         
│   │   ├── shared/         # Layout components lớn (Sidebar, TopNav)
│   │   └── ui/             # shadcn/ui components nguyên bản (Button, Input, Card, Dialog)
│   ├── context/            # AuthContext, TaskContext quản lý State cục bộ
│   ├── hooks/              # Custom hooks (useAuth, useTasks)
│   ├── layouts/            # DashboardLayout (Có Sidebar), AuthLayout (Full screen)
│   ├── pages/              # Các trang chức năng khớp hoàn toàn với thiết kế UI
│   ├── services/           # API Client kết nối trực tiếp với Express Backend
│   ├── App.jsx             # Cấu hình React Router DOM
│   └── main.jsx         # Điểm khởi chạy ứng dụng React (Render vào DOM)