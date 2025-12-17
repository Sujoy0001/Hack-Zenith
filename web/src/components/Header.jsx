import React from "react";
import Button from "./ui/Button.jsx";
import { GoalIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <>
            <div className="max-w-3xl mx-auto mt-8 h-16 w-full bg-gray-100 border border-gray-200 rounded-4xl shadow-md sticky top-4 z-50">
                <div className="flex justify-between items-center px-7 h-full">
                    <Link to="/">
                        <div className="logo font2 flex items-center gap-2">
                            <GoalIcon className="inline-block w-6 h-6 text-zinc-800" />
                            <h1 className="text-zinc-800 text-2xl font-extrabold">FindIn</h1>
                        </div>
                    </Link>
                    <div className="btn-group flex gap-0.5 w-auto">
                        <Link to="/auth/login">
                            <Button text="Login" variant="free" iconPosition="right" />
                        </Link>
                        <Link to="/auth/register">
                            <Button text="Sign Up" variant="free" icon={ArrowRight}  iconPosition="right" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}