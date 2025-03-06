// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import Button from "../ui/Button";
// import toast from "react-hot-toast";
// import { useCartStore } from "../store/cartStore";
// import { useNavigate } from "react-router-dom";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// const Checkout = () => {
//   const [loading, setLoading] = useState(false);
//   const cartItems = useCartStore((state) => state.items);
//   const clearCart = useCartStore((state) => state.clearCart); // Función para limpiar el carrito
//   const navigate = useNavigate(); // Hook para redirigir al usuario

//   const handleCheckout = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://forniture-backend.vercel.app/create-checkout-session",
//         // "http://localhost:5000/create-checkout-session",
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

//       // Redirigir al usuario al checkout de Stripe
//       const { error } = await stripe.redirectToCheckout({ sessionId: id });

//       if (error) {
//         throw error;
//       }

//       // Si el pago es exitoso, redirigir a la vista de éxito
//       clearCart();
//       navigate("/success");
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Hubo un problema con el proceso de pago.");
//       }
//       navigate("/canceled");
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
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        // "https://forniture-backend.vercel.app/create-checkout-session",
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            userId: user.uid, // Pasar el userId
          }),
        }
      );

      if (!response.ok) throw new Error("No se pudo iniciar el pago");

      const { id } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe no se ha cargado correctamente");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        throw error;
      }

      clearCart();
      navigate("/success");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Hubo un problema con el proceso de pago.");
      }
      navigate("/canceled");
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