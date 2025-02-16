import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { Link } from 'react-router-dom';
import { Search, Tag } from 'lucide-react';
import debounce from 'lodash/debounce';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categorySlug = searchParams.get('category');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      try {
        // If we have a category slug, first get the category ID
        let categoryId: string | null = null;
        if (categorySlug) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();
          
          if (categoryData) {
            categoryId = categoryData.id;
          }
        }

        // Fetch products with category filter if applicable
        let query = supabase
          .from('products')
          .select('*');
        
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: productsData } = await query.order('name');
        
        if (productsData) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <Link
                to="/shop"
                className={`block px-4 py-2 rounded-md ${
                  !categorySlug
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className={`block px-4 py-2 rounded-md ${
                    categorySlug === category.slug
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-gray-50 w-full pl-10 pr-4 py-2  border border-gray-300 rounded-md focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Products Grid */}
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
                    to={`/product/${product.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-64">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.is_on_sale && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            Sale
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            {product.is_on_sale && product.sale_price ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-indigo-600">
                                  ${product.sale_price}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.price}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-indigo-600">
                                ${product.price}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {product.stock} in stock
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