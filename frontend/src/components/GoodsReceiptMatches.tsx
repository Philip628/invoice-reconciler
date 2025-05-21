'use client';

import { useInvoices } from '@/context/InvoicesContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GoodsReceiptMatches() {
  const { goodsReceiptMatches } = useInvoices();

  if (goodsReceiptMatches.length === 0) return null;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Goods Receipt Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 px-3 border">GRN</th>
                <th className="p-2 px-3 border">Purchase Order</th>
                <th className="p-2 px-3 border">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {goodsReceiptMatches.map((m, idx) => (
                <tr key={idx} className="border">
                  <td className="p-2 px-3 border">{m.grn.name}</td>
                  <td className="p-2 px-3 border">{m.po ? m.po.name : '-'}</td>
                  <td className="p-2 px-3 border">
                    {m.invoice ? m.invoice.fileName || m.invoice.invoice_data?.friendlyName : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
