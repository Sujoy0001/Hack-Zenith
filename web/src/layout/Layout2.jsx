import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import TopNav from "../components/TopNav";

export default function Layout2() {

  return (
    <div className="flex h-screen w-full">
      <div className="max-w-6xl w-full mx-auto flex gap-2">
        <SideNav />
        <main className="flex-1 overflow-y-auto">
            <TopNav />
            <Outlet />
        </main>
      </div>
    </div>
  );
}
