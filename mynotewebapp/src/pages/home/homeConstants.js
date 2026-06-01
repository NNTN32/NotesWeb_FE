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

/** Intersection + scroll motion tuning (paired with `.home-*` in index.css) */
export const HOME_MOTION = {
  revealRootMargin: "0px 0px -10% 0px",
  revealThreshold: 0.14,
  missionScrollMultiplier: 2.4,
};

export const SECTION_IDS = {
  hero: "home-hero",
  mission: "home-mission",
  principles: "home-principles",
  scenarios: "home-scenarios",
  features: "home-features",
  workflow: "home-workflow",
  quickStart: "home-quick-start",
};

/** Decorative sticky notes in the hero — % position, rotation in deg */
export const FLOATING_CHIPS = [
  { id: "chip-note-1", label: "Ghi chú", variant: "note", top: "10%", left: "6%", delay: "0s", duration: "14s", rotate: "-6deg", alt: false },
  { id: "chip-todo-1", label: "Todo", variant: "todo", top: "18%", left: "80%", delay: "-2s", duration: "16s", rotate: "5deg", alt: true },
  { id: "chip-week-1", label: "Tuần", variant: "week", top: "56%", left: "4%", delay: "-5s", duration: "18s", rotate: "4deg", alt: true },
  { id: "chip-check", label: "✓", variant: "check", top: "66%", left: "84%", delay: "-1s", duration: "13s", rotate: "-3deg", alt: false },
  { id: "chip-idea", label: "Ý tưởng", variant: "idea", top: "36%", left: "86%", delay: "-7s", duration: "15s", rotate: "7deg", alt: false },
  { id: "chip-plan", label: "Kế hoạch", variant: "plan", top: "76%", left: "40%", delay: "-4s", duration: "17s", rotate: "-5deg", alt: true },
];

/** Hero desk preview — stacked planner cards (copy only) */
export const HERO_DESK_PREVIEW = [
  { id: "preview-note", title: "Ý tưởng sáng", lines: ["Viết outline trước", "Chuyển sang Todo khi rõ"], tone: "sand" },
  { id: "preview-todo", title: "Hôm nay", lines: ["□ Gọi khách hàng", "□ Soạn báo cáo"], tone: "rose" },
  { id: "preview-week", title: "Tuần 22", lines: ["T2 · Tập trung sâu", "T5 · Review tiến độ"], tone: "latte" },
];

/** Hero — Sui-style large headline, notes/planner voice */
export const HERO_COPY = {
  eyebrow: "MyNote · Planner",
  headline: ["Nâng tầm cách bạn", "ghi chú &"],
  headlineAccent: "lên kế hoạch",
  subline:
    "Ghi lại ý tưởng, xử lý việc cần làm và nhìn toàn cảnh tuần — giao diện ấm, typography lớn và chuyển động theo cuộn cuốn hút.",
  primaryCta: "Tạo ghi chú ngay",
  secondaryCta: "Xem Todo",
  exploreHint: "Cuộn để khám phá",
};

/** Scroll-scrubbed mission band (Sui about mission block) */
export const MISSION_COPY = {
  intro: "Sứ mệnh của MyNote là",
  lines: [
    "giúp bạn ghi lại mọi ý tưởng",
    "hoàn thành việc quan trọng",
    "và lên kế hoạch tuần một cách bền vững",
  ],
  outro: "— thông qua ba module Ghi chú, Todo và Weekly Plan trong một giao diện gọn gàng.",
};

/** Principles section chrome */
export const PRINCIPLES_COPY = {
  ghostLabel: "nguyên tắc",
  eyebrow: "Nguyên tắc",
  title: "MyNote tồn tại để phục vụ nhịp làm việc hàng ngày của bạn",
};

/** Resources / features band (Sui “Dive deeper”) */
export const RESOURCES_COPY = {
  eyebrow: "Khám phá",
  title: "Đi sâu hơn vào từng module",
};

/** Final CTA band */
export const FINAL_CTA_COPY = {
  title: "Sẵn sàng bắt đầu tuần mới?",
  body: "Tạo ghi chú đầu tiên, thêm vài việc vào Todo, hoặc mở Weekly Plan — chỉ vài cú nhấp.",
  primaryCta: "Bắt đầu miễn phí",
  secondaryCta: "Mở Weekly Plan",
};

/** Anchor targets for the jump bar — order matches recommended reading flow */
export const HOME_JUMP_LINKS = [
  { sectionId: SECTION_IDS.mission, label: "Sứ mệnh" },
  { sectionId: SECTION_IDS.principles, label: "Nguyên tắc" },
  { sectionId: SECTION_IDS.scenarios, label: "Giải pháp" },
  { sectionId: SECTION_IDS.features, label: "Module" },
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
