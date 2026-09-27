# MyNote

Ứng dụng React 19 + Vite, gồm trang giới thiệu, ghi chú, việc cần làm và kế hoạch tuần.

## Chạy dự án

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Cấu trúc

```text
src/
  app/                    # Providers và cấu hình routes
  components/
    home/                 # Các section và preview của trang chủ
    layout/               # Layout chung cho các trang làm việc
    auth/                 # Modal xác thực
  context/
    *Context.js           # Context và hook truy cập context
    *Provider.jsx         # State và provider (hỗ trợ Fast Refresh)
  pages/
    Home.jsx              # Ghép các section, không chứa logic tương tác
    home/
      homeConstants.js    # Nội dung, danh sách module, dữ liệu preview
      Home.module.css     # Style riêng và token màu của trang chủ
    auth/                 # Đăng nhập / đăng ký
    users/                # Ghi chú / Todo / Weekly Plan
  hooks/                  # Hook tái sử dụng
  utils/                  # API và tiện ích hiện có
  index.css               # Tailwind và style chung / legacy
```

## Quy ước bảo trì

- Sửa nội dung và đường dẫn của các thẻ trang chủ trong `homeConstants.js`.
- Thêm section vào `components/home`, rồi ghép trong `pages/Home.jsx`.
- CSS trang chủ dùng CSS Modules; thay đổi màu qua biến ở `.page` và biến thể dark.
- State tương tác nằm gần component sử dụng. Preview chỉ là dữ liệu minh họa trong bộ nhớ, không lưu vào tài khoản.
- Context/hook và provider ở hai file riêng. Thêm provider toàn ứng dụng tại `app/AppProviders.jsx`.
- Routes khai báo ở `app/AppRoutes.jsx`. Các trang làm việc được lazy-load, dùng `WorkspaceLayout`; trang chủ có header/footer riêng.
- Không thêm thời gian chờ giả vào lúc khởi động; fallback chỉ xuất hiện khi đang tải code trang.
- Kiểm tra bàn phím, mobile, dark mode và `prefers-reduced-motion` khi thay đổi UI.

## Kiểm tra thủ công

- Trang chủ: checkbox cập nhật số hoàn thành; đây là bản xem trước, không lưu dữ liệu.
- Mobile: menu mở/đóng, anchor đến đúng section và không tràn ngang.
- Theme: chuyển sáng/tối và tải lại trang.
- Đăng nhập: mở/đóng modal từ header.
- CTA: `/create`, `/todo`, `/weekly-plan`; đường dẫn cũ `/login`, `/register` vẫn được chuyển tiếp.

Các luồng lưu dữ liệu và xác thực cần backend tương ứng. Auto-save trong NoteForm hiện vẫn là mô phỏng có sẵn; đợt thay đổi giao diện này không bổ sung lưu tự động lên server.
