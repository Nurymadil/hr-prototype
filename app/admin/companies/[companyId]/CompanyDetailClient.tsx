'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Опциональные интерфейсы для данных. */
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
  email: string;
}

interface Company {
  id: number;
  name: string;
  employees: Employee[];
}

interface CompanyDetailClientProps {
  companyId: string;
}

export default function CompanyDetailClient({ companyId }: CompanyDetailClientProps) {
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/companies/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setCompany(data);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleSaveEmployee = async () => {
    setError('');
    if (!firstName || !lastName || !email) {
      setError('First name, last name, and email are required');
      return;
    }

    try {
      if (editingEmployeeId) {
        // PUT /api/employees/[employeeId]
        const res = await fetch(`/api/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, position, email }),
        });
        const updated = await res.json();
        if (res.ok) {
          setCompany((prev) =>
            prev
              ? {
                  ...prev,
                  employees: prev.employees.map((emp) =>
                    emp.id === editingEmployeeId ? updated : emp
                  ),
                }
              : prev
          );
          resetForm();
        } else {
          setError(updated.error || 'Failed to update employee');
        }
      } else {
        // POST /api/employees
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            position,
            email,
            companyId: Number(companyId),
          }),
        });
        const created = await res.json();
        if (res.ok) {
          setCompany((prev) =>
            prev
              ? { ...prev, employees: [...prev.employees, created] }
              : prev
          );
          resetForm();
        } else {
          setError(created.error || 'Failed to create employee');
        }
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDeleteEmployee = async (empId: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/employees/${empId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        setCompany((prev) =>
          prev
            ? {
                ...prev,
                employees: prev.employees.filter((e) => e.id !== empId),
              }
            : prev
        );
      } else {
        setError('Failed to delete employee');
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDeleteCompany = async () => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      const res = await fetch(`/api/companies/${companyId}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        router.push('/admin/companies'); // вернуться к списку компаний
      } else {
        setError('Failed to delete company');
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setPosition(emp.position || '');
    setEmail(emp.email);
  };

  const resetForm = () => {
    setEditingEmployeeId(null);
    setFirstName('');
    setLastName('');
    setPosition('');
    setEmail('');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  if (!company) {
    return <div className="p-4 text-red-700">{error || 'Company not found'}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Шапка компании и кнопка удаления */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company: {company.name}</h2>
        <button
          onClick={handleDeleteCompany}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete Company
        </button>
      </div>

      {error && <div className="text-red-700">Error: {error}</div>}

      {/* Список сотрудников */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Employees</h3>
        {company.employees.length === 0 ? (
          <p>No employees yet.</p>
        ) : (
          <ul className="space-y-2">
            {company.employees.map((emp) => (
              <li
                key={emp.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded"
              >
                <div>
                  <div className="font-medium">
                    {emp.firstName} {emp.lastName} — {emp.position || 'No position'}
                  </div>
                  <div className="text-sm text-gray-600">{emp.email}</div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditEmployee(emp)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Форма создания/редактирования сотрудника */}
      <div className="bg-white p-4 shadow rounded">
        <h4 className="text-lg font-semibold mb-2">
          {editingEmployeeId ? 'Edit Employee' : 'Add New Employee'}
        </h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveEmployee}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            {editingEmployeeId ? 'Save Changes' : 'Create Employee'}
          </button>
          {editingEmployeeId && (
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
