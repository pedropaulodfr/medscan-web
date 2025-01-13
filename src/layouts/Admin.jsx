import { useState } from "react";
import './Admin.css';
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home";

export default function Admin({ component: Component }) {
  const [sidebarStatus, setSidebarStatus] = useState(false);

  return (
    <div className="admin">
      <Sidebar sidebarStatus={setSidebarStatus}></Sidebar>
      <div
        className={`component-home ${!sidebarStatus ? "sidebar-open" : ""}`}
      >
        <Component />
      </div>
    </div>
  );
}
