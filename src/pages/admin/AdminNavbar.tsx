import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada");
      navigate("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <nav className="fixed w-full bg-gray-800 text-white p-4 flex justify-between z-50">
      <h1 className="text-lg font-bold">Panel de Administración</h1>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        Cerrar sesión
      </button>
    </nav>
  );
}
