
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Edit, Trash, Wrench, Barcode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { assets, categories, users } from "../data/mockData";
import { Asset } from "../types/models";
import { BarcodeDisplay } from "@/components/BarcodeDisplay";

const Assets = () => {
  const [assetsList, setAssetsList] = useState<Asset[]>(assets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [selectedAssetForBarcode, setSelectedAssetForBarcode] = useState<Asset | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateAsset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const asset: Asset = {
      id: currentAsset?.id || `asset-${Date.now()}`,
      name: formData.get('name') as string,
      assetTag: formData.get('assetTag') as string,
      categoryId: formData.get('categoryId') as string,
      assignedToId: formData.get('assignedToId') as string || undefined,
      status: formData.get('status') as Asset['status'],
      notes: formData.get('notes') as string || undefined,
      purchaseDate: formData.get('purchaseDate') as string || undefined,
      warrantyExpiration: formData.get('warrantyExpiration') as string || undefined,
      components: [],
      createdAt: currentAsset?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentAsset) {
      setAssetsList(prev => prev.map(a => a.id === asset.id ? asset : a));
      toast({
        title: "Asset Updated",
        description: "The asset has been updated successfully",
      });
    } else {
      setAssetsList(prev => [...prev, asset]);
      toast({
        title: "Asset Added",
        description: "The new asset has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    setAssetsList(prev => prev.filter(asset => asset.id !== id));
    toast({
      title: "Asset Deleted",
      description: "The asset has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditAsset = (asset: Asset) => {
    setCurrentAsset(asset);
    setIsDialogOpen(true);
  };

  const handleShowBarcode = (asset: Asset) => {
    setSelectedAssetForBarcode(asset);
    setIsBarcodeOpen(true);
  };

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      case 'retired':
        return <Badge variant="destructive">Retired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    return users.find(user => user.id === userId)?.name || 'Unknown';
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateAsset} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={currentAsset?.name || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assetTag">Asset Tag</Label>
          <Input 
            id="assetTag" 
            name="assetTag" 
            defaultValue={currentAsset?.assetTag || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={currentAsset?.categoryId || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedToId">Assigned To</Label>
          <Select name="assignedToId" defaultValue={currentAsset?.assignedToId || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={currentAsset?.status || 'active'}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input 
            id="purchaseDate" 
            name="purchaseDate" 
            type="date" 
            defaultValue={currentAsset?.purchaseDate ? new Date(currentAsset.purchaseDate).toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
          <Input 
            id="warrantyExpiration" 
            name="warrantyExpiration" 
            type="date" 
            defaultValue={currentAsset?.warrantyExpiration ? new Date(currentAsset.warrantyExpiration).toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input 
            id="notes" 
            name="notes" 
            defaultValue={currentAsset?.notes || ''}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentAsset(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentAsset ? 'Update Asset' : 'Add Asset'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">Manage IT hardware and software assets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentAsset(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription>
                {currentAsset 
                  ? 'Update the asset details below.' 
                  : 'Fill in the details for the new asset.'}
              </DialogDescription>
            </DialogHeader>
            {renderAddEditForm()}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all IT assets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Tag</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assetsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No assets found</TableCell>
            </TableRow>
          ) : (
            assetsList.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>{asset.assetTag}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{getCategoryName(asset.categoryId)}</TableCell>
                <TableCell>{getUserName(asset.assignedToId)}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShowBarcode(asset)}>
                        <Barcode className="mr-2 h-4 w-4" /> Barcode
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteAsset(asset.id)}
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

      <Dialog open={isBarcodeOpen} onOpenChange={setIsBarcodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asset Barcode</DialogTitle>
            <DialogDescription>
              {selectedAssetForBarcode?.name} - {selectedAssetForBarcode?.assetTag}
            </DialogDescription>
          </DialogHeader>
          {selectedAssetForBarcode && (
            <BarcodeDisplay 
              value={selectedAssetForBarcode.assetTag} 
              text={`${selectedAssetForBarcode.name} - ${selectedAssetForBarcode.assetTag}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
