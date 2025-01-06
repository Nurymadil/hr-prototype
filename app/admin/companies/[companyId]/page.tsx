// app/admin/companies/[companyId]/page.tsx
import React from 'react';
import CompanyDetailClient from './CompanyDetailClient';

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  return (
    <CompanyDetailClient companyId={companyId} />
  );
}
