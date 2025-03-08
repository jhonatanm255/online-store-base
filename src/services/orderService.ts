// src/services/orderService.ts
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveOrderToFirestore = async (
  userId: string,
  items: any[],
  total: number
) => {
  try {
    // Crear un nuevo documento en la colección 'orders'
    const orderRef = doc(db, "orders", `${userId}_${Date.now()}`);

    const orderData = {
      userId,
      items,
      total,
      createdAt: new Date(),
      status: "pending", // El estado inicial de la orden
    };

    await setDoc(orderRef, orderData);
    console.log("Orden guardada exitosamente en Firestore");
  } catch (error) {
    console.error("Error al guardar la orden en Firestore:", error);
  }
};
