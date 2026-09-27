import { FiEdit3, FiCheckSquare, FiCalendar } from "react-icons/fi";

export const HOME_LINKS = [
  { href: "#features", label: "Không gian của bạn" },
  { href: "#workflow", label: "Cách sử dụng" },
];

export const MODULES = [
  {
    id: "notes",
    number: "01",
    label: "Ghi chú",
    icon: FiEdit3,
    title: "Một nơi cho mọi ý tưởng.",
    description:
      "Một suy nghĩ bất chợt, một điều vừa học hay kế hoạch còn dang dở. Viết xuống để dành chỗ cho điều tiếp theo.",
    to: "/create",
    action: "Viết ghi chú",
    tone: "peach",
    items: [
      "Ý tưởng cho dự án mới",
      "Những điều muốn thử",
      "Một chút cảm hứng mỗi ngày",
    ],
  },
  {
    id: "tasks",
    number: "02",
    label: "Việc cần làm",
    icon: FiCheckSquare,
    title: "Từng việc nhỏ. Tiến bộ lớn.",
    description:
      "Sắp xếp những điều cần làm và tập trung vào bước tiếp theo. Cảm giác đánh dấu hoàn thành luôn thật dễ chịu.",
    to: "/todo",
    action: "Mở danh sách việc",
    tone: "sage",
    items: [
      "Chọn việc quan trọng nhất",
      "Chia nhỏ để dễ bắt đầu",
      "Ghi nhận mỗi bước tiến",
    ],
  },
  {
    id: "week",
    number: "03",
    label: "Kế hoạch tuần",
    icon: FiCalendar,
    title: "Nhìn xa hơn một ngày.",
    description:
      "Dành chỗ cho công việc, những cuộc hẹn và cả thời gian cho riêng bạn. Một tuần rõ ràng, một tâm trí nhẹ nhàng.",
    to: "/weekly-plan",
    action: "Lên kế hoạch tuần",
    tone: "lavender",
    items: [
      "Nhìn toàn cảnh cả tuần",
      "Phân bổ thời gian của bạn",
      "Giữ khoảng trống để nghỉ ngơi",
    ],
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Ghi lại điều đang nghĩ",
    body: "Bắt đầu bằng một ý tưởng. Chưa cần hoàn hảo, chỉ cần viết ra.",
  },
  {
    title: "Chọn điều cần làm",
    body: "Biến những dự định thành từng việc nhỏ, rõ ràng và vừa sức.",
  },
  {
    title: "Tạo nhịp điệu riêng",
    body: "Sắp xếp một tuần có chỗ cho cả mục tiêu và những khoảng nghỉ.",
  },
];

export const PREVIEW_TASKS = [
  { id: "read", label: "Đọc vài trang sách", done: true },
  { id: "idea", label: "Phác thảo ý tưởng mới", done: false },
  { id: "walk", label: "Đi dạo & nạp lại năng lượng", done: false },
];
