import { Navigate, redirect, StaticRouter } from "react-router";

export const loader = async () => {
  return redirect("/portfolio/about", {
    status: 301,
  });
};

export default function IndexPage() {
  return <Navigate to="/portfolio/about" replace />;
}
