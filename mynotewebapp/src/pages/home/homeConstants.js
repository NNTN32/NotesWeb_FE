import {
  FaRegStickyNote,
  FaTasks,
  FaCalendarAlt,
  FaBolt,
  FaCoffee,
  FaSync,
} from "react-icons/fa";

/**
 * Central copy and routing for the marketing home page.
 * Edit text and links here instead of hunting through JSX.
 */
export const SECTION_IDS = {
  hero: "home-hero",
  features: "home-features",
  workflow: "home-workflow",
  quickStart: "home-quick-start",
};

/** Main product pillars — drives feature cards and quick-action chips */
export const FEATURES = [
  {
    id: "notes",
    title: "Ghi chú",
    description:
      "Tạo và quản lý ghi chú mọi lúc mọi nơi. Ghi lại ý tưởng, tài liệu và thông tin quan trọng.",
    icon: FaRegStickyNote,
    to: "/create",
    gradient: "from-terracotta to-brass",
    label: "Tạo ghi chú",
  },
  {
    id: "todo",
    title: "Todo",
    description:
      "Theo dõi công việc với danh sách todo. Ưu tiên, lọc và hoàn thành từng nhiệm vụ.",
    icon: FaTasks,
    to: "/todo",
    gradient: "from-coffee to-terracotta",
    label: "Xem Todo",
  },
  {
    id: "weekly",
    title: "Weekly Plan",
    description:
      "Lên kế hoạch tuần hiệu quả. Phân bổ thời gian và theo dõi tiến độ hàng ngày.",
    icon: FaCalendarAlt,
    to: "/weekly-plan",
    gradient: "from-rose to-coffee",
    label: "Lên kế hoạch",
  },
];

/** Short metrics row under the hero — adjust numbers/copy without touching layout */
export const HERO_STATS = [
  { id: "modules", value: "3", label: "module chính", sub: "Ghi chú · Todo · Tuần" },
  { id: "focus", value: "1", label: "không gian làm việc", sub: "Một giao diện gọn gàng" },
  { id: "pace", value: "∞", label: "ý tưởng mỗi ngày", sub: "Theo nhịp của bạn" },
];

/** “Why us” row — icons from react-icons */
export const VALUE_PROPS = [
  {
    id: "fast",
    title: "Vào việc nhanh",
    body: "Đi thẳng tới tạo ghi chú, todo hoặc lịch tuần — không rườm rà.",
    icon: FaBolt,
  },
  {
    id: "calm",
    title: "Thiết kế dễ chịu",
    body: "Tông màu ấm, chế độ tối và bố cục rõ ràng để làm việc lâu không mỏi mắt.",
    icon: FaCoffee,
  },
  {
    id: "flow",
    title: "Luồng liền mạch",
    body: "Các phần của app bổ trợ nhau: ghi → làm → lên kế hoạch.",
    icon: FaSync,
  },
];

/** Numbered journey for the “How it works” band */
export const WORKFLOW_STEPS = [
  {
    id: "capture",
    title: "Ghi lại",
    body: "Viết ghi chú hoặc thêm việc cần làm khi ý tưởng vừa đến.",
    to: "/create",
    cta: "Mở ghi chú",
    highlights: ["Mở trang tạo ghi chú ngay", "Giữ ý tưởng trước khi quên"],
  },
  {
    id: "organize",
    title: "Sắp xếp",
    body: "Ưu tiên todo và xem toàn cảnh tuần để biết việc gì quan trọng nhất.",
    to: "/todo",
    cta: "Mở Todo",
    highlights: ["Lọc và sắp xếp theo mức ưu tiên", "Đánh dấu hoàn thành từng việc"],
  },
  {
    id: "plan",
    title: "Lên kế hoạch",
    body: "Phân bổ thời gian theo tuần để duy trì nhịp độ bền vững.",
    to: "/weekly-plan",
    cta: "Weekly Plan",
    highlights: ["Nhìn cả tuần trên một màn hình", "Điều chỉnh khi ưu tiên thay đổi"],
  },
];
