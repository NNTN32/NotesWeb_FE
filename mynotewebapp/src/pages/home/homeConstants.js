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

/** Intersection + scroll motion tuning (paired with `.home-*` in index.css) */
export const HOME_MOTION = {
  revealRootMargin: "0px 0px -10% 0px",
  revealThreshold: 0.14,
  missionScrollMultiplier: 2.4,
};

/** Hero desk stack — auto-tear interval & animation id (see `.home-desk-card--tearing` in index.css) */
export const HOME_DESK_MOTION = {
  autoTearIntervalMs: 5200,
  tearAnimationName: "homeDeskTear",
};

/** Icons for the three module floating chips (Notes · Todo · Week) */
export const FLOATING_MODULE_ICONS = {
  note: FaRegStickyNote,
  todo: FaTasks,
  week: FaCalendarAlt,
};

export const SECTION_IDS = {
  hero: "home-hero",
  mission: "home-mission",
  principles: "home-principles",
  scenarios: "home-scenarios",
};

/** Decorative sticky notes in the hero — % position, rotation in deg */
export const FLOATING_CHIPS = [
  { id: "chip-note-1", module: "note", variant: "note", ariaLabel: "Ghi chú", top: "10%", left: "6%", delay: "0s", duration: "14s", rotate: "-6deg", alt: false },
  { id: "chip-todo-1", module: "todo", variant: "todo", ariaLabel: "Todo", top: "18%", left: "80%", delay: "-2s", duration: "16s", rotate: "5deg", alt: true },
  { id: "chip-week-1", module: "week", variant: "week", ariaLabel: "Tuần", top: "56%", left: "4%", delay: "-5s", duration: "18s", rotate: "4deg", alt: true },
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

/** Mission visual — module flow on the right (pairs with FLOATING_MODULE_ICONS) */
export const MISSION_FLOW_STEPS = [
  { id: "mission-notes", module: "note", label: "Ghi chú", hint: "Bắt ý tưởng khi còn mới" },
  { id: "mission-todo", module: "todo", label: "Todo", hint: "Biến ý thành việc cụ thể" },
  { id: "mission-week", module: "week", label: "Weekly Plan", hint: "Nhìn toàn cảnh cả tuần" },
];

export const MISSION_FLOW_MOTION = {
  stepIntervalMs: 2800,
};

/** Principles section chrome */
export const PRINCIPLES_COPY = {
  ghostLabel: "nguyên tắc",
  eyebrow: "Nguyên tắc",
  title: "MyNote tồn tại để phục vụ nhịp làm việc hàng ngày của bạn",
};

/** Scenarios band — duy nhất giới thiệu chi tiết từng module sau Sứ mệnh */
export const SCENARIOS_COPY = {
  eyebrow: "Giải pháp",
  title: "Từ vướng mắc đến lối đi rõ ràng",
  tabListLabel: "Chọn module",
  panelPrefix: "Điểm chính",
};

/** Final CTA band */
export const FINAL_CTA_COPY = {
  title: "Sẵn sàng bắt đầu tuần mới?",
  body: "Chọn một điểm bắt đầu — mọi module đều nằm trong cùng một giao diện.",
  primaryCta: "Bắt đầu miễn phí",
  secondaryCta: "Mở Weekly Plan",
};

/** Anchor targets for the jump bar — order matches recommended reading flow */
export const HOME_JUMP_LINKS = [
  { sectionId: SECTION_IDS.mission, label: "Sứ mệnh" },
  { sectionId: SECTION_IDS.principles, label: "Nguyên tắc" },
  { sectionId: SECTION_IDS.scenarios, label: "Giải pháp" },
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
 * Mỗi module: icon (`module` → FLOATING_MODULE_ICONS) + tagline ngắn + 2 điểm chính.
 */
export const USER_SCENARIOS = [
  {
    id: "scatter",
    module: "note",
    moduleLabel: "Ghi chú",
    tagline: "Bắt ý tưởng trước khi quên",
    points: ["Một ý chính mỗi ghi chú", "Chuyển Todo khi đã rõ"],
    cta: "Tạo ghi chú",
    to: "/create",
  },
  {
    id: "overload",
    module: "todo",
    moduleLabel: "Todo",
    tagline: "Biết việc nào làm trước",
    points: ["Ưu tiên 3 việc mỗi ngày", "Chia nhỏ từng bước"],
    cta: "Mở Todo",
    to: "/todo",
  },
  {
    id: "week",
    module: "week",
    moduleLabel: "Weekly Plan",
    tagline: "Nhìn cả tuần một lần",
    points: ["Phân bổ thời gian rõ", "Chừa chỗ cho phát sinh"],
    cta: "Weekly Plan",
    to: "/weekly-plan",
  },
];
