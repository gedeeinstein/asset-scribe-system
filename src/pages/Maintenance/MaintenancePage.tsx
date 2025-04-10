
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { assets } from "@/data/mockData";
import { Maintenance } from "@/types/models";
import MaintenanceTable from "./MaintenanceTable";
import MaintenanceForm, { MaintenanceFormValues } from "./MaintenanceForm";

// Mock data for maintenance records
const initialMaintenanceData: Maintenance[] = [
  {
    id: "m1",
    assetId: "a1",
    maintenanceType: "Repair",
    status: "Completed",
    priority: "High",
    assignedTo: "u1",
    scheduleDate: "2025-04-01",
    completionDate: "2025-04-05",
    description: "Replace faulty hard drive",
    notes: "Replaced with a 1TB SSD",
    createdAt: "2025-03-30",
    updatedAt: "2025-04-05"
  },
  {
    id: "m2",
    assetId: "a2",
    maintenanceType: "Preventive",
    status: "Scheduled",
    priority: "Medium",
    scheduleDate: "2025-04-15",
    description: "Routine system maintenance and cleaning",
    createdAt: "2025-04-02",
    updatedAt: "2025-04-02"
  },
  {
    id: "m3",
    assetId: "a3",
    maintenanceType: "Upgrade",
    status: "In Progress",
    priority: "Low",
    assignedTo: "u2",
    scheduleDate: "2025-04-10",
    description: "Upgrade RAM from 8GB to 16GB",
    createdAt: "2025-04-08",
    updatedAt: "2025-04-09"
  }
];

const MaintenancePage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>(initialMaintenanceData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Maintenance | undefined>(undefined);
  const [mode, setMode] = useState<"create" | "edit">("create");

  // Open dialog for creating a new record
  const handleCreate = () => {
    setCurrentRecord(undefined);
    setMode("create");
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing record
  const handleEdit = (record: Maintenance) => {
    setCurrentRecord(record);
    setMode("edit");
    setIsDialogOpen(true);
  };

  // Delete a maintenance record
  const handleDelete = (id: string) => {
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
  };

  // Handle form submission (create or edit)
  const handleFormSubmit = (values: MaintenanceFormValues) => {
    if (mode === "create") {
      // Create new record
      const newRecord: Maintenance = {
        id: `m${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMaintenanceRecords(prev => [...prev, newRecord]);
    } else if (mode === "edit" && currentRecord) {
      // Update existing record
      setMaintenanceRecords(prev => prev.map(record => 
        record.id === currentRecord.id 
          ? { 
              ...record, 
              ...values, 
              updatedAt: new Date().toISOString()
            } 
          : record
      ));
    }
    setIsDialogOpen(false);
  };

  // Close the form dialog
  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Records</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance for {assets.length} assets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <MaintenanceForm
              onSubmit={handleFormSubmit}
              initialValues={currentRecord}
              mode={mode}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      <MaintenanceTable
        maintenanceRecords={maintenanceRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MaintenancePage;
