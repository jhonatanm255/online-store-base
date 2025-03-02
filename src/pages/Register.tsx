import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user); // Envía correo de verificación
      toast.success("Account created! Verify your email before signing in.");

      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 md:mt-[64px] sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="full-name" className="sr-only">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <input
                  id="full-name"
                  name="full-name"
                  type="text"
                  required
                  className="pl-10 w-full py-2 border rounded-t-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 w-full py-2 border focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="pl-10 w-full py-2 border rounded-b-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <div className="relative flex items-center justify-center">
            <span className="px-2 bg-gray-50 text-gray-500">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
        </form>
      </div>
    </div>
  );
}
