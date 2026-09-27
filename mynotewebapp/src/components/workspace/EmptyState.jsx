import { FiFeather } from "react-icons/fi";
export default function EmptyState({ title, description, children }) {
  return (
    <div className="ws-empty">
      <FiFeather aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
