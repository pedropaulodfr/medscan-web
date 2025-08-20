import { useState } from "react";
import './Admin.css';
import Sidebar from "../components/Sidebar/Sidebar";

export default function Empty({ component: Component }) {
  return (
    <div className="admin">
        <Component />
    </div>
  );
}
