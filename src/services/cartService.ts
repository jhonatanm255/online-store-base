import { supabase } from "../lib/supabase";

// Agregar un producto al carrito
export const addToCart = async (
  productId: string,
  quantity: number,
  userId: string
) => {
  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking cart:", error);
    return;
  }

  if (data) {
    // Si el producto ya está en el carrito, actualizar la cantidad
    const newQuantity = data.quantity + quantity;
    await updateCart(productId, newQuantity, userId);
  } else {
    // Si no existe, insertarlo
    const { error } = await supabase.from("cart").insert([
      {
        user_id: userId,
        product_id: productId,
        quantity,
      },
    ]);

    if (error) {
      console.error("Error adding to cart:", error);
    }
  }
};

// Actualizar la cantidad de un producto en el carrito
export const updateCart = async (
  productId: string,
  quantity: number,
  userId: string
) => {
  if (quantity <= 0) {
    return removeFromCart(productId, userId);
  }

  const { error } = await supabase
    .from("cart")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error updating cart:", error);
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (productId: string, userId: string) => {
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error removing from cart:", error);
  }
};
