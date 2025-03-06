import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { supabase } from "../lib/supabase";
import { ShoppingCart } from "lucide-react";
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
  imageUrl: string;
  is_featured: boolean;
  is_on_sale: boolean;
  sale_price: number | null;
  created_at: string;
  updated_at: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

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
          const productData = productSnapshot.data() as Omit<Product, "id">;
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

  // Manejar la adición al carrito (cantidad predeterminada = 1)
  const handleAddToCart = async () => {
    if (product) {
      await addItem(product, 1, () => navigate("/login"));
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
    <div className="max-w-7xl mx-auto mt-[64px] px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div>
          <img
            src={getImageUrl(product.imageUrl)}
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
              $
              {product.is_on_sale && product.sale_price
                ? product.sale_price
                : product.price}
            </span>
          </div>

          {/* Stock disponible */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Stock available: {product.stock}
            </p>
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