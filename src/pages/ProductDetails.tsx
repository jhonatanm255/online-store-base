import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../lib/supabase";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

// Define el tipo de Producto
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string; // Mantengo el nombre como en Firebase
  is_featured: boolean; // Cambiar a requerido
  is_on_sale: boolean; // Cambiar a requerido
  sale_price: number | null; // Cambiar a requerido
  created_at: string; // Cambiar a requerido
  updated_at: string; // Cambiar a requerido
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Obtener la URL de la imagen desde Supabase
  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage.from("products").getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Obtener el producto desde Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const productRef = doc(db, "products", id);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
          const productData = productSnapshot.data() as Omit<Product, "id">; // Excluye el id
          setProduct({ id: productSnapshot.id, ...productData });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Manejar la adición al carrito
  const handleAddToCart = () => {
    if (product) {
      const itemToAdd: Product = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image_url: product.image_url,
        is_featured: product.is_featured || false, // Proporciona un valor por defecto
        is_on_sale: product.is_on_sale || false, // Proporciona un valor por defecto
        sale_price: product.sale_price || null, // Proporciona un valor por defecto
        created_at: product.created_at || new Date().toISOString(), // Proporciona un valor por defecto
        updated_at: product.updated_at || new Date().toISOString(), // Proporciona un valor por defecto
      };
      addItem(itemToAdd, quantity);
      toast.success("Added to cart!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div>
          <img
            src={getImageUrl(product.imageUrl)} // Usa la función para obtener la URL de la imagen
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />
        </div>

        {/* Detalles del producto */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Precio */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-indigo-600">
              ${product.price}
            </span>
          </div>

          {/* Stock disponible */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Stock available: {product.stock}
            </p>
          </div>

          {/* Selector de cantidad */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="p-2 hover:bg-gray-100"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Botón para añadir al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
