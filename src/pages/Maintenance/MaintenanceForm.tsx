
import { Maintenance, Asset } from "../../types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Barcode } from "lucide-react";
import { assets, users } from "../../data/mockData";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MaintenanceFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentMaintenance: Maintenance | null;
  scannedAsset: Asset | null;
  setIsScannerOpen: (open: boolean) => void;
  setIsDialogOpen: (open: boolean) => void;
}

const MaintenanceForm = ({ 
  handleSubmit, 
  currentMaintenance, 
  scannedAsset, 
  setIsScannerOpen,
  setIsDialogOpen
}: MaintenanceFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assetId">Asset</Label>
          <div className="flex gap-2">
            <Select 
              name="assetId" 
              defaultValue={scannedAsset?.id || currentMaintenance?.assetId || ''}
              required
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.assetTag})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsScannerOpen(true)}
            >
              <Barcode className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reportedById">Reported By</Label>
          <Select 
            name="reportedById" 
            defaultValue={currentMaintenance?.reportedById || users[0]?.id || ''}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedToId">Assigned To</Label>
          <Select 
            name="assignedToId" 
            defaultValue={currentMaintenance?.assignedToId || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {users.filter(u => u.role === 'technician').map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateReported">Date Reported</Label>
          <Input 
            id="dateReported" 
            name="dateReported" 
            type="date" 
            defaultValue={
              currentMaintenance?.dateReported 
                ? new Date(currentMaintenance.dateReported).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0]
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            name="status" 
            defaultValue={currentMaintenance?.status || 'pending'}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            name="priority" 
            defaultValue={currentMaintenance?.priority || 'medium'}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            name="title" 
            defaultValue={currentMaintenance?.title || ''}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            rows={3}
            defaultValue={currentMaintenance?.description || ''}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="solution">Solution</Label>
          <Textarea 
            id="solution" 
            name="solution" 
            rows={3}
            defaultValue={currentMaintenance?.solution || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($)</Label>
          <Input 
            id="cost" 
            name="cost" 
            type="number" 
            step="0.01"
            defaultValue={currentMaintenance?.cost?.toString() || ''}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentMaintenance ? 'Update Maintenance' : 'Add Maintenance'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MaintenanceForm;
