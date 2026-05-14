import {
  FaRegStickyNote,
  FaTasks,
  FaCalendarAlt,
  FaBolt,
  FaCoffee,
  FaSync,
  FaLightbulb,
  FaRegListAlt,
  FaRegClock,
} from "react-icons/fa";

/**
 * Central copy and routing for the marketing home page.
 * Edit text and links here instead of hunting through JSX.
 */
export const SECTION_IDS = {
  hero: "home-hero",
  scenarios: "home-scenarios",
  features: "home-features",
  workflow: "home-workflow",
  quickStart: "home-quick-start",
};

/** Anchor targets for the jump bar — order matches recommended reading flow */
export const HOME_JUMP_LINKS = [
  { sectionId: SECTION_IDS.scenarios, label: "Giải pháp" },
  { sectionId: SECTION_IDS.features, label: "Tính năng" },
  { sectionId: SECTION_IDS.workflow, label: "Quy trình" },
  { sectionId: SECTION_IDS.quickStart, label: "Bắt đầu" },
];

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
    tips: [
      "Viết tiêu đề ngắn trước, bổ sung nội dung sau — giảm ma sát khi bắt đầu.",
      "Dùng ghi chú làm “bãi đỗ” ý tưởng trước khi chuyển sang Todo hoặc Weekly Plan.",
    ],
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
    tips: [
      "Chia việc lớn thành bước nhỏ có thể hoàn thành trong một phiên làm việc.",
      "Ưu tiên 3 việc quan trọng nhất mỗi ngày thay vì cố gắng làm hết danh sách.",
    ],
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
    tips: [
      "Nhìn tuần giúp bạn thấy chỗ bị “dồn việc” và điều chỉnh sớm.",
      "Giữ một khối thời gian trống cho việc phát sinh — tránh kế hoạch quá kín.",
    ],
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

/**
 * Interactive “problem → path” scenarios — copy lives here for easy tuning.
 * `featureId` ties to FEATURES[].id for cross-links in the UI.
 */
export const USER_SCENARIOS = [
  {
    id: "scatter",
    pain: "Nhiều ý tưởng nhưng khó bắt đầu",
    detail: "Bạn ghi được vài dòng rồi bị kẹt, hoặc nhảy qua nhảy lại giữa nhiều việc.",
    solveTitle: "Ghi nhanh, tinh gọn",
    solveBody:
      "Mở ghi chú, chốt một ý chính trước. Khi đủ rõ, chuyển sang Todo để biến ý thành hành động cụ thể.",
    cta: "Tạo ghi chú",
    to: "/create",
    featureId: "notes",
    icon: FaLightbulb,
  },
  {
    id: "overload",
    pain: "Không biết việc nào quan trọng nhất",
    detail: "Danh sách dài khiến bạn chần chừ, dễ làm việc “dễ” thay vì việc “cần”.",
    solveTitle: "Todo có trọng tâm",
    solveBody:
      "Dùng Todo để lọc và ưu tiên. Hoàn thành từng mục nhỏ giúp bạn lấy lại đà làm việc.",
    cta: "Mở Todo",
    to: "/todo",
    featureId: "todo",
    icon: FaRegListAlt,
  },
  {
    id: "week",
    pain: "Tuần trôi mà không khớp kế hoạch",
    detail: "Bạn cảm giác bị cuốn theo lịch, khó nhìn xa hơn một hai ngày.",
    solveTitle: "Weekly Plan làm khung",
    solveBody:
      "Nhìn cả tuần trên một màn hình để phân bổ thời gian và chủ động điều chỉnh khi ưu tiên thay đổi.",
    cta: "Weekly Plan",
    to: "/weekly-plan",
    featureId: "weekly",
    icon: FaRegClock,
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
