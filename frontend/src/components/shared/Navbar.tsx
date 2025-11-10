'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user) return null;

  const canManageStock = user.role === Role.ADMIN || user.role === Role.STOREKEEPER;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/products" className="flex items-center px-2 text-xl font-bold text-primary-600">
              📦 Stock Management
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/products"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive('/products')
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                Products
              </Link>
              {canManageStock && (
                <>
                  <Link
                    href="/stock/in"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/stock/in')
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Stock In
                  </Link>
                  <Link
                    href="/stock/out"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/stock/out')
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Stock Out
                  </Link>
                  <Link
                    href="/stock/movements"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/stock/movements')
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    Movements
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-gray-700">{user.email}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}