
import React, { useState } from 'react';
import Barcode from 'react-barcode';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Printer, Download, Barcode as BarcodeIcon, QrCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BarcodeDisplayProps {
  value: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BarcodeDisplay = ({ value, title, open, onOpenChange }: BarcodeDisplayProps) => {
  const [codeType, setCodeType] = useState<'barcode' | 'qrcode'>('barcode');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ${codeType === 'barcode' ? 'Barcode' : 'QR Code'} - ${title}</title>
            <style>
              body {
                font-family: sans-serif;
                text-align: center;
                padding: 20px;
              }
              .code-container {
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
            <div class="code-container" id="code-container"></div>
            ${codeType === 'barcode' 
              ? `<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                 <script>
                   JsBarcode("#code-container", "${value}", {
                     format: "CODE128",
                     displayValue: true,
                     fontSize: 18,
                     margin: 10
                   });
                   setTimeout(() => { window.print(); window.close(); }, 500);
                 </script>`
              : `<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
                 <script>
                   QRCode.toCanvas(document.getElementById("code-container"), "${value}", {
                     width: 200,
                     margin: 1
                   });
                   setTimeout(() => { window.print(); window.close(); }, 500);
                 </script>`
            }
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    // Create a canvas element to render the code
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
      
      if (codeType === 'barcode') {
        // Use JsBarcode to render to canvas
        // We need to use a temporary DOM element
        const tempImg = document.createElement('img');
        window.JsBarcode(tempImg, value, {
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
      } else {
        // Use QRCode for QR code
        const qrCanvas = document.createElement('canvas');
        window.QRCode.toCanvas(qrCanvas, value, { width: 120, margin: 0 });
        
        // Draw QR code to our main canvas
        ctx.drawImage(qrCanvas, canvas.width / 2 - 60, 30);
        
        // Convert to data URL and trigger download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode-${value}.png`;
        link.href = dataURL;
        link.click();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title} - Code</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="barcode" onValueChange={(value) => setCodeType(value as 'barcode' | 'qrcode')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="barcode">
              <BarcodeIcon className="h-4 w-4 mr-2" />
              Barcode
            </TabsTrigger>
            <TabsTrigger value="qrcode">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="barcode" className="flex flex-col items-center justify-center p-4">
            <Barcode value={value} />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Scan this barcode to quickly identify this asset
            </p>
          </TabsContent>
          
          <TabsContent value="qrcode" className="flex flex-col items-center justify-center p-4">
            <QRCode value={value} size={200} />
            <p className="text-center text-sm text-muted-foreground mt-2">
              Scan this QR code to quickly identify this asset
            </p>
          </TabsContent>
        </Tabs>
        
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

// Define global interfaces for libraries loaded from CDN
declare global {
  interface Window {
    JsBarcode: any;
    QRCode: any;
  }
}

export default BarcodeDisplay;
