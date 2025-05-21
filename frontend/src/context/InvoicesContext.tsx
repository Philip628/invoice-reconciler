'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ReconciledInvoice {
  contract_id: string;
  invoice_data: any; // Replace with actual invoice data type
  fileName?: string;
}

interface GoodsReceiptMatch {
  grn: File;
  po?: File;
  invoice?: ReconciledInvoice;
}

interface InvoicesContextType {
  reconciledInvoices: Record<string, ReconciledInvoice[]>;
  addReconciledInvoice: (contractId: string, invoiceData: any, fileName?: string) => void;
  purchaseOrders: File[];
  addPurchaseOrders: (files: File[]) => void;
  goodsReceipts: File[];
  addGoodsReceipts: (files: File[]) => void;
  goodsReceiptMatches: GoodsReceiptMatch[];
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [reconciledInvoices, setReconciledInvoices] = useState<Record<string, ReconciledInvoice[]>>({});
  const [purchaseOrders, setPurchaseOrders] = useState<File[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<File[]>([]);
  const [goodsReceiptMatches, setGoodsReceiptMatches] = useState<GoodsReceiptMatch[]>([]);

  const addReconciledInvoice = (contractId: string, invoiceData: any, fileName?: string) => {
    setReconciledInvoices(prev => ({
      ...prev,
      [contractId]: [
        ...(prev[contractId] || []),
        { contract_id: contractId, invoice_data: invoiceData, fileName }
      ]
    }));
  };

  const addPurchaseOrders = (files: File[]) => {
    setPurchaseOrders(prev => [...prev, ...files]);
  };

  const addGoodsReceipts = (files: File[]) => {
    setGoodsReceipts(prev => [...prev, ...files]);
  };

  // simple filename matcher
  const normalize = (name: string) => name.replace(/\.[^/.]+$/, '').toLowerCase();

  // recompute matches whenever files or invoices change
  useEffect(() => {
    const invoices = Object.values(reconciledInvoices).flat();
    const newMatches: GoodsReceiptMatch[] = goodsReceipts.map(grn => {
      const base = normalize(grn.name);
      const po = purchaseOrders.find(po => normalize(po.name).includes(base) || base.includes(normalize(po.name)));
      const invoice = invoices.find(inv => {
        const invName = inv.fileName ? normalize(inv.fileName) : '';
        const friendly = inv.invoice_data?.friendlyName ? normalize(inv.invoice_data.friendlyName) : '';
        return invName.includes(base) || base.includes(invName) || friendly.includes(base);
      });
      return { grn, po, invoice };
    });
    setGoodsReceiptMatches(newMatches);
  }, [goodsReceipts, purchaseOrders, reconciledInvoices]);

  return (
    <InvoicesContext.Provider value={{
      reconciledInvoices,
      addReconciledInvoice,
      purchaseOrders,
      addPurchaseOrders,
      goodsReceipts,
      addGoodsReceipts,
      goodsReceiptMatches
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
