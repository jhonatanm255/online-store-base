import { db } from "../lib/firebase";
import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { supabase } from "../lib/supabase";

// Definir tipos para TypeScript
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

// Agregar un producto al carrito en Firestore
export const addToCart = async (userId: string, product: Product) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);
    let cartItems: Product[] = [];

    if (cartSnap.exists()) {
      cartItems = cartSnap.data().items || [];
    }

    // Buscar la imagen en Supabase
    const { data, error } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", product.id)
      .single();

    if (error) {
      console.error("Error fetching image from Supabase: ", error);
    }

    const imageUrl = data ? data.image_url : "";

    cartItems.push({ ...product, imageUrl });
    await setDoc(cartRef, { items: cartItems }, { merge: true });
  } catch (error) {
    console.error("Error adding to cart: ", error);
  }
};

// Obtener productos del carrito
export const getCartItems = async (userId: string): Promise<Product[]> => {
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    return cartSnap.exists() ? (cartSnap.data().items as Product[]) || [] : [];
  } catch (error) {
    console.error("Error fetching cart items: ", error);
    return [];
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (userId: string, productId: string) => {
  try {
    const cartRef = doc(db, "carts", userId);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) return;

    const cartItems = (cartSnap.data().items as Product[]).filter(
      (item) => item.id !== productId
    );
    await setDoc(cartRef, { items: cartItems }, { merge: true });
  } catch (error) {
    console.error("Error removing from cart: ", error);
  }
};

// Vaciar carrito después de la compra
export const clearCart = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "carts", userId));
  } catch (error) {
    console.error("Error clearing cart: ", error);
  }
};
