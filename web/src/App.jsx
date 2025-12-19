import { Link } from "react-router-dom";
import Button from "./components/ui/Button.jsx";
import { ArrowRight } from "lucide-react";
import ChangeText from "./components/ui/ChangeText.jsx";

function App() {
  return (
      <div className="h-full flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl text-center">
          <ChangeText
            texts={[
              "Report missing products",
              "Upload found items",
              "AI matches details instantly",
              "Chat securely with users",
            ]}
          />

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight font2">
            Welcome to FindIn!
            <span className="block mt-3 text-red-800">
              Find what matters, faster.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font2">
            Discover and locate lost or found items effortlessly with FindIn.
            Our AI-powered system connects people and products in seconds.
          </p>

          <div className="group flex mt-8 justify-center gap-4">
            <Link to="/auth/register">
              <Button text="Post your first issue" variant="roundb" icon={ArrowRight}  iconPosition="right" />
            </Link>
            <Link to="/auth/login">
              <Button text="Login & Explore" variant="round" icon={ArrowRight}  iconPosition="right" />
            </Link>
          </div>
        </div>
      </div>
  );
}

export default App;
