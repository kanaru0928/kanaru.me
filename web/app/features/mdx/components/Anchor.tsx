import { Link } from "react-router";

export function Anchor(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link to={props.href || ""} rel="noopener noreferrer" target="_blank">
      {props.children}
    </Link>
  );
}
