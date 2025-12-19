import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, AlertTriangle, ListChecks, User, Settings, PlusCircle, GoalIcon, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { useIssueModal } from "../context/IssueModalContext";
import IssueUploadModal from "./IssueUpload";

const NAV_ITEMS = [
  { name: "Home", path: "/index", icon: Home, end: true },
  { name: "My Report", path: "/index/report", icon: AlertTriangle },
  { name: "All Issues", path: "/index/all-issues", icon: ListChecks },
  { name: "Profile", path: "/index/profile", icon: User },
  { name: "Settings", path: "/index/settings", icon: Settings },
];

export default function SideNav() {

  const [open, setOpen] = useState(false);

  return (
    <aside className="h-screen flex flex-col justify-between py-6 px-2 w-54 lg:w-64">
        <div className="">
            <div className="flex items-left px-4 gap-3">
                <Link to="/">
                    <div className="logo font2 flex items-center gap-2">
                        <GoalIcon className="inline-block w-7 h-7 text-zinc-800" />
                        <h1 className="text-zinc-800 text-3xl font-extrabold">FindIn</h1>
                    </div>
                </Link>
            </div>

            <nav className="flex flex-col mt-8 py-8 gap-2 space-y-1">
                {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
                <NavLink
                    key={name}
                    to={path}
                    end
                    className={({ isActive }) =>
                    `text-left rounded-4xl py-1.5 
                    ${isActive
                        ? "text-red-800 bg-gray-200 rounded-4xl"
                        : "hover:bg-gray-200 rounded-4xl"}`
                    }
                >
                    <Button text={name} variant="free" icon={Icon}/>
                </NavLink>
                ))}
            </nav>
        </div>

        <div className="p-0">
            <Button text="Create issue" variant="dark" iconPosition="right" icon={Upload} onClick={() => setOpen(true)} />
        </div>

        <IssueUploadModal
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={(data) => console.log(data)}
        />
    </aside>
  );
}
