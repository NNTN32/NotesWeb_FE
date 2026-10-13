import { Link } from "react-router-dom";
import { ROUTES } from "../../app/routes";

export default function Logo({ onClick }) {
  return (
    <Link to={ROUTES.home} className="logo" onClick={onClick} aria-label="MyNote home">
      MyNote<span aria-hidden="true">.</span>
    </Link>
  );
}
