'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Company {
  id: number;
  name: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCompanies(data);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => setError(String(err)));
  }, []);

  const createCompany = async () => {
    setError('');
    if (!newCompanyName.trim()) {
      setError('Company name is required');
      return;
    }
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCompanyName }),
      });
      const result = await res.json();
      if (res.ok) {
        setCompanies((prev) => [...prev, result]);
        setNewCompanyName('');
      } else {
        setError(result.error || 'Failed to create company');
      }
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {error && (
        <p className="text-red-700 mb-2"><strong>Error:</strong> {error}</p>
      )}

      <div className="mb-6 bg-white p-4 rounded shadow max-w-sm">
        <label className="block mb-1 font-medium text-sm">New Company Name</label>
        <input
          type="text"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full mb-2"
        />
        <button
          onClick={createCompany}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className="bg-white p-4 rounded shadow flex flex-col">
            <h2 className="text-lg font-medium">{company.name}</h2>
            <Link
              href={`/admin/companies/${company.id}`}
              className="mt-4 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition self-start"
            >
              View Employees
            </Link>
          </div>
        ))}
      </div>

      {companies.length === 0 && <p className="mt-4 text-gray-600">No companies yet.</p>}
    </div>
  );
}
