// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import {
//   collection,
//   onSnapshot,
//   updateDoc,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import Sidebar from "./Sidebar";
// import { FaUserCircle } from "react-icons/fa";

// // Definir interfaces
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

//                 // Verificar si `userInfo` está en el pedido
//                 if (orderData.userInfo) {
//                   customerName =
//                     orderData.userInfo.name || "Cliente desconocido";
//                   customerPhoto = orderData.userInfo.photoURL || null;
//                 }
//                 // Si no hay `userInfo`, buscar en `users`
//                 else if (orderData.userId) {
//                   const userRef = doc(db, "users", orderData.userId);
//                   const userSnap = await getDoc(userRef);
//                   if (userSnap.exists()) {
//                     const userData = userSnap.data();
//                     customerName = userData.name || "Cliente desconocido";
//                     customerPhoto = userData.photoURL || null;
//                   }
//                 }

//                 // Validar que `items` sea un array
//                 if (!Array.isArray(orderData.items)) {
//                   console.warn(
//                     `Orden ${orderDoc.id} no tiene productos válidos.`
//                   );
//                   return null;
//                 }

//                 // Ajustar la estructura de los productos
//                 const items: Product[] = orderData.items.map((item) => ({
//                   name: item.product?.name || "Producto sin nombre",
//                   price: item.product?.price || 0,
//                   quantity: item.quantity || 1,
//                   image: item.product?.image || null, // Agregar imagen del producto
//                 }));

//                 // Calcular el total correctamente
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

//             // Filtrar órdenes inválidas
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
//         Cargando órdenes...
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
//       <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <h1 className="text-3xl font-bold mb-8">Administrar Órdenes</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
//             >
//               <div className="flex items-center gap-4 mb-4">
//                 {order.customerPhoto ? (
//                   <img
//                     src={order.customerPhoto}
//                     alt={order.customerName}
//                     className="w-12 h-12 rounded-full"
//                   />
//                 ) : (
//                   <FaUserCircle className="w-12 h-12 text-gray-400" />
//                 )}
//                 <div>
//                   <p className="font-semibold">{order.customerName}</p>
//                   <p className="text-sm text-gray-500">{order.createdAt}</p>
//                 </div>
//               </div>
//               <div className="border-t pt-4">
//                 <h3 className="font-bold mb-2">Productos:</h3>
//                 {order.items.map((item, index) => (
//                   <div key={index} className="flex items-center gap-4 mb-2">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-12 h-12 object-cover rounded-md"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
//                         <span className="text-gray-500 text-xs">
//                           Sin imagen
//                         </span>
//                       </div>
//                     )}
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{item.name}</p>
//                       <p className="text-xs text-gray-500">
//                         Cantidad: {item.quantity} | Precio: $
//                         {item.price.toFixed(2)}
//                       </p>
//                     </div>
//                     <p className="font-medium">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex justify-between font-bold mt-4">
//                 <span>Total:</span>
//                 <span>${order.total}</span>
//               </div>
//               <p className="text-sm text-green-600 mt-2 py-1 px-4 rounded-full bg-green-100 w-36 text-center">
//                 Estado: {order.status}
//               </p>
//               {order.status === "paid" && (
//                 <button
//                   className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                   onClick={() => updateOrderStatus(order.id, "shipped")}
//                 >
//                   Marcar como Enviado
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import { FaUserCircle } from "react-icons/fa";

// Suponiendo que tienes un cliente de Supabase configurado en otro archivo
import { supabase } from "../../lib/supabase"; // Importa el cliente de Supabase

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

                // Obtener datos del cliente desde la colección "users"
                if (orderData.userId) {
                  const userRef = doc(db, "users", orderData.userId);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userData = userSnap.data();
                    customerName = userData.name || "Cliente desconocido";
                    customerPhoto = userData.photoURL || null;
                  }
                }

                // Validar que `items` sea un array
                if (!Array.isArray(orderData.items)) {
                  console.warn(
                    `Orden ${orderDoc.id} no tiene productos válidos.`
                  );
                  return null;
                }

                // Obtener imágenes reales de productos desde Supabase
                const items: Product[] = await Promise.all(
                  orderData.items.map(async (item) => {
                    let productImage = item.product?.imageUrl || null;

                    if (productImage) {
                      // Generar la URL completa de la imagen usando Supabase
                      const { publicURL, error } = supabase.storage
                        .from("products") // Asegúrate de que el nombre del bucket sea correcto
                        .getPublicUrl(productImage);

                      if (error) {
                        console.error("Error al obtener la imagen:", error);
                        productImage = null;
                      } else {
                        productImage = publicURL; // URL pública de la imagen
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

                // Calcular el total correctamente
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
        Cargando órdenes...
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
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">Administrar Órdenes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                {order.customerPhoto ? (
                  <img
                    src={order.customerPhoto}
                    alt={order.customerName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.createdAt}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Productos:</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          Sin imagen
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity} | Precio: ${" "}
                        {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold mt-4">
                <span>Total:</span>
                <span>${order.total}</span>
              </div>
              <p className="text-sm text-green-600 mt-2 py-1 px-4 rounded-full bg-green-100 w-36 text-center">
                Estado: {order.status}
              </p>
              {order.status === "paid" && (
                <button
                  className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => updateOrderStatus(order.id, "shipped")}
                >
                  Marcar como Enviado
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
