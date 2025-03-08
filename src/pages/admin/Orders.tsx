// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import {
//   collection,
//   onSnapshot,
//   getDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import Sidebar from "./Sidebar";
// import { FaUserCircle } from "react-icons/fa";
// import { supabase } from "../../lib/supabase";

// interface Product {
//   name: string;
//   price: number;
//   quantity: number;
//   image: string | null;
// }

// interface Order {
//   id: string;
//   createdAt: string;
//   customerName: string;
//   customerPhoto: string | null;
//   items: Product[];
//   total: string;
//   status: string;
// }

// export default function AdminOrders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const ordersCollection = collection(db, "orders");

//         const unsubscribe = onSnapshot(
//           ordersCollection,
//           async (ordersSnapshot) => {
//             const ordersList = await Promise.all(
//               ordersSnapshot.docs.map(async (orderDoc) => {
//                 const orderData = orderDoc.data();

//                 let customerName = "Cliente desconocido";
//                 let customerPhoto = null;

//                 if (orderData.userId) {
//                   const userRef = doc(db, "users", orderData.userId);
//                   const userSnap = await getDoc(userRef);
//                   if (userSnap.exists()) {
//                     const userData = userSnap.data();
//                     customerName = userData.name || "Cliente desconocido";
//                     customerPhoto = userData.photoURL || null;
//                   }
//                 }

//                 if (!Array.isArray(orderData.items)) {
//                   console.warn(
//                     `Orden ${orderDoc.id} no tiene productos válidos.`
//                   );
//                   return null;
//                 }

//                 const items: Product[] = await Promise.all(
//                   orderData.items.map(async (item) => {
//                     let productImage = item.product?.imageUrl || null;

//                     if (productImage) {
//                       const { data, error } = supabase.storage
//                         .from("products")
//                         .getPublicUrl(productImage);

//                       if (error) {
//                         console.error("Error al obtener la imagen:", error);
//                         productImage = null;
//                       } else {
//                         productImage = data.publicUrl;
//                       }
//                     }

//                     return {
//                       name: item.product?.name || "Producto sin nombre",
//                       price: item.product?.price || 0,
//                       quantity: item.quantity || 1,
//                       image: productImage,
//                     };
//                   })
//                 );

//                 const total = items.reduce(
//                   (acc, item) => acc + item.price * item.quantity,
//                   0
//                 );

//                 return {
//                   id: orderDoc.id,
//                   createdAt:
//                     orderData.createdAt?.toDate().toLocaleString() ||
//                     "Fecha no disponible",
//                   customerName,
//                   customerPhoto,
//                   items,
//                   total: total.toFixed(2),
//                   status: orderData.status || "Desconocido",
//                 };
//               })
//             );

//             // Ordenar las órdenes por fecha (de más reciente a más antigua)
//             ordersList.sort((a, b) => {
//               if (a && b) {
//                 return (
//                   new Date(b.createdAt).getTime() -
//                   new Date(a.createdAt).getTime()
//                 );
//               }
//               return 0;
//             });

//             setOrders(
//               ordersList.filter((order): order is Order => order !== null)
//             );
//           }
//         );

//         return () => unsubscribe();
//       } catch (error) {
//         console.error("Error al obtener órdenes:", error);
//         setError("No se pudieron cargar las órdenes.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const updateOrderStatus = async (orderId: string, newStatus: string) => {
//     try {
//       const orderRef = doc(db, "orders", orderId);
//       await updateDoc(orderRef, { status: newStatus });
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error al actualizar estado:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen mt-[64px]">
//       <Sidebar />
//       <div className="flex-1 p-8">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">
//           Administrar Órdenes
//         </h1>

//         <div className="overflow-x-auto rounded-lg shadow-lg">
//           <table className="min-w-full divide-y divide-gray-200 rounded-lg">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Orden
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Cliente
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Fecha
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Estado
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Total
//                 </th>
//                 <th
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Acciones
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex flex-col space-y-2">
//                       {order.items.map((item, index) => {
//                         const imageUrl = item.image
//                           ? supabase.storage
//                               .from("products")
//                               .getPublicUrl(item.image).data.publicUrl
//                           : null;

//                         return (
//                           <div
//                             key={index}
//                             className="flex items-center space-x-4"
//                           >
//                             {imageUrl && (
//                               <img
//                                 src={imageUrl}
//                                 alt={item.name}
//                                 className="w-10 h-10 rounded-md object-cover"
//                               />
//                             )}
//                             <div>
//                               <div className="text-sm font-medium text-gray-700">
//                                 {item.name}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 Cantidad: {item.quantity}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {order.customerPhoto ? (
//                         <img
//                           src={order.customerPhoto}
//                           alt={order.customerName}
//                           className="w-8 h-8 rounded-full"
//                         />
//                       ) : (
//                         <FaUserCircle className="w-8 h-8 text-gray-400" />
//                       )}
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.customerName}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">
//                       {order.createdAt}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-4 pb-0.5 inline-flex text-xs items-center justify-center leading-5 font-semibold rounded-full h-6 ${
//                         order.status === "paid"
//                           ? "bg-green-100 text-green-600"
//                           : order.status === "shipped"
//                           ? "bg-yellow-100 text-yellow-600"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     ${order.total}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     {order.status === "paid" && (
//                       <button
//                         className="text-xs text-indigo-600 hover:text-indigo-900"
//                         onClick={() => updateOrderStatus(order.id, "shipped")}
//                       >
//                         Marcar como Enviado
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }













import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Sidebar from "./Sidebar";
import { FaUserCircle } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhoto: string | null;
  items: Product[];
  total: string;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");

        const unsubscribe = onSnapshot(
          ordersCollection,
          async (ordersSnapshot) => {
            const ordersList = await Promise.all(
              ordersSnapshot.docs.map(async (orderDoc) => {
                const orderData = orderDoc.data();

                let customerName = "Cliente desconocido";
                let customerPhoto = null;

                if (orderData.userId) {
                  const userRef = doc(db, "users", orderData.userId);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userData = userSnap.data();
                    customerName = userData.name || "Cliente desconocido";
                    customerPhoto = userData.photoURL || null;
                  }
                }

                if (!Array.isArray(orderData.items)) {
                  console.warn(
                    `Orden ${orderDoc.id} no tiene productos válidos.`
                  );
                  return null;
                }

                const items: Product[] = await Promise.all(
                  orderData.items.map(async (item) => {
                    let productImage = item.product?.imageUrl || null;

                    if (productImage) {
                      const { data, error } = supabase.storage
                        .from("products")
                        .getPublicUrl(productImage);

                      if (error) {
                        console.error(
                          "Error al obtener la imagen:",
                          error.message
                        );
                        productImage = null;
                      } else {
                        productImage = data.publicUrl;
                      }
                    }

                    return {
                      name: item.product?.name || "Producto sin nombre",
                      price: item.product?.price || 0,
                      quantity: item.quantity || 1,
                      image: productImage,
                    };
                  })
                );

                const total = items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                );

                return {
                  id: orderDoc.id,
                  createdAt:
                    orderData.createdAt?.toDate().toLocaleString() ||
                    "Fecha no disponible",
                  customerName,
                  customerPhoto,
                  items,
                  total: total.toFixed(2),
                  status: orderData.status || "Desconocido",
                };
              })
            );

            ordersList.sort((a, b) => {
              if (a && b) {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              }
              return 0;
            });

            setOrders(
              ordersList.filter((order): order is Order => order !== null)
            );
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        setError("No se pudieron cargar las órdenes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen mt-[64px]">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Administrar Órdenes
        </h1>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Orden
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      {order.items.map((item, index) => {
                        const imageUrl = item.image; // URL correcta de la imagen

                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-10 h-10 rounded-md object-cover"
                              />
                            ) : (
                              <FaUserCircle className="w-10 h-10 text-gray-400" /> // ícono predeterminado
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-700">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Cantidad: {item.quantity}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {order.customerPhoto ? (
                        <img
                          src={order.customerPhoto}
                          alt={order.customerName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-4 pb-0.5 inline-flex text-xs items-center justify-center leading-5 font-semibold rounded-full h-6 ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : order.status === "shipped"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.status === "paid" && (
                      <button
                        className="text-xs text-indigo-600 hover:text-indigo-900"
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                      >
                        Marcar como Enviado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
