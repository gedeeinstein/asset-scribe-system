
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Printer, Download } from "lucide-react";

interface BarcodeDisplayProps {
  value: string;
  text?: string;
}

export const BarcodeDisplay = ({ value, text }: BarcodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate a barcode by drawing bars
  const renderBarcode = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Generate a pseudo-random pattern based on the value
    const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const barCount = 30;
    const barWidth = width / barCount;
    
    for (let i = 0; i < barCount; i++) {
      // Deterministic "random" based on value and position
      const shouldDraw = ((seed * (i + 1)) % 10) > 4;
      
      if (shouldDraw) {
        ctx.fillStyle = 'black';
        ctx.fillRect(i * barWidth, 0, barWidth, height * 0.8);
      }
    }
    
    // Add text below barcode
    if (text) {
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value, width / 2, height * 0.9);
    }
  };

  // Call renderBarcode when component mounts or value changes
  if (typeof window !== 'undefined') {
    setTimeout(() => renderBarcode(), 0);
  }

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${value}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
            .container { text-align: center; }
            img { max-width: 100%; }
            p { font-family: Arial, sans-serif; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${dataUrl}" alt="Barcode" />
            ${text ? `<p>${text}</p>` : ''}
          </div>
          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `barcode-${value}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={100} 
        className="border border-gray-200"
      />
      {text && <p className="text-sm text-center text-gray-600">{text}</p>}
      <div className="flex space-x-2">
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
};
