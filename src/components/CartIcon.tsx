import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const itemsCount = useCartStore((state) => state.getItemsCount());

  return (
    <Link to="/cart" className="relative p-2 text-gray-900 hover:text-indigo-600">
      <ShoppingBag className="h-6 w-6 text-gray-700" />
      {itemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemsCount}
        </span>
      )}
    </Link>
  );
}