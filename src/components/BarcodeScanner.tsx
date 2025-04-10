
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // In a real app, we would connect to a barcode detection library
        // For this demo, we'll simulate detection after 3 seconds
        setTimeout(() => {
          // Simulate barcode detection
          const mockCode = `ASSET-${Math.floor(Math.random() * 10000)}`;
          handleScan(mockCode);
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Camera Access Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      });
      console.error("Error accessing camera:", error);
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  };

  const handleScan = (code: string) => {
    stopScanner();
    toast({
      title: "Barcode Detected",
      description: `Scanned: ${code}`,
    });
    onScan(code);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput("");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-red-500 rounded-lg"></div>
            </div>
            <Button 
              variant="secondary" 
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={stopScanner}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button onClick={startScanner} variant="outline">
            <Camera className="mr-2 h-4 w-4" /> Start Camera Scan
          </Button>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        or enter the code manually
      </div>
      
      <form onSubmit={handleManualSubmit} className="flex space-x-2">
        <Input
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Enter barcode manually"
        />
        <Button type="submit">Submit</Button>
      </form>
      
      {onClose && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClose}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
