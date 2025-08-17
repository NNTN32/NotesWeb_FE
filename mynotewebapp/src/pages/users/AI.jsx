import { FaRobot, FaBrain, FaMagic, FaChartLine, FaLightbulb, FaBell, FaCheckCircle } from "react-icons/fa";

const aiFeatures = [
  {
    icon: <FaBrain className="text-4xl" />,
    title: "Phân tích thông minh",
    description: "AI phân tích thói quen ghi chú của bạn",
    color: "from-plum to-rose",
    features: [
      "Đề xuất thời gian ghi chú tối ưu",
      "Phân loại ghi chú tự động",
      "Tìm kiếm thông minh"
    ]
  },
  {
    icon: <FaMagic className="text-4xl" />,
    title: "Tự động hóa",
    description: "Tự động hóa các tác vụ lặp đi lặp lại",
    color: "from-terracotta to-brass",
    features: [
      "Tạo template ghi chú tự động",
      "Nhắc nhở thông minh",
      "Đồng bộ đa thiết bị"
    ]
  }
];

const aiInsights = [
  {
    type: "productivity",
    title: "Tăng hiệu suất 25%",
    description: "Dựa trên thói quen ghi chú của bạn",
    icon: <FaChartLine className="text-2xl" />,
    color: "from-olive to-brass"
  },
  {
    type: "suggestion",
    title: "Đề xuất ghi chú",
    description: "Dựa trên lịch sử tìm kiếm",
    icon: <FaLightbulb className="text-2xl" />,
    color: "from-terracotta to-brass"
  },
  {
    type: "reminder",
    title: "Nhắc nhở",
    description: "3 ghi chú cần cập nhật",
    icon: <FaBell className="text-2xl" />,
    color: "from-plum to-rose"
  }
];

function AIInsights() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <FaRobot className="text-terracotta text-4xl" />
          AI Insights & Đề xuất
        </h2>
        <div className="mx-auto h-1 w-12 bg-gradient-to-r from-terracotta to-brass rounded-full mb-4" />
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Khám phá cách AI có thể giúp bạn làm việc hiệu quả hơn với ghi chú và quản lý công việc
        </p>
      </div>

      {/* AI Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {aiFeatures.map((feature, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${feature.color} rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
          >
            <div className="flex items-center gap-4 mb-6">
              {feature.icon}
              <div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {feature.features.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* AI Insights Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Đề xuất AI cho bạn</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${insight.color} p-6 rounded-xl text-white text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  {insight.icon}
                </div>
              </div>
              <h4 className="font-semibold text-lg mb-2">{insight.title}</h4>
              <p className="text-sm opacity-90">{insight.description}</p>
              <div className="mt-3">
                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  {insight.type === "productivity" ? "Hiệu suất" : 
                   insight.type === "suggestion" ? "Đề xuất" : "Nhắc nhở"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Stats */}
      <div className="bg-gradient-to-r from-ink to-coffee rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Thống kê AI</h3>
          <p className="text-gray-300">Hiệu suất AI trong việc hỗ trợ bạn</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Ghi chú được phân tích", value: "1,247", icon: <FaBrain /> },
            { label: "Đề xuất chính xác", value: "94%", icon: <FaChartLine /> },
            { label: "Thời gian tiết kiệm", value: "2.5h/tuần", icon: <FaMagic /> },
            { label: "Người dùng hài lòng", value: "98%", icon: <FaRobot /> }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-brass mb-2">{stat.value}</div>
              <div className="text-sm text-gray-300 mb-2">{stat.label}</div>
              <div className="flex justify-center text-rose">{stat.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper via-sand to-latte px-8 py-12">
      <AIInsights />
    </div>
  );
}
  