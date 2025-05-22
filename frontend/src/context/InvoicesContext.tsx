'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReconciledInvoice {
  contract_id: string;
  invoice_data: any; // Replace with actual invoice data type
  fileName?: string;
}

interface GoodsReceiptMatch {
  grnName: string;
  purchaseOrder?: string;
  invoice?: string;
}

interface InvoicesContextType {
  reconciledInvoices: Record<string, ReconciledInvoice[]>;
  invoices: ReconciledInvoice[];
  addReconciledInvoice: (contractId: string, invoiceData: any, fileName?: string) => void;
  purchaseOrders: File[];
  addPurchaseOrders: (files: File[]) => void;
  goodsReceipts: File[];
  addGoodsReceipts: (files: File[]) => void;
  grnMatches: GoodsReceiptMatch[];
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [reconciledInvoices, setReconciledInvoices] = useState<Record<string, ReconciledInvoice[]>>({});
  const [invoices, setInvoices] = useState<ReconciledInvoice[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<File[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<File[]>([]);
  const [grnMatches, setGrnMatches] = useState<GoodsReceiptMatch[]>([]);

  const extractId = (name: string) => {
    const match = name.match(/\d+/g);
    if (match) return match.join('');
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const computeMatches = (
    pos: File[],
    grns: File[],
    invs: ReconciledInvoice[]
  ) => {
    const results: GoodsReceiptMatch[] = grns.map((grn) => {
      const id = extractId(grn.name);
      const po = pos.find((p) => extractId(p.name) === id);
      const invoice = invs.find((i) =>
        i.fileName ? extractId(i.fileName) === id : extractId(i.invoice_data.friendlyName || '') === id
      );
      return {
        grnName: grn.name,
        purchaseOrder: po?.name,
        invoice: invoice?.fileName || invoice?.invoice_data?.friendlyName,
      };
    });
    setGrnMatches(results);
  };

  const addReconciledInvoice = (contractId: string, invoiceData: any, fileName?: string) => {
    setReconciledInvoices(prev => ({
      ...prev,
      [contractId]: [...(prev[contractId] || []), { contract_id: contractId, invoice_data: invoiceData, fileName }]
    }));

    setInvoices(prev => {
      const updated = [...prev, { contract_id: contractId, invoice_data: invoiceData, fileName }];
      computeMatches(purchaseOrders, goodsReceipts, updated);
      return updated;
    });
  };

  const addPurchaseOrders = (files: File[]) => {
    setPurchaseOrders(prev => {
      const updated = [...prev, ...files];
      computeMatches(updated, goodsReceipts, invoices);
      return updated;
    });
  };

  const addGoodsReceipts = (files: File[]) => {
    setGoodsReceipts(prev => {
      const updated = [...prev, ...files];
      computeMatches(purchaseOrders, updated, invoices);
      return updated;
    });
  };

  return (
    <InvoicesContext.Provider value={{
      reconciledInvoices,
      invoices,
      addReconciledInvoice,
      purchaseOrders,
      addPurchaseOrders,
      goodsReceipts,
      addGoodsReceipts,
      grnMatches
    }}>
      {children}
    </InvoicesContext.Provider>
  );
}


export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
}
