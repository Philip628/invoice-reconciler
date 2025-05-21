'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useInvoices } from '@/context/InvoicesContext';

export default function POUpload({ className }: { className?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState('');
  const { addPurchaseOrders, purchaseOrders } = useInvoices();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    addPurchaseOrders(files);
    setFiles([]);
    setSuccess('Purchase orders added');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Card className={cn("w-full max-w-3xl", className)}>
      <CardHeader>
        <CardTitle>Upload Purchase Orders</CardTitle>
        <CardDescription>Drag and drop or select PO files</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('poFileInput')?.click()}
          >
            <div className="space-y-1">
              <p>Drag and drop files here, or click to select</p>
              <p className="text-sm text-gray-500">Upload multiple PO files</p>
            </div>
            <input
              id="poFileInput"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Selected files:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="truncate max-w-[80%]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {purchaseOrders.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="font-medium">Uploaded POs:</p>
              <ul className="space-y-1 text-sm">
                {purchaseOrders.map((file, idx) => (
                  <li key={idx} className="bg-gray-100 p-2 rounded">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={files.length === 0}>
            Add Purchase Orders
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
