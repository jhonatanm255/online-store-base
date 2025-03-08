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
  const clearCart = useCartStore((state) => state.clearCart); // Función para limpiar el carrito
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout");
      return;
    }

    setLoading(true);

    try {
      // Crear la sesión de pago con Stripe
      const response = await fetch(
        "https://forniture-backend.vercel.app/create-checkout-session",
        // "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            userId: user.uid,
          }),
        }
      );

      if (!response.ok) throw new Error("No se pudo iniciar el pago");

      const { id } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe no se ha cargado correctamente");

      // Redirigir al usuario a Stripe para completar el pago
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) throw error;

      // Redirigir al usuario a la página de éxito
      navigate("/success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error en el pago");
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