import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { supabase } from "../lib/supabase";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

// Define el tipo de Producto basado en la estructura de Firebase
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
};

export default function Shop() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Función debounced para la búsqueda
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Obtener la URL de la imagen desde Supabase
  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage.from("products").getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Obtener productos desde Firebase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });

        let filteredProducts = productsData;
        if (category) {
          filteredProducts = productsData.filter(
            (product) =>
              product.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (searchQuery) {
          filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <Link
                to="/shop"
                className={`block px-4 py-2 rounded-md ${
                  !category ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                All Products
              </Link>
              {["Living-Room", "Bedroom", "Dining", "Office"].map((cat) => (
                <Link
                  key={cat}
                  to={`/shop/${cat}`}
                  className={`block px-4 py-2 rounded-md ${
                    category === cat
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat.replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-50 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`} // Redirige a ProductDetails
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-64">
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-indigo-600">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
