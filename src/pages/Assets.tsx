
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import DataTable from '@/components/DataTable';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { assets, users, divisions, categories, components, Asset } from '@/lib/data';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  Computer,
  Laptop,
  Printer,
  Monitor,
  Server,
  Network,
  HardDrive,
  PackagePlus,
  PackageMinus,
  X,
  Barcode,
  ScanBarcode,
  QrCode
} from "lucide-react";
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import BarcodeDisplay from '@/components/Barcode/BarcodeDisplay';
import BarcodeScanner from '@/components/Barcode/BarcodeScanner';

const Assets = () => {
  const [data, setData] = useState([...assets]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Asset>({
    id: '',
    name: '',
    type: '',
    category: '',
    status: 'Available',
    assignedTo: null,
    division: null,
    purchaseDate: '',
    warrantyExpires: null,
    lastMaintenance: null,
    components: [],
    notes: ''
  });
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [currentBarcode, setCurrentBarcode] = useState({ value: '', title: '' });
  const [scannerOpen, setScannerOpen] = useState(false);

  const statusOptions = ['Available', 'In Use', 'In Maintenance', 'Retired'];

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Desktop PC':
        return <Computer className="h-5 w-5" />;
      case 'Laptop':
        return <Laptop className="h-5 w-5" />;
      case 'Printer':
        return <Printer className="h-5 w-5" />;
      case 'Monitor':
        return <Monitor className="h-5 w-5" />;
      case 'Server':
        return <Server className="h-5 w-5" />;
      case 'Networking':
        return <Network className="h-5 w-5" />;
      default:
        return <HardDrive className="h-5 w-5" />;
    }
  };

  const columns = [
    { 
      key: 'name', 
      title: 'Asset Name',
      render: (row: Asset) => (
        <div className="flex items-center">
          <div className="mr-2 text-primary">
            {getAssetIcon(row.type)}
          </div>
          <span>{row.name}</span>
        </div>
      )
    },
    { key: 'type', title: 'Type' },
    { 
      key: 'status', 
      title: 'Status',
      render: (row: Asset) => {
        let statusColor = '';
        switch (row.status) {
          case 'Available':
            statusColor = 'bg-green-100 text-green-800';
            break;
          case 'In Use':
            statusColor = 'bg-blue-100 text-blue-800';
            break;
          case 'In Maintenance':
            statusColor = 'bg-amber-100 text-amber-800';
            break;
          case 'Retired':
            statusColor = 'bg-gray-100 text-gray-800';
            break;
        }
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {row.status}
          </span>
        );
      }
    },
    { 
      key: 'assignedTo', 
      title: 'Assigned To',
      render: (row: Asset) => {
        if (!row.assignedTo) return <span className="text-muted-foreground">Unassigned</span>;
        const user = users.find(u => u.name === row.assignedTo);
        return user ? user.name : 'Unknown';
      }
    },
    { 
      key: 'division', 
      title: 'Division',
      render: (row: Asset) => {
        if (!row.division) return <span className="text-muted-foreground">Unassigned</span>;
        const division = divisions.find(d => d.name === row.division);
        return division ? division.name : 'Unknown';
      }
    },
    { 
      key: 'components', 
      title: 'Components',
      render: (row: Asset) => (
        <span>{row.components.length} components</span>
      )
    },
    { 
      key: 'actions',
      title: 'Code',
      render: (row: Asset) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            showBarcode(row);
          }}
        >
          <div className="flex items-center">
            <Barcode className="h-4 w-4 mr-1" />
            <QrCode className="h-4 w-4" />
          </div>
        </Button>
      )
    }
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `a${Date.now()}`,
      name: '',
      type: '',
      category: '',
      status: 'Available',
      assignedTo: null,
      division: null,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpires: null,
      lastMaintenance: null,
      components: [],
      notes: ''
    });
    setSelectedComponents([]);
    setDialogOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditing(asset);
    setFormData({...asset});
    setSelectedComponents([...asset.components]);
    setDialogOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
      setData(data.filter(a => a.id !== asset.id));
      toast.success(`Asset ${asset.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedFormData = {
      ...formData,
      components: selectedComponents
    };
    
    if (editing) {
      setData(data.map(a => a.id === editing.id ? updatedFormData : a));
      toast.success(`Asset ${updatedFormData.name} updated successfully.`);
    } else {
      setData([...data, updatedFormData]);
      toast.success(`Asset ${updatedFormData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string | null | string[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      setSelectedComponents([...selectedComponents, componentId]);
    } else {
      setSelectedComponents(selectedComponents.filter(id => id !== componentId));
    }
  };

  const componentsByType = components.reduce((acc: Record<string, typeof components[0][]>, comp) => {
    if (!acc[comp.type]) {
      acc[comp.type] = [];
    }
    acc[comp.type].push(comp);
    return acc;
  }, {});

  const getSelectedComponentNames = () => {
    return selectedComponents.map(id => {
      const component = components.find(c => c.id === id);
      return component ? component.name : 'Unknown';
    });
  };

  const showBarcode = (asset: Asset) => {
    setCurrentBarcode({ 
      value: asset.id, 
      title: asset.name 
    });
    setBarcodeDialogOpen(true);
  };

  const handleScanBarcode = () => {
    setScannerOpen(true);
  };

  const handleScannedBarcode = (value: string) => {
    const asset = data.find(a => a.id === value);
    
    if (asset) {
      toast.success(`Asset Found: ${asset.name}`, {
        description: `Type: ${asset.type} | Status: ${asset.status}`
      });
      
      const index = data.findIndex(a => a.id === value);
      
      const tableRows = document.querySelectorAll('table tr');
      if (tableRows[index + 1]) {
        tableRows[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        tableRows[index + 1].classList.add('bg-primary/10');
        setTimeout(() => {
          tableRows[index + 1].classList.remove('bg-primary/10');
        }, 2000);
      }
    } else {
      toast.error('Asset not found', {
        description: 'No asset matches this barcode'
      });
    }
  };

  return (
    <MainLayout title="Assets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assets</h1>
            <p className="text-muted-foreground">Manage all IT hardware and software assets</p>
          </div>
          <Button variant="outline" onClick={handleScanBarcode}>
            <ScanBarcode className="h-4 w-4 mr-2" />
            Scan Code
          </Button>
        </div>
        
        <DataTable 
          title="Asset Inventory" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update asset details below.' : 'Enter the details for the new asset.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Asset Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleChange('category', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Asset Type</Label>
                      <Input 
                        id="type" 
                        value={formData.type} 
                        onChange={(e) => handleChange('type', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleChange('status', value as Asset['status'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                      <Select 
                        value={formData.assignedTo || "unassigned"} 
                        onValueChange={(value) => handleChange('assignedTo', value === "unassigned" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division (Optional)</Label>
                      <Select 
                        value={formData.division || "unassigned"} 
                        onValueChange={(value) => handleChange('division', value === "unassigned" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {divisions.map(division => (
                            <SelectItem key={division.id} value={division.name}>
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input 
                        id="purchaseDate" 
                        type="date" 
                        value={formData.purchaseDate}
                        onChange={(e) => handleChange('purchaseDate', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warrantyExpires">Warranty Expiration (Optional)</Label>
                      <Input 
                        id="warrantyExpires" 
                        type="date" 
                        value={formData.warrantyExpires || ''}
                        onChange={(e) => handleChange('warrantyExpires', e.target.value || null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastMaintenance">Last Maintenance (Optional)</Label>
                      <Input 
                        id="lastMaintenance" 
                        type="date" 
                        value={formData.lastMaintenance || ''}
                        onChange={(e) => handleChange('lastMaintenance', e.target.value || null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={formData.notes} 
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={5}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="components" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hardware Components</CardTitle>
                      <CardDescription>
                        Select the components that make up this asset
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          {selectedComponents.length > 0 ? (
                            <div className="bg-muted p-3 rounded-md space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Selected Components ({selectedComponents.length})</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedComponents([])}
                                >
                                  <X className="h-4 w-4 mr-1" /> Clear All
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getSelectedComponentNames().map((name, index) => (
                                  <div key={index} className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-muted p-3 rounded-md text-center text-muted-foreground">
                              No components selected
                            </div>
                          )}
                        </div>
                        
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(componentsByType).map(([type, comps]) => (
                            <AccordionItem key={type} value={type}>
                              <AccordionTrigger>
                                {type} Components ({comps.length})
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {comps.map(comp => (
                                    <div key={comp.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                                      <Checkbox
                                        id={comp.id}
                                        checked={selectedComponents.includes(comp.id)}
                                        onCheckedChange={(checked) => handleComponentToggle(comp.id, checked as boolean)}
                                      />
                                      <Label 
                                        htmlFor={comp.id} 
                                        className="flex-grow cursor-pointer"
                                      >
                                        <div className="font-medium">{comp.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {comp.manufacturer} {comp.model}
                                        </div>
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} Asset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <BarcodeDisplay 
          value={currentBarcode.value} 
          title={currentBarcode.title}
          open={barcodeDialogOpen}
          onOpenChange={setBarcodeDialogOpen}
        />

        <BarcodeScanner
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleScannedBarcode}
        />
      </div>
    </MainLayout>
  );
};

export default Assets;
