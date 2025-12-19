import AuthForm from "../components/ui/AuthFrom";
import { Play, Sparkles, ArrowRight } from "lucide-react";

export default function Login() {
  return (
    <>
      <div className="min-h-full flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          <AuthForm type="login" /> 
        </div>
      </div>
      </>
    );
}
