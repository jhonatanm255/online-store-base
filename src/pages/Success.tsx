import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore"; // Ajusta la ruta según tu estructura
import { Link } from "react-router-dom"; // Importar Link desde react-router-dom
import toast from "react-hot-toast";

const Success = () => {
  const location = useLocation();
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el session_id de la URL
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (!sessionId) {
      toast.error("No se pudo obtener el ID de la sesión.");
      setLoading(false);
      return;
    }

    // Verificar el estado del pago con el backend
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5173/api/verify-payment?session_id=${sessionId}`
        );

        if (!response.ok) throw new Error("No se pudo verificar el pago.");

        const data = await response.json();
        setOrderDetails(data); // Guardar los detalles del pedido
        clearCart(); // Limpiar el carrito
        toast.success("¡Pago completado con éxito! Gracias por tu compra.");
      } catch (error) {
        toast.error("Hubo un problema al verificar el pago.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, clearCart]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ¡Pago completado con éxito!
        </h1>
        {orderDetails ? (
          <div>
            <p className="text-gray-700 mb-6">
              Gracias por tu compra. Aquí están los detalles de tu pedido:
            </p>
            <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-gray-700 mb-6">
            No se pudieron cargar los detalles del pedido.
          </p>
        )}
        <Link
          to="/shop"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default Success;
