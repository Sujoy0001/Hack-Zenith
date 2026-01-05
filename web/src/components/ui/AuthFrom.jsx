import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Message from "./Message";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path if needed

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
    if (!form.email.includes("@") || !form.email.trim()) {
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
    setError("");

    try {
      if (isLogin) {
        // Login with email/password
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        // Register with email/password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        // Optionally update display name
        if (form.name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: form.name.trim(),
          });
        }
      }

      navigate("/index"); // Redirect on success
    } catch (err) {
      let message = "Something went wrong. Please try again.";

      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "Invalid email or password.";
          break;
        case "auth/email-already-in-use":
          message = "This email is already registered.";
          break;
        case "auth/weak-password":
          message = "Password is too weak.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
        default:
          message = err.message || message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/index");
    } catch (err) {
      let message = "Google sign-in failed.";

      if (err.code === "auth/popup-closed-by-user") {
        message = "Sign-in cancelled.";
      } else if (err.code === "auth/popup-blocked") {
        message = "Popup blocked. Please allow popups and try again.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
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
              required={!isLogin}
            />
          )}

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            type="email"
            className="w-full px-4 py-3 font2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-3 font2 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          <Button
            variant="dark"
            disabled={loading}
            text={loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            type="submit"
          />
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center border-zinc-800 justify-center gap-3 border rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <FcGoogle size={22} />
            <span className="font-medium font2">
              {loading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-sm font2 text-center text-gray-500">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/auth/register")}
                className="text-indigo-600 cursor-pointer font-medium hover:underline"
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/auth/login")}
                className="text-indigo-600 cursor-pointer font-medium hover:underline"
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