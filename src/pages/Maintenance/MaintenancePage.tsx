
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { maintenanceRecords } from "../../data/mockData";
import { Maintenance, Asset } from "../../types/models";
import { useToast } from "@/hooks/use-toast";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceDialog from "./MaintenanceDialog";

const MaintenancePage = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(maintenanceRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<Maintenance | null>(null);
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateMaintenance = (formData: FormData) => {    
    const maintenance: Maintenance = {
      id: currentMaintenance?.id || `maintenance-${Date.now()}`,
      assetId: formData.get('assetId') as string,
      reportedById: formData.get('reportedById') as string,
      assignedToId: formData.get('assignedToId') as string || undefined,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as Maintenance['status'],
      priority: formData.get('priority') as Maintenance['priority'],
      dateReported: formData.get('dateReported') as string || new Date().toISOString(),
      dateCompleted: formData.get('status') === 'completed' ? new Date().toISOString() : undefined,
      solution: formData.get('solution') as string || undefined,
      cost: formData.get('cost') ? Number(formData.get('cost')) : undefined,
      createdAt: currentMaintenance?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentMaintenance) {
      setMaintenanceList(prev => prev.map(m => m.id === maintenance.id ? maintenance : m));
      toast({
        title: "Maintenance Updated",
        description: "The maintenance record has been updated successfully",
      });
    } else {
      setMaintenanceList(prev => [...prev, maintenance]);
      toast({
        title: "Maintenance Added",
        description: "The new maintenance record has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentMaintenance(null);
    setScannedAsset(null);
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenanceList(prev => prev.filter(maintenance => maintenance.id !== id));
    toast({
      title: "Maintenance Deleted",
      description: "The maintenance record has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setCurrentMaintenance(maintenance);
    setIsDialogOpen(true);
  };

  const handleCompleteMaintenance = (id: string) => {
    setMaintenanceList(prev => prev.map(maintenance => 
      maintenance.id === id 
        ? { 
            ...maintenance, 
            status: 'completed', 
            dateCompleted: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
          } 
        : maintenance
    ));
    toast({
      title: "Maintenance Completed",
      description: "The maintenance has been marked as completed",
    });
  };

  const handleScanResult = (code: string) => {
    const asset = assets.find(a => a.assetTag === code);
    
    if (asset) {
      setScannedAsset(asset);
      toast({
        title: "Asset Found",
        description: `Found: ${asset.name} (${asset.assetTag})`,
      });
    } else {
      toast({
        title: "Asset Not Found",
        description: `No asset found with tag: ${code}`,
        variant: "destructive"
      });
    }
    
    setIsScannerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage maintenance activities</p>
        </div>
        <MaintenanceDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          currentMaintenance={currentMaintenance}
          onSubmit={handleAddOrUpdateMaintenance}
          isScannerOpen={isScannerOpen}
          setIsScannerOpen={setIsScannerOpen}
          scannedAsset={scannedAsset}
          onScan={handleScanResult}
        />
      </div>

      <MaintenanceTable 
        maintenanceList={maintenanceList}
        onEdit={handleEditMaintenance}
        onComplete={handleCompleteMaintenance}
        onDelete={handleDeleteMaintenance}
      />
    </div>
  );
};

export default MaintenancePage;
