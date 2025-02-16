import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Database } from '../types/supabase';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

type Product = Database['public']['Tables']['products']['Row'];

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
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: async (product, quantity = 1) => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) {
            // If no user is logged in, just update local state
            set((state) => {
              const existingItem = state.items.find(
                (item) => item.product.id === product.id
              );

              if (existingItem) {
                return {
                  items: state.items.map((item) =>
                    item.product.id === product.id
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
                  ),
                };
              }

              return {
                items: [...state.items, { product, quantity }],
              };
            });
            return;
          }

          // Update database
          const { error } = await supabase
            .from('cart_items')
            .upsert({
              user_id: user.id,
              product_id: product.id,
              quantity: quantity,
            }, {
              onConflict: 'user_id,product_id',
              ignoreDuplicates: false
            });

          if (error) throw error;

          // Update local state
          await get().syncWithDatabase();
        } catch (error: any) {
          toast.error('Failed to add item to cart');
          console.error('Error adding item to cart:', error);
        }
      },

      removeItem: async (productId) => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) {
            // If no user is logged in, just update local state
            set((state) => ({
              items: state.items.filter((item) => item.product.id !== productId),
            }));
            return;
          }

          // Remove from database
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) throw error;

          // Update local state
          await get().syncWithDatabase();
        } catch (error: any) {
          toast.error('Failed to remove item from cart');
          console.error('Error removing item from cart:', error);
        }
      },

      updateQuantity: async (productId, quantity) => {
        if (quantity < 1) return;
        
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) {
            // If no user is logged in, just update local state
            set((state) => ({
              items: state.items.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity }
                  : item
              ),
            }));
            return;
          }

          // Update database
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', productId);

          if (error) throw error;

          // Update local state
          await get().syncWithDatabase();
        } catch (error: any) {
          toast.error('Failed to update cart');
          console.error('Error updating cart:', error);
        }
      },

      clearCart: async () => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) {
            // If no user is logged in, just update local state
            set({ items: [] });
            return;
          }

          // Clear database
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

          if (error) throw error;

          // Update local state
          set({ items: [] });
        } catch (error: any) {
          toast.error('Failed to clear cart');
          console.error('Error clearing cart:', error);
        }
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.is_on_sale && item.product.sale_price
            ? item.product.sale_price
            : item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      syncWithDatabase: async () => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) return;

          // Get cart items from database
          const { data: cartItems, error } = await supabase
            .from('cart_items')
            .select(`
              quantity,
              products (*)
            `)
            .eq('user_id', user.id);

          if (error) throw error;

          // Update local state
          set({
            items: cartItems.map((item: any) => ({
              product: item.products,
              quantity: item.quantity,
            })),
          });
        } catch (error: any) {
          console.error('Error syncing with database:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Listen for auth state changes to sync cart
supabase.auth.onAuthStateChange(async (event) => {
  if (event === 'SIGNED_IN') {
    await useCartStore.getState().syncWithDatabase();
  }
});