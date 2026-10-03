import { FiFeather } from "react-icons/fi";

export default function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="ws-page-header">
      <div>
        <p className="ws-eyebrow">
          <FiFeather aria-hidden="true" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="ws-description">{description}</p>
      </div>
      {children && <div className="ws-header-actions">{children}</div>}
    </header>
  );
}
