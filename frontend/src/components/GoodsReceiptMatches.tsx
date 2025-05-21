'use client';

import { useInvoices } from '@/context/InvoicesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GoodsReceiptMatches() {
  const { grnMatches } = useInvoices();

  if (grnMatches.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>GRN ↔ PO ↔ Invoice Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {grnMatches.map((m, idx) => (
            <li key={idx} className="border p-2 rounded">
              <div><strong>GRN:</strong> {m.grnName}</div>
              <div><strong>PO:</strong> {m.purchaseOrder || 'Not found'}</div>
              <div><strong>Invoice:</strong> {m.invoice || 'Not found'}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
