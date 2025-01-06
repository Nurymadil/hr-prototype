import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: {
    employeeId: string;
  };
}

// GET: Получить данные об одном сотруднике
export async function GET(_request: NextRequest, { params }: IParams) {
  try {
    const employeeId = Number(params.employeeId);

    if (!employeeId) {
      return NextResponse.json({ error: 'Invalid employeeId' }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Если по какой-то причине error не является Error
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// PUT: Обновить данные сотрудника
export async function PUT(request: Request, { params }: IParams) {
  try {
    const employeeId = Number(params.employeeId);
    if (!employeeId) {
      return NextResponse.json({ error: 'Invalid employeeId' }, { status: 400 });
    }

    const { firstName, lastName, position, email } = await request.json();
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { firstName, lastName, position, email },
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}

// DELETE: Удалить сотрудника
export async function DELETE(_request: Request, { params }: IParams) {
  try {
    const employeeId = Number(params.employeeId);
    if (!employeeId) {
      return NextResponse.json({ error: 'Invalid employeeId' }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id: employeeId },
    });

    // Можно вернуть пустое тело с 204
    return NextResponse.json(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
  }
}
