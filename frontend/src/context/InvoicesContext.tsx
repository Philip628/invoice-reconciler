'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ReconciledInvoice {
  contract_id: string;
  invoice_data: any; // Replace with actual invoice data type
}

interface InvoicesContextType {
  reconciledInvoices: Record<string, ReconciledInvoice[]>;
  addReconciledInvoice: (contractId: string, invoiceData: any) => void;
  purchaseOrders: File[];
  addPurchaseOrders: (files: File[]) => void;
  goodsReceipts: File[];
  addGoodsReceipts: (files: File[]) => void;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [reconciledInvoices, setReconciledInvoices] = useState<Record<string, ReconciledInvoice[]>>({});
  const [purchaseOrders, setPurchaseOrders] = useState<File[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<File[]>([]);

  const addReconciledInvoice = (contractId: string, invoiceData: any) => {
    setReconciledInvoices(prev => ({
      ...prev,
      [contractId]: [...(prev[contractId] || []), { contract_id: contractId, invoice_data: invoiceData }]
    }));
  };

  const addPurchaseOrders = (files: File[]) => {
    setPurchaseOrders(prev => [...prev, ...files]);
  };

  const addGoodsReceipts = (files: File[]) => {
    setGoodsReceipts(prev => [...prev, ...files]);
  };

  return (
    <InvoicesContext.Provider value={{
      reconciledInvoices,
      addReconciledInvoice,
      purchaseOrders,
      addPurchaseOrders,
      goodsReceipts,
      addGoodsReceipts
    }}>
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
} 
