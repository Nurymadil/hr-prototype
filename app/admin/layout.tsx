// app/admin/layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white h-14 flex items-center px-8">
        <nav className="flex gap-6">
          <Link href="/admin/companies" className="hover:underline">
            Companies
          </Link>
          <Link href="/admin/employees" className="hover:underline">
            Employees
          </Link>
        </nav>
      </header>

      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>

      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        HR Prototype © 2025
      </footer>
    </div>
  );
}
