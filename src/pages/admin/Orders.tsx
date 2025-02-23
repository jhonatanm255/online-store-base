import Sidebar from "./Sidebar"; // Asegúrate de que la ruta sea correcta

export default function AdminOrders() {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> {/* Agregar Sidebar aquí */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
        <p className="text-gray-600">
          Order management functionality coming soon...
        </p>
      </div>
    </div>
  );
}
