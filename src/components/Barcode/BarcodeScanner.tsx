
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanBarcode, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (value: string) => void;
}

const BarcodeScanner = ({ open, onOpenChange, onScan }: BarcodeScannerProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Load the barcode detection library
  useEffect(() => {
    if (open) {
      // Load ZXing library for barcode and QR code detection
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@zxing/library@0.19.1';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [open]);

  // Start the camera when the dialog opens
  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [open]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Start scanning after camera is ready
        videoRef.current.onloadedmetadata = () => {
          setScanning(true);
          scanBarcode();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access the camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setScanning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const scanBarcode = async () => {
    if (!scanning || !videoRef.current || !canvasRef.current || !window.ZXing) {
      animationRef.current = requestAnimationFrame(scanBarcode);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
        // Get image data for scanning
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        const hints = new Map();
        // Add support for both barcodes and QR codes
        const formats = [
          window.ZXing.BarcodeFormat.CODE_128, 
          window.ZXing.BarcodeFormat.QR_CODE,
          window.ZXing.BarcodeFormat.EAN_13
        ];
        hints.set(window.ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
        
        // Create ZXing reader
        const reader = new window.ZXing.MultiFormatReader();
        reader.setHints(hints);
        
        // Create bitmap from image data
        const luminanceSource = new window.ZXing.HTMLCanvasElementLuminanceSource(canvas);
        const binaryBitmap = new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(luminanceSource));
        
        // Try to decode the barcode
        const result = reader.decode(binaryBitmap);
        
        if (result && result.text) {
          // Code found!
          stopCamera();
          onScan(result.text);
          onOpenChange(false);
          
          const codeType = result.getBarcodeFormat() === window.ZXing.BarcodeFormat.QR_CODE ? 'QR code' : 'Barcode';
          toast.success(`${codeType} scanned successfully!`);
          return;
        }
      } catch (error) {
        // No code found, continue scanning
      }
    }
    
    // Continue scanning
    animationRef.current = requestAnimationFrame(scanBarcode);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) stopCamera();
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Barcode or QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <video 
            ref={videoRef} 
            className="w-full h-64 bg-black rounded-md object-cover"
            autoPlay 
            playsInline
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full hidden" 
          />
          <div className="absolute inset-0 border-2 border-dashed border-primary/50 rounded-md pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanBarcode className="h-12 w-12 text-primary/30" />
            </div>
          </div>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Position the barcode or QR code in the center of the camera frame
        </p>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => {
            stopCamera();
            onOpenChange(false);
          }}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Define ZXing types
declare global {
  interface Window {
    ZXing: any;
  }
}

export default BarcodeScanner;
