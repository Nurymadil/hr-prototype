// app/api/companies/[companyId]/route.ts
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface IParams {
  params: {
    companyId: string;
  };
}

// GET: Получить одну компанию с её сотрудниками
export async function GET(_request: NextRequest, { params }: IParams) {
  try {
    const companyId = Number(params.companyId);
    if (!companyId) {
      return NextResponse.json({ error: 'Invalid companyId' }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { employees: true },
    });
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: Обновить компанию
export async function PUT(request: Request, { params }: IParams) {
  try {
    const companyId = Number(params.companyId);
    const { name } = await request.json();

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { name },
    });

    return NextResponse.json(updated, { status: 200 });
  }catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Удалить компанию
export async function DELETE(_request: Request, { params }: IParams) {
  try {
    const companyId = Number(params.companyId);
    await prisma.company.delete({
      where: { id: companyId },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
