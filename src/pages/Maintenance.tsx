
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  CheckCircle, 
  Barcode 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { maintenanceRecords, assets, users } from "../data/mockData";
import { Maintenance, Asset } from "../types/models";
import { BarcodeScanner } from "@/components/BarcodeScanner";

const MaintenancePage = () => {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(maintenanceRecords);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<Maintenance | null>(null);
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
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
    // Find asset by asset tag
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

  const getStatusBadge = (status: Maintenance['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Maintenance['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getAssetName = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? `${asset.name} (${asset.assetTag})` : 'Unknown Asset';
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    return users.find(user => user.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateMaintenance} className="space-y-4">
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
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentMaintenance(null);
            setScannedAsset(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentMaintenance ? 'Update Maintenance' : 'Add Maintenance'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage maintenance activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentMaintenance(null);
              setScannedAsset(null);
            }}>
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
                onScan={handleScanResult} 
                onClose={() => setIsScannerOpen(false)} 
              />
            ) : (
              renderAddEditForm()
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all maintenance records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Reported Date</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenanceList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No maintenance records found</TableCell>
            </TableRow>
          ) : (
            maintenanceList.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>{getAssetName(maintenance.assetId)}</TableCell>
                <TableCell>{maintenance.title}</TableCell>
                <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                <TableCell>{getPriorityBadge(maintenance.priority)}</TableCell>
                <TableCell>{formatDate(maintenance.dateReported)}</TableCell>
                <TableCell>{getUserName(maintenance.reportedById)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMaintenance(maintenance)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {maintenance.status !== 'completed' && (
                        <DropdownMenuItem onClick={() => handleCompleteMaintenance(maintenance.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDeleteMaintenance(maintenance.id)}
                        className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenancePage;
