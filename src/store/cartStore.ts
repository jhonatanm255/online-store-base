import create from "zustand";
import { persist } from "zustand/middleware";
import { db, auth } from "../lib/firebase"; // Importa auth de firebase
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Asegúrate de importar onAuthStateChanged
import toast from "react-hot-toast";
import { Product } from "../types/supabase"; // Asegúrate de tener la interfaz de productos

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  getItemsCount: () => number;
  syncWithDatabase: () => Promise<void>;
  resetCart: () => void; // Nuevo método para resetear el carrito
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (product, quantity = 1) => {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Please log in to add items to your cart");
          return;
        }

        const uid = user.uid;
        const cartRef = doc(db, "carts", uid); // Referencia al documento del carrito

        try {
          // Verificar si el carrito ya existe
          const cartSnapshot = await getDoc(cartRef);
          if (!cartSnapshot.exists()) {
            // Si no existe, crear el carrito con el primer producto
            await setDoc(cartRef, {
              items: [{ product, quantity }],
            });
          } else {
            // Si existe, actualizar el carrito
            const existingItems = cartSnapshot.data()?.items || [];
            const existingItemIndex = existingItems.findIndex(
              (item: CartItem) => item.product.id === product.id
            );

            let updatedItems;
            if (existingItemIndex !== -1) {
              // Si el producto ya está en el carrito, actualizar la cantidad
              updatedItems = existingItems.map(
                (item: CartItem, index: number) =>
                  index === existingItemIndex
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
              );
            } else {
              // Si el producto no está en el carrito, agregarlo
              updatedItems = [...existingItems, { product, quantity }];
            }

            // Actualizar Firestore
            await updateDoc(cartRef, {
              items: updatedItems,
            });
          }

          // Actualizar el estado local
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (item) => item.product.id === product.id
            );
            if (existingItemIndex !== -1) {
              const updatedItems = [...state.items];
              updatedItems[existingItemIndex].quantity += quantity;
              return { items: updatedItems };
            } else {
              return { items: [...state.items, { product, quantity }] };
            }
          });

          toast.success("Item added to cart!");
        } catch (error) {
          toast.error("Failed to add item to cart");
          console.error(error);
        }
      },

      removeItem: async (productId) => {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Please log in to remove items from your cart");
          return;
        }

        const uid = user.uid;
        const cartRef = doc(db, "carts", uid);

        try {
          set((state) => ({
            items: state.items.filter((item) => item.product.id !== productId),
          }));

          // Actualizar Firestore después de eliminar el producto
          await updateDoc(cartRef, {
            items: get().items,
          });

          toast.success("Item removed from cart!");
        } catch (error) {
          toast.error("Failed to remove item from cart");
          console.error(error);
        }
      },

      updateQuantity: async (productId, quantity) => {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Please log in to update item quantity");
          return;
        }

        const uid = user.uid;
        const cartRef = doc(db, "carts", uid);

        try {
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          }));

          // Actualizar Firestore con la nueva cantidad
          await updateDoc(cartRef, {
            items: get().items,
          });

          toast.success("Quantity updated!");
        } catch (error) {
          toast.error("Failed to update cart quantity");
          console.error(error);
        }
      },

      clearCart: async () => {
        const user = auth.currentUser;
        if (!user) {
          toast.error("Please log in to clear your cart");
          return;
        }

        const uid = user.uid;
        const cartRef = doc(db, "carts", uid);

        try {
          set({ items: [] });

          // Eliminar el documento del carrito en Firestore
          await deleteDoc(cartRef);
          toast.success("Cart cleared!");
        } catch (error) {
          toast.error("Failed to clear cart");
          console.error(error);
        }
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price =
            item.product.is_on_sale && item.product.sale_price
              ? item.product.sale_price
              : item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      syncWithDatabase: async () => {
        const user = auth.currentUser;
        if (!user) return;

        const uid = user.uid;
        const cartRef = doc(db, "carts", uid);

        try {
          const cartSnapshot = await getDoc(cartRef);
          if (cartSnapshot.exists()) {
            set({ items: cartSnapshot.data()?.items || [] });
          } else {
            // Si el carrito no existe, crea uno vacío
            await setDoc(cartRef, { items: [] });
            set({ items: [] });
          }
        } catch (error) {
          console.error("Error syncing with Firestore:", error);
        }
      },

      resetCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage", // Nombre para la persistencia local
    }
  )
);

// Escuchar cambios en la autenticación para sincronizar el carrito
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await useCartStore.getState().syncWithDatabase();
  } else {
    // Limpiar el carrito si el usuario cierra sesión
    useCartStore.getState().resetCart();
  }
});