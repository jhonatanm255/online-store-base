import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaCog,
  FaBars,
  FaHome,
} from "react-icons/fa"; // Ejemplo de iconos

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`transition-all duration-300 h-screen ${
        collapsed ? "w-16" : "w-64"
      } bg-gray-800 text-white p-4 relative overflow-hidden`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-2 text-white py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
      >
        <FaBars />
      </button>

      <ul className="mt-12">
        <li className="mb-6 group">
          <Link
            to="/admin"
            className="flex items-center space-x-4 group-hover:bg-gray-700 rounded-md p-2 transition"
          >
            <FaHome className="text-2xl flex-shrink-0" />
            {!collapsed && <span className="text-lg">Inicio</span>}
          </Link>
        </li>
        <li className="mb-6 group">
          <Link
            to="/admin/products"
            className="flex items-center space-x-4 group-hover:bg-gray-700 rounded-md p-2 transition"
          >
            <FaBoxes className="text-2xl flex-shrink-0" />
            {!collapsed && <span className="text-lg">Gestionar Productos</span>}
          </Link>
        </li>
        {/* <li className="mb-6 group">
          <Link
            to="/usuarios"
            className="flex items-center space-x-4 group-hover:bg-gray-700 rounded-md p-2 transition"
          >
            <FaUsers className="text-2xl flex-shrink-0" />
            {!collapsed && <span className="text-lg">Usuarios</span>}
          </Link>
        </li> */}
        <li className="mb-6 group">
          <Link
            to="/admin/orders"
            className="flex items-center space-x-4 group-hover:bg-gray-700 rounded-md p-2 transition"
          >
            <FaShoppingCart className="text-2xl flex-shrink-0" />
            {!collapsed && <span className="text-lg">Gestionar Pedidos</span>}
          </Link>
        </li>
        {/* <li className="mb-6 group">
          <Link
            to="/configuracion"
            className="flex items-center space-x-4 group-hover:bg-gray-700 rounded-md p-2 transition"
          >
            <FaCog className="text-2xl flex-shrink-0" />
            {!collapsed && <span className="text-lg">Configuraciones</span>}
          </Link>
        </li> */}
      </ul>
    </div>
  );
}

