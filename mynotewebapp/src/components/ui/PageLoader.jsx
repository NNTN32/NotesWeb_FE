/** Route-level loading placeholder. Fades in after 200ms so fast loads never flash. */
export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <span className="skeleton page-loader__title" />
      <span className="skeleton page-loader__line" />
      <span className="skeleton page-loader__line" />
      <span className="skeleton page-loader__line page-loader__line--short" />
    </div>
  );
}
