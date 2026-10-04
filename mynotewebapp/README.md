# MyNote

React 19 + Vite. Trang chủ, sổ ghi chép, Todo theo khung giờ, kế hoạch tuần và giao diện tài khoản.

## Phát triển

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

Dev server proxy `/api` tới `http://localhost:8081` (xem `vite.config.js`). Các luồng tài khoản cần backend này. Frontend không mô phỏng đăng nhập thành công.

## Deploy production

Xem [cấu hình Dokploy và kết quả review](deploy/DOKPLOY.md). Dockerfile build bundle bằng Yarn lockfile và phục vụ qua Nginx; runtime cần `API_UPSTREAM` và network kết nối backend.

## Cấu trúc và trách nhiệm

```text
src/
  app/                     # Providers, routes lazy-load, reset cuộn khi chuyển trang
  components/
    home/                  # Section trang chủ
    layout/                # Khung làm việc, sidebar và footer
    workspace/             # PageHeader, EmptyState, native dialog, nền động trang
    tasks/                 # TaskCard, TaskEditor, bộ lọc, lịch ngày/tuần, thống kê
    notes/                 # Trang giấy và thư viện ghi chú
    auth/                  # Một AuthForm dùng cho login/register, page/modal
  features/
    tasks/                 # Model ngày/tuần, lọc/sắp xếp, hook điều phối giao diện
    notes/                 # Model ghi chú và hook điều phối editor
    auth/                  # Gọi API xác thực, trạng thái gửi và lỗi
  context/                 # Context/hook .js tách khỏi provider .jsx
  hooks/                   # useLocalStore: đọc/ghi và đồng bộ giữa các tab
  pages/                   # Ghép component và state giao diện theo route
  styles/
    workspace.css          # Entry import các nhóm style bên dưới
    workspace-base.css     # Token, khung ứng dụng và UI dùng chung
    tasks.css              # Todo và lịch tuần
    notes.css              # Giao diện viết và thư viện
    auth.css               # Giao diện tài khoản
    ambient.css            # Chuyển động nền theo từng trang
    interactions.css       # Chuyển động nút dùng chung, tinh chỉnh theo trang
    responsive.css         # Breakpoint và reduced motion
  utils/api/               # API xác thực hiện có
  index.css                # Tailwind, reset nhỏ và chuyển động mascot
  pages/home/              # Nội dung và CSS Module của trang chủ

tests/                     # Node test runner, không cần thư viện test bổ sung
```

Page chỉ điều phối. Logic ngày tháng, lọc, thống kê và chuyển đổi dữ liệu nằm trong model thuần để kiểm thử riêng. Component dùng lại nằm trong `components`; state dùng chung giữa Todo và Weekly Plan nằm trong `TasksProvider`.

## Thiết kế

- Ghi chú: giấy ấm, màu đất, dòng kẻ và chế độ tập trung.
- Todo: xanh sage, nhịp theo khung giờ, bộ lọc và danh sách tập trung.
- Lịch tuần: lavender, tuần bắt đầu thứ Hai, bảy cột cuộn trong khung ở mobile.
- Tài khoản: tông ấm và mascot, chung form cho trang riêng và modal.
- Trang chủ, Ghi chú, Todo, Kế hoạch tuần và Tài khoản có nền động riêng qua `AmbientBackground` và biến thể trong `ambient.css`. Thêm trang mới bằng một biến thể CSS, không thêm timer hay logic animation vào page. Lớp này chỉ trang trí (`aria-hidden`, `pointer-events: none`); animation chỉ thay `transform`, tự dừng khi bật `prefers-reduced-motion`.
- CSS workspace được giới hạn bằng `.workspace-theme` và các lớp theo feature. Thay token ở `workspace-base.css`; màu nhấn riêng nằm ở file của mỗi feature. Trang chủ giữ CSS Module riêng.
- Hiệu ứng nút nằm trong `interactions.css` (workspace) và CSS Module của trang chủ. Chỉ chạy khi hover bằng chuột hoặc nhấn; các biến theo trang giữ đúng sắc thái riêng. `prefers-reduced-motion` loại bỏ chuyển động mà vẫn giữ trạng thái focus rõ ràng.
- Dialog dùng `<dialog>.showModal()` để giữ focus và cô lập nền; Escape đóng và focus trở về phần tử mở.

## Dữ liệu và giới hạn

- `mynote.tasks.v1`: công việc dùng chung cho Todo và Weekly Plan. Không nạp dữ liệu mẫu 2024 của giao diện cũ.
- `mynote.notes.v1`: bản nháp hiện tại và sổ ghi chú. Bản nháp được lưu khi nhập; “Lưu vào sổ” tạo/cập nhật trang. Có tải `.txt` để giữ bản sao.
- Tất cả dữ liệu này nằm trong localStorage **của trình duyệt**, không đồng bộ tài khoản/server. Đăng xuất không xóa sổ và công việc cục bộ; giao diện nêu rõ điều này.
- Trạng thái lưu chỉ báo thành công khi ghi localStorage thành công. Lỗi đọc/ghi được hiển thị; dữ liệu lỗi không bị tự động ghi đè khi khởi động. Thay đổi tiếp theo của người dùng sẽ lưu bộ dữ liệu đang hiển thị, vì vậy cần sao lưu bản cũ trước nếu thấy lỗi đọc.
- Xóa có hoàn tác lần gần nhất trong phiên của trang; thông tin hoàn tác không giữ sau reload/chuyển trang.
- API `/auth/login`, `/auth/register`, `/auth/oauth/:provider` giữ nguyên. Token được gửi qua interceptor và xóa khi đăng xuất. Chưa bổ sung endpoint khôi phục phiên `/me`.

## Xác minh

`npm test` kiểm tra tuần qua ranh giới năm/tháng, năm nhuận, khung giờ, bộ lọc/sắp xếp không mutate, thống kê, validation dữ liệu lưu, lưu/cập nhật/xóa ghi chú.

Kiểm tra trình duyệt:

1. Thêm việc, reload, chuyển qua lịch tuần; hoàn thành/sửa/xóa/hoàn tác.
2. Chuyển ngày và tuần, kiểm tra bộ lọc và chế độ danh sách.
3. Nhập bản nháp, reload, lưu vào sổ, mở lại, focus mode và Escape, xóa/hoàn tác.
4. Mobile 390px: mở/đóng sidebar, bảng tuần cuộn trong khung, form không tràn ngang.
5. Đăng nhập/đăng ký: kiểm tra required fields, mật khẩu xác nhận, hiện/ẩn mật khẩu, Escape/focus trong modal. Kiểm tra thành công API cần backend và tài khoản thử nghiệm.
