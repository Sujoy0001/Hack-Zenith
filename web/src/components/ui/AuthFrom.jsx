import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Message from "./Message";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({ type = "login" }) {
  const isLogin = type === "login";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!isLogin && !form.name.trim()) {
      return "Name is required";
    }
    if (!form.email.includes("@")) {
      return "Enter a valid email";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/index"); // after success
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/index");
    }, 1200);
  };

  return (
    <div className="min-h-full max-w-lg w-full flex items-center bg-amber-50/40 rounded-2xl justify-center px-4">
        <div className="p-8 md:p-10 text-center">
          <h2 className="text-4xl font2 font-bold text-zinc-800">
            {isLogin ? "Login" : "Create Account"}
          </h2>
          <p className="text-gray-500 font2 mt-1">
            {isLogin ? "Welcome back 👋" : "Join FindIn today 🚀"}
          </p>

          {error && (
            <div className="mt-4 font2">
              <Message type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-3 font2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            )}

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              type="email"
              className="w-full px-4 py-3 font2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              className="w-full px-4 py-3 font2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

            <Button variant="dark" disabled={loading} text={loading ? "Please wait..." : isLogin ? "Login" : "Register"} type="submit"  />
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center border-zinc-800 justify-center gap-3 border rounded-lg py-3 hover:bg-gray-50 transition"
            >
              <FcGoogle size={22} />
              <span className="font-medium font2">
                Continue with Google
              </span>
            </button>
          </div>

          <p className="mt-6 text-sm font2 text-center text-gray-500">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/auth/register")}
                  className="text-indigo-600 cursor-pointer font-medium"
                >
                  Register
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/auth/login")}
                  className="text-indigo-600 cursor-pointer font-medium"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
    </div>
  );
}
