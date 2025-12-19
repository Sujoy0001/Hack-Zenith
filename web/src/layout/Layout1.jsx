import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Layout01() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-white to-gray-300/60">
        <Header />
        <main className="flex-1 p-0 items-center justify-center flex mx-auto">
            <Outlet />
        </main>
    </div>
  );
}