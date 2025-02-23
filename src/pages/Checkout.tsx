// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import Button from "../ui/Button"; // Asegúrate de que la ruta sea correcta
// import toast from "react-hot-toast";

// // Definir la estructura de un ítem del carrito
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// // Definir los props que recibe Checkout
// interface CheckoutProps {
//   cartItems: CartItem[];
// }

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Usa variable de entorno

// const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/create-checkout-session",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: cartItems }),
//         }
//       );

//       if (!response.ok) throw new Error("No se pudo iniciar el pago");

//       const { id } = await response.json();
//       const stripe = await stripePromise;

//       if (!stripe) {
//         throw new Error("Stripe no se ha cargado correctamente");
//       }

//       const { error } = await stripe.redirectToCheckout({ sessionId: id });

//       if (error) {
//         toast.error(error.message);
//       }
//     } catch (error) {
//       toast.error("Hubo un problema con el proceso de pago.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button className="w-full" disabled={loading} onClick={handleCheckout}>
//       {loading ? "Procesando..." : "Pagar con Stripe"}
//     </Button>
//   );
// };

// export default Checkout;








// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import Button from "../ui/Button"; // Asegúrate de que la ruta sea correcta
// import toast from "react-hot-toast";

// // Definir la estructura de un ítem del carrito
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// // Definir los props que recibe Checkout
// interface CheckoutProps {
//   cartItems: CartItem[];
// }

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Usa variable de entorno

// const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/create-checkout-session",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: cartItems }), // Envía los items del carrito
//         }
//       );

//       if (!response.ok) throw new Error("No se pudo iniciar el pago");

//       const { id } = await response.json();
//       const stripe = await stripePromise;

//       if (!stripe) {
//         throw new Error("Stripe no se ha cargado correctamente");
//       }

//       const { error } = await stripe.redirectToCheckout({ sessionId: id });

//       if (error) {
//         toast.error(error.message); // Muestra el error si existe
//       }
//     } catch (error) {
//       toast.error("Hubo un problema con el proceso de pago.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button className="w-full" disabled={loading} onClick={handleCheckout}>
//       {loading ? "Procesando..." : "Pagar con Stripe"}
//     </Button>
//   );
// };

// export default Checkout;






// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import Button from "../ui/Button"; // Asegúrate de que la ruta sea correcta
// import toast from "react-hot-toast";

// // Definir la estructura de un ítem del carrito
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// // Definir los props que recibe Checkout
// interface CheckoutProps {
//   cartItems: CartItem[];
// }

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Usa variable de entorno

// const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {
//   const [loading, setLoading] = useState(false);

//   const handleCheckout = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "http://localhost:5000/create-checkout-session",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: cartItems }), // Envía los items del carrito
//         }
//       );

//       if (!response.ok) throw new Error("No se pudo iniciar el pago");

//       const { id } = await response.json();
//       const stripe = await stripePromise;

//       if (!stripe) {
//         throw new Error("Stripe no se ha cargado correctamente");
//       }

//       const { error } = await stripe.redirectToCheckout({ sessionId: id });

//       if (error) {
//         if (error instanceof Error) {
//           toast.error(error.message); // Muestra el error si existe
//         } else {
//           toast.error("Hubo un problema con el proceso de pago.");
//         }
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Hubo un problema con el proceso de pago.");
//       }
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button className="w-full" disabled={loading} onClick={handleCheckout}>
//       {loading ? "Procesando..." : "Pagar con Stripe"}
//     </Button>
//   );
// };

// export default Checkout;







import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Button from "../ui/Button"; // Asegúrate de que la ruta sea correcta
import toast from "react-hot-toast";
import { useCartStore } from "../store/cartStore"; // Importa el store de Zustand
import { useNavigate } from "react-router-dom"; // Para redirigir al usuario

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Usa variable de entorno

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const cartItems = useCartStore((state) => state.items); // Obtén los items del carrito desde el store
  const clearCart = useCartStore((state) => state.clearCart); // Función para limpiar el carrito
  const navigate = useNavigate(); // Hook para redirigir al usuario

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Enviar los items del carrito al servidor para crear la sesión de pago
      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems }), // Envía los items del carrito
        }
      );

      if (!response.ok) throw new Error("No se pudo iniciar el pago");

      const { id } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe no se ha cargado correctamente");
      }

      // Redirigir al usuario al checkout de Stripe
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        throw error; // Si hay un error, se manejará en el bloque catch
      }

      // Si el pago es exitoso, redirigir a la vista de éxito
      clearCart(); // Limpiar el carrito
      navigate("/success"); // Redirigir a la vista de éxito
    } catch (error) {
      // Manejar errores
      if (error instanceof Error) {
        toast.error(error.message); // Muestra el error si existe
      } else {
        toast.error("Hubo un problema con el proceso de pago.");
      }
      navigate("/canceled"); // Redirigir a la vista de cancelado
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" disabled={loading} onClick={handleCheckout}>
      {loading ? "Procesando..." : "Pagar con Stripe"}
    </Button>
  );
};

export default Checkout;