
import { assets, users } from "../../data/mockData";
import { Maintenance, Asset } from "../../types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Barcode, Plus } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import MaintenanceForm from "./MaintenanceForm";

interface MaintenanceDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentMaintenance: Maintenance | null;
  onSubmit: (formData: FormData) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  scannedAsset: Asset | null;
  onScan: (code: string) => void;
}

const MaintenanceDialog = ({
  isOpen,
  setIsOpen,
  currentMaintenance,
  onSubmit,
  isScannerOpen,
  setIsScannerOpen,
  scannedAsset,
  onScan
}: MaintenanceDialogProps) => {
  
  const handleAddOrUpdateMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{currentMaintenance ? 'Edit Maintenance' : 'Add New Maintenance'}</DialogTitle>
          <DialogDescription>
            {currentMaintenance 
              ? 'Update the maintenance record details below.' 
              : 'Fill in the details for the new maintenance record.'}
          </DialogDescription>
        </DialogHeader>
        {isScannerOpen ? (
          <BarcodeScanner 
            onScan={onScan} 
            onClose={() => setIsScannerOpen(false)} 
          />
        ) : (
          <MaintenanceForm
            handleSubmit={handleAddOrUpdateMaintenance}
            currentMaintenance={currentMaintenance}
            scannedAsset={scannedAsset}
            setIsScannerOpen={setIsScannerOpen}
            setIsDialogOpen={setIsOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
