import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { useCartStore } from "../store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderDetails {
  success: boolean;
  orderId?: string;
  products?: { product: Product; quantity: number }[];
  message?: string;
}

const Success = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const clearCart = useCartStore((state) => state.clearCart);
  const isPaymentVerified = useRef(false); // Bandera para evitar múltiples llamadas

  useEffect(() => {
    const verifyPayment = async () => {
      console.log("Verificando pago para sessionId:", sessionId); // Log adicional
      if (isPaymentVerified.current) {
        console.log("Verificación ya completada. Retornando."); // Log adicional
        return;
      }

      try {
        if (!sessionId) {
          toast.error("No se pudo obtener el ID de la sesión.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          // `http://localhost:5000/api/verify-payment?session_id=${sessionId}`,
          `https://forniture-backend.vercel.app/api/verify-payment?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error(
            `Error en la solicitud: ${response.status} ${response.statusText}`
          );
        }

        const data: OrderDetails = await response.json();
        console.log("Respuesta del backend:", data); // Log adicional

        if (!data.success) {
          throw new Error(
            data.message || "El pago no se completó correctamente."
          );
        }

        setOrderDetails(data);
        toast.success("¡Pago completado con éxito! Gracias por tu compra.");

        await clearCart();
        isPaymentVerified.current = true; // Marca la verificación como completada
      } catch (error) {
        toast.error(
          `Hubo un problema al verificar el pago: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center lg:mt-[64px] p-4">
      <Check className="text-2xl text-green-600 w-36 h-36 p-8 bg-green-100 rounded-full flex justify-center mx-auto my-8" />
      <h1 className="text-2xl text-center font-bold mb-4 text-green-600">
        ¡Pago completado con éxito!
      </h1>
      <p className="text-md text-center mb-2 text-gray-700">
        Gracias por tu compra. Aquí están los detalles de tu pedido:
      </p>
      <div className="bg-green-100 p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-md font-semibold mb-2">Detalles del Pedido</h2>
        <p className="flex mb-1 text-gray-800 overflow-hidden">
          <strong className="mr-1">ID de Sesión: </strong>
          <span className="truncate">{sessionId}</span>
        </p>
        {orderDetails ? (
          <>
            <p className="mb-1 text-gray-800">
              <strong>Estado:</strong>{" "}
              {orderDetails.success ? "Pagado" : "No pagado"}
            </p>
            {orderDetails.orderId && (
              <p className="mb-1 text-gray-800">
                <strong>ID de la Orden:</strong> {orderDetails.orderId}
              </p>
            )}
            {orderDetails.products && orderDetails.products.length > 0 ? (
              <div>
                <strong>Productos:</strong>
                <ul className="list-disc pl-5">
                  {orderDetails.products.map((item) => (
                    <li key={item.product.id}>
                      {item.product.name} - {item.product.price} MXN (Cantidad:{" "}
                      {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No hay productos en este pedido.</p>
            )}
          </>
        ) : (
          <p className="mb-1">No se pudieron cargar los detalles del pedido.</p>
        )}
      </div>
      <Link
        to="/shop"
        className="mt-4 mb-12 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Seguir comprando
      </Link>
    </div>
  );
};

export default Success;