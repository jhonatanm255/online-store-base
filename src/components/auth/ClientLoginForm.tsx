import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginSchema, type LoginInput } from "../../lib/validation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Aquí se importa correctamente
import { Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ClientLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar la entrada del usuario
      const input: LoginInput = { email, password };
      loginSchema.parse(input);

      // Intentar iniciar sesión
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Verificar el rol de administrador en Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        toast.success("¡Bienvenido, Administrador!");
        navigate("/admin"); // Redirigir al panel de administrador
      } else {
        toast.success("¡Bienvenido de nuevo!");
        navigate("/"); // Redirigir a la página principal
      }
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          htmlFor="client-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="client-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="client-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="client-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 block w-full py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none"
            placeholder="******"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}













