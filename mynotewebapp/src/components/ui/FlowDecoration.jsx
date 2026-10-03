import {
  FiBookOpen,
  FiCheckSquare,
  FiCalendar,
  FiFeather,
  FiSun,
  FiHeart,
} from "react-icons/fi";
import "../../styles/flow.css";
const ICONS = [
  FiFeather,
  FiBookOpen,
  FiHeart,
  FiCheckSquare,
  FiCalendar,
  FiSun,
];

export default function FlowDecoration() {
  return (
    <div className="flow-decoration" aria-hidden="true">
      <svg viewBox="0 0 1000 230" preserveAspectRatio="none">
        {[35, 115, 195].map((y) => (
          <path key={`l${y}`} d={`M 10 ${y} C 220 ${y}, 220 115, 420 115`} />
        ))}
        {[35, 115, 195].map((y) => (
          <path key={`r${y}`} d={`M 580 115 C 780 115, 780 ${y}, 990 ${y}`} />
        ))}
        <path
          className="flow-decoration__signal"
          d="M 10 35 C 220 35, 220 115, 420 115 M 580 115 C 780 115, 780 195, 990 195"
        />
      </svg>
      {ICONS.map((Icon, index) => (
        <span key={index} className={`flow-node flow-node--${index + 1}`}>
          <Icon />
        </span>
      ))}
    </div>
  );
}
