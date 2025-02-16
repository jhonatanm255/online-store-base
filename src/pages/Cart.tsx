import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-4"
            >
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>
                <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

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
            <Link
              to="/checkout"
              className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>
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







// import { addToCart, updateCart, removeFromCart } from "../services/cartService";
// import { useCartStore } from "../store/cartStore";
// import { useAuth } from "../hooks/useAuth";
// import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function Cart() {
//   const { items, removeItem, updateQuantity, getTotal } = useCartStore();
//   const { user } = useAuth();

//   // Agregar un item al carrito y guardar en la base de datos
//   const handleAddToCart = async (productId: string, quantity: number) => {
//     if (user) {
//       await addToCart(productId, quantity, user.id); // Cambia `user.id` por la forma correcta de acceder al ID
//     }
//   };

//   // Actualizar la cantidad de un item en el carrito y reflejar en la base de datos
//   const handleUpdateQuantity = async (productId: string, quantity: number) => {
//     if (user) {
//       await updateCart(productId, quantity, user.id); // Cambia `user.id` por la forma correcta de acceder al ID
//     }
//   };

//   // Eliminar un item del carrito y reflejar en la base de datos
//   const handleRemoveItem = async (productId: string) => {
//     if (user) {
//       await removeFromCart(productId, user.id); // Cambia `user.id` por la forma correcta de acceder al ID
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//       <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="md:col-span-2">
//           {items.map((item) => (
//             <div
//               key={item.product.id}
//               className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-4"
//             >
//               <img
//                 src={item.product.image_url}
//                 alt={item.product.name}
//                 className="w-24 h-24 object-cover rounded"
//               />

//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold">{item.product.name}</h3>
//                 <p className="text-gray-600 text-sm mb-2">
//                   {item.product.description}
//                 </p>
//                 <div className="flex items-center gap-2">
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

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() =>
//                     handleUpdateQuantity(item.product.id, item.quantity - 1)
//                   }
//                   className="p-1 rounded-full hover:bg-gray-100"
//                   disabled={item.quantity <= 1}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </button>
//                 <span className="w-8 text-center">{item.quantity}</span>
//                 <button
//                   onClick={() =>
//                     handleUpdateQuantity(item.product.id, item.quantity + 1)
//                   }
//                   className="p-1 rounded-full hover:bg-gray-100"
//                   disabled={item.quantity >= item.product.stock}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </button>
//               </div>

//               <button
//                 onClick={() => handleRemoveItem(item.product.id)}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-full"
//               >
//                 <Trash2 className="h-5 w-5" />
//               </button>
//             </div>
//           ))}
//         </div>

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
//             <Link
//               to="/checkout"
//               className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
//             >
//               Proceed to Checkout
//             </Link>
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
