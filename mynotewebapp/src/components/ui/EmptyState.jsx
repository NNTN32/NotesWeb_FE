import Animate from "./Animate";

export default function EmptyState({ children }) {
  return (
    <Animate as="p" name="fade" className="empty">
      {children}
    </Animate>
  );
}
