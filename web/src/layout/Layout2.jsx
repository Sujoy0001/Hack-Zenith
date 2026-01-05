import React from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

export default function Layout2() {
  return (
    <div className="w-full min-h-screen">
      <aside className="fixed top-0 left-0 h-screen w-64 z-40">
        <SideNav />
      </aside>

      <main className="ml-74 min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
