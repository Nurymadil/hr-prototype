// app/api/employees/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json(employees, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Создать нового сотрудника
export async function POST(request: Request) {
  try {
    const { firstName, lastName, position, email, companyId } = await request.json();
    if (!firstName || !lastName || !email || !companyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        position,
        email,
        companyId: Number(companyId),
      },
    });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
