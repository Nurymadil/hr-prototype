// app/layout.tsx
import '@/app/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'HR Prototype',
  description: 'A simple HR SaaS application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
