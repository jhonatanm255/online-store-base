import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from '../components/auth/AdminLoginForm';
import ClientLoginForm from '../components/auth/ClientLoginForm';
import { Store } from 'lucide-react';

export default function Login() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center">
            <Store className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">LuxeFurniture</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isAdminLogin ? 'Admin Login' : 'Customer Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isAdminLogin ? (
              <span>
                Not an admin?{' '}
                <button
                  onClick={() => setIsAdminLogin(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Switch to customer login
                </button>
              </span>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
                {/* {' or '}
                <button
                  onClick={() => setIsAdminLogin(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  login as admin
                </button> */}
              </>
            )}
          </p>
        </div>

        {isAdminLogin ? <AdminLoginForm /> : <ClientLoginForm />}
      </div>
    </div>
  );
}