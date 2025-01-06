// app/api/companies/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Список всех компаний
export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    return NextResponse.json(companies, { status: 200 });
  }catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Создание новой компании
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newCompany = await prisma.company.create({ data: { name } });
    return NextResponse.json(newCompany, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
