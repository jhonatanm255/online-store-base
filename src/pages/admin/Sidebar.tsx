import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxes,
  FaUsers,
  FaShoppingCart,
  FaCog,
  FaBars,
  FaHome,
} from "react-icons/fa";

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
      className={`transition-all duration-300 min-h-screen ${
        collapsed ? "w-16" : "w-64"
      } bg-gray-800 text-white p-4 relative overflow-y-auto`} // Cambiado a overflow-y-auto
    >
      {/* Botón de colapso */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-4 text-white p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition z-10" // Añadido z-10
      >
        <FaBars />
      </button>

      {/* Lista de enlaces */}
      <ul className="mt-12">
        <li className="mb-4 group">
          <Link
            to="/admin"
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-4"
            } group-hover:bg-gray-700 rounded-md p-2 transition`}
          >
            <FaHome className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-md">Inicio</span>}
          </Link>
        </li>
        <li className="mb-4 group">
          <Link
            to="/admin/products"
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-4"
            } group-hover:bg-gray-700 rounded-md p-2 transition`}
          >
            <FaBoxes className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-md">Gestionar Productos</span>}
          </Link>
        </li>
        <li className="mb-4 group">
          <Link
            to="/usuarios"
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-4"
            } group-hover:bg-gray-700 rounded-md p-2 transition`}
          >
            <FaUsers className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-md">Usuarios</span>}
          </Link>
        </li>
        <li className="mb-4 group">
          <Link
            to="/admin/orders"
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-4"
            } group-hover:bg-gray-700 rounded-md p-2 transition`}
          >
            <FaShoppingCart className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-md">Gestionar Pedidos</span>}
          </Link>
        </li>
        <li className="mb-4 group">
          <Link
            to="/configuracion"
            className={`flex items-center ${
              collapsed ? "justify-center" : "space-x-4"
            } group-hover:bg-gray-700 rounded-md p-2 transition`}
          >
            <FaCog className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-md">Configuraciones</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}