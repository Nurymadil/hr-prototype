'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
  email: string;
  companyId: number;
  companyName?: string; // мы подгрузим имя компании отдельно
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setError(data.error);
          return;
        }


        try {
          const companyRes = await fetch('/api/companies');
          const companies = await companyRes.json();
          if (!Array.isArray(companies)) {
            setEmployees(data);
            return;
          }
          // Словарь companyId -> name
          const mapCompany: Record<number, string> = {};
          for (const c of companies) {
            mapCompany[c.id] = c.name;
          }

          const withCompanyName = data.map((emp: any) => ({
            ...emp,
            companyName: mapCompany[emp.companyId],
          }));
          setEmployees(withCompanyName);
        } catch {
          setEmployees(data);
        }
      })
      .catch((err) => setError(String(err)));
  }, []);

  // Удаление
  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Employees</h1>

      {error && (
        <p className="text-red-700 mb-2"><strong>Error:</strong> {error}</p>
      )}

      {employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Position</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-3 py-2">
                  {emp.position || 'No position'}
                </td>
                <td className="px-3 py-2">{emp.email}</td>
                <td className="px-3 py-2">
                  {emp.companyName ? (
                    <Link
                      href={`/admin/companies/${emp.companyId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {emp.companyName}
                    </Link>
                  ) : (
                    <span>Company {emp.companyId}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
