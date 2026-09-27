import { Outlet } from "react-router-dom";
import SideMenu from "../SideMenu";
import Footer from "../Footer";

export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen flex">
      <SideMenu />
      <div className="min-w-0 flex-1 flex flex-col">
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
