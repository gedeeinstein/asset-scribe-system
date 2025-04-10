
import React from 'react';
import Barcode from 'react-barcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Printer, Download } from 'lucide-react';

interface BarcodeDisplayProps {
  value: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeDisplay = ({ value, title, open, onOpenChange }: BarcodeDisplayProps) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode - ${title}</title>
            <style>
              body {
                font-family: sans-serif;
                text-align: center;
                padding: 20px;
              }
              .barcode-container {
                margin: 30px auto;
              }
              .asset-info {
                margin-bottom: 20px;
                font-size: 18px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="asset-info">${title}</div>
            <div class="barcode-container" id="barcode-container"></div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
              JsBarcode("#barcode-container", "${value}", {
                format: "CODE128",
                displayValue: true,
                fontSize: 18,
                margin: 10
              });
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    // Create a canvas element to render the barcode
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, 20);
      
      // Use JsBarcode to render to canvas
      // We need to use a temporary DOM element
      const tempImg = document.createElement('img');
      JsBarcode(tempImg, value, {
        format: "CODE128",
        displayValue: true,
        fontSize: 12,
        margin: 10
      });
      
      // When the image is loaded, draw it on our canvas
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 30);
        
        // Convert to data URL and trigger download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `barcode-${value}.png`;
        link.href = dataURL;
        link.click();
      };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title} - Barcode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <Barcode value={value} />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Scan this barcode to quickly identify this asset
          </p>
        </div>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Define JsBarcode as it's loaded from a CDN in the print window
declare global {
  interface Window {
    JsBarcode: any;
  }
}

export default BarcodeDisplay;
