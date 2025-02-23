import Sidebar from "./Sidebar";
// import ProductForm from "./ProductForm";

export default function AdminDashboard() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <h1 className="flex h-screen justify-center items-start mx-auto mt-16 text-3xl font-semibold text-gray-700">Bienvenido al panel de administración</h1>
    </div>
  );
}
