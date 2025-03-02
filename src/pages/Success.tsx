import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderDetails {
  success: boolean;
  products?: Product[];
}

const Success = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `https://forniture-backend.vercel.app/api/verify-payment?session_id=${sessionId}`,
          // `http://localhost:5000/api/verify-payment?session_id=${sessionId}`
        );

        if (!response.ok) throw new Error("No se pudo verificar el pago.");

        const data = await response.json();
        setOrderDetails(data);
        toast.success("¡Pago completado con éxito! Gracias por tu compra.");
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

    if (sessionId) {
      verifyPayment();
    } else {
      toast.error("No se pudo obtener el ID de la sesión.");
      setLoading(false);
    }
  }, [sessionId]);

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
            {orderDetails.products && orderDetails.products.length > 0 ? (
              <div>
                <strong>Productos:</strong>
                <ul className="list-disc pl-5">
                  {orderDetails.products.map((product) => (
                    <li key={product.id}>
                      {product.name} - {product.price} MXN
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
