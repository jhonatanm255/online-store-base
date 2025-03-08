// import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
// import { useCartStore } from "../store/cartStore";
// import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { supabase } from "../lib/supabase";
// import { loadStripe } from "@stripe/stripe-js";
// import toast from "react-hot-toast";

// export default function Cart() {
//   const { items, removeItem, updateQuantity, getTotal } = useCartStore();
//   const { user } = useAuth();

//   // Obtener la URL de la imagen desde Supabase
//   const getImageUrl = (imagePath: string) => {
//     const { data } = supabase.storage.from("products").getPublicUrl(imagePath);
//     return data.publicUrl;
//   };

//   const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

//   const handleCheckout = async () => {
//     if (!user) {
//       toast.error("Please log in to proceed with checkout");
//       return;
//     }

//     const cartItems = items.map((item) => ({
//       id: item.product.id,
//       name: item.product.name,
//       price: item.product.price,
//       quantity: item.quantity,
//       image: getImageUrl(item.product.image_url),
//     }));

//     try {
//       const response = await fetch(
//         // "https://forniture-backend.vercel.app/create-checkout-session",
//         "http://localhost:5000/create-checkout-session",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: cartItems, userId: user.uid }), // Pasar el userId
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
//         console.error("Error al procesar el pago:", error.message);
//       }
//     } catch (error) {
//       console.error("Error al procesar el pago:", error);
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto mt-[64px] px-4 sm:px-6 lg:px-8 py-16">
//         <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
//         <div className="flex flex-col items-center justify-center py-12">
//           <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
//           <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
//           <Link
//             to="/shop"
//             className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto mt-[65px] px-4 sm:px-6 lg:px-8 py-16">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="md:col-span-2">
//           {items.map((item) => (
//             <div
//               key={item.product.id}
//               className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow mb-4 w-full"
//             >
//               <img
//                 src={getImageUrl(item.product.imageUrl) || "/placeholder.jpg"}
//                 alt={item.product.name}
//                 className="w-96 h-96 lg:w-24 lg:h-24 object-cover rounded"
//               />

//               <div className="flex-1 text-center sm:text-left">
//                 <h3 className="text-lg font-semibold">{item.product.name}</h3>
//                 <p className="text-gray-600 text-sm mb-2">
//                   {item.product.description}
//                 </p>
//                 <div className="flex items-center justify-center sm:justify-start gap-2">
//                   {item.product.is_on_sale && item.product.sale_price ? (
//                     <>
//                       <span className="text-lg font-bold text-indigo-600">
//                         ${item.product.sale_price}
//                       </span>
//                       <span className="text-sm text-gray-500 line-through">
//                         ${item.product.price}
//                       </span>
//                     </>
//                   ) : (
//                     <span className="text-lg font-bold text-indigo-600">
//                       ${item.product.price}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 py-1 px-4 rounded-full bg-gray-100">
//                 <button
//                   onClick={() =>
//                     updateQuantity(item.product.id, item.quantity - 1)
//                   }
//                   className="p-1 rounded-full hover:bg-gray-100"
//                   disabled={item.quantity <= 1}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>
//                 <span className="w-8 text-center">{item.quantity}</span>
//                 <button
//                   onClick={() =>
//                     updateQuantity(item.product.id, item.quantity + 1)
//                   }
//                   className="p-1 rounded-full hover:bg-gray-200"
//                   disabled={item.quantity >= item.product.stock}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => removeItem(item.product.id)}
//                   className="p-2 text-red-600 hover:bg-red-200 rounded-full"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ORDER SUMMARY */}
//         <div className="bg-white p-6 rounded-lg shadow h-fit">
//           <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>${getTotal().toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>Free</span>
//             </div>
//             <div className="border-t pt-4">
//               <div className="flex justify-between font-bold">
//                 <span>Total</span>
//                 <span>${getTotal().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {user ? (
//             <button
//               onClick={handleCheckout}
//               className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
//             >
//               Proceed to Checkout
//             </button>
//           ) : (
//             <Link
//               to="/login"
//               className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
//             >
//               Login to Checkout
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }













import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user } = useAuth();

  // Obtener la URL de la imagen desde Supabase
  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage.from("products").getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout");
      return;
    }

    const cartItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: getImageUrl(item.product.image_url),
    }));

    // Validar que todos los productos tienen los datos necesarios
    const invalidItems = cartItems.filter(
      (item) =>
        !item.id ||
        !item.name ||
        !item.price ||
        item.quantity <= 0 ||
        !item.image
    );

    if (invalidItems.length > 0) {
      toast.error("Some products are missing necessary information");
      return;
    }

    try {
      const response = await fetch(
        "https://forniture-backend.vercel.app/create-checkout-session",
        // "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cartItems, userId: user.uid }),
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
        console.error("Error al procesar el pago:", error.message);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-[64px] px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link
            to="/shop"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-[65px] px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow mb-4 w-full"
            >
              <img
                src={getImageUrl(item.product.imageUrl) || "/placeholder.jpg"}
                alt={item.product.name}
                className="w-96 h-96 lg:w-24 lg:h-24 object-cover rounded"
              />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {item.product.description}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {item.product.is_on_sale && item.product.sale_price ? (
                    <>
                      <span className="text-lg font-bold text-indigo-600">
                        ${item.product.sale_price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-indigo-600">
                      ${item.product.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 px-4 rounded-full bg-gray-100">
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity - 1)
                  }
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product.id, item.quantity + 1)
                  }
                  className="p-1 rounded-full hover:bg-gray-200"
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-red-600 hover:bg-red-200 rounded-full"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {user ? (
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              to="/login"
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              Login to Checkout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
