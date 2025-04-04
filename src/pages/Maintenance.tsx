
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
import { maintenance, assets, users, Maintenance } from '@/lib/data';
import { toast } from 'sonner';
import { Barcode, ScanBarcode } from 'lucide-react';
import BarcodeScanner from '@/components/Barcode/BarcodeScanner';

const MaintenancePage = () => {
  const [data, setData] = useState([...maintenance]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<Maintenance>({
    id: '',
    assetId: '',
    assetName: '',
    type: 'Preventive',
    status: 'Scheduled',
    description: '',
    assignedTo: '',
    scheduledDate: '',
    completedDate: null,
    notes: ''
  });

  // Add scanner state
  const [scannerOpen, setScannerOpen] = useState(false);

  // Maintenance type and status options
  const typeOptions: Maintenance['type'][] = ['Preventive', 'Corrective', 'Calibration', 'Upgrade'];
  const statusOptions: Maintenance['status'][] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  const columns = [
    { 
      key: 'assetName', 
      title: 'Asset',
      render: (row: Maintenance) => {
        const asset = assets.find(a => a.id === row.assetId);
        return <span>{asset ? row.assetName : 'Unknown Asset'}</span>;
      }
    },
    { 
      key: 'type', 
      title: 'Type',
      render: (row: Maintenance) => (
        <span className="capitalize">{row.type}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (row: Maintenance) => {
        let statusColor = '';
        switch (row.status) {
          case 'Scheduled':
            statusColor = 'bg-blue-100 text-blue-800';
            break;
          case 'In Progress':
            statusColor = 'bg-amber-100 text-amber-800';
            break;
          case 'Completed':
            statusColor = 'bg-green-100 text-green-800';
            break;
          case 'Cancelled':
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
      key: 'description', 
      title: 'Description',
      render: (row: Maintenance) => (
        <span className="truncate max-w-xs block">{row.description}</span>
      )
    },
    { 
      key: 'assignedTo', 
      title: 'Assigned To',
      render: (row: Maintenance) => {
        const technician = users.find(u => u.name === row.assignedTo);
        return <span>{technician ? technician.name : 'Unassigned'}</span>;
      }
    },
    { 
      key: 'scheduledDate', 
      title: 'Scheduled Date',
      render: (row: Maintenance) => new Date(row.scheduledDate).toLocaleDateString()
    },
    { 
      key: 'completedDate', 
      title: 'Completed Date',
      render: (row: Maintenance) => row.completedDate 
        ? new Date(row.completedDate).toLocaleDateString() 
        : <span className="text-muted-foreground">Pending</span>
    }
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `m${Date.now()}`,
      assetId: '',
      assetName: '',
      type: 'Preventive',
      status: 'Scheduled',
      description: '',
      assignedTo: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditing(maintenance);
    setFormData({...maintenance});
    setDialogOpen(true);
  };

  const handleDelete = (maintenance: Maintenance) => {
    if (confirm(`Are you sure you want to delete this maintenance record?`)) {
      setData(data.filter(m => m.id !== maintenance.id));
      toast.success(`Maintenance record deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      setData(data.map(m => m.id === editing.id ? formData : m));
      toast.success(`Maintenance record updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`Maintenance record added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string | null) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // When asset is selected, update assetName
  const handleAssetChange = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setFormData({
        ...formData,
        assetId,
        assetName: asset.name
      });
    }
  };

  // Get IT staff (users with IT Admin or IT Support role)
  const itStaff = users.filter(user => 
    user.role === 'IT Admin' || user.role === 'IT Support'
  );

  // Handle barcode scan
  const handleScanBarcode = () => {
    setScannerOpen(true);
  };

  const handleScannedBarcode = (value: string) => {
    // Find the asset based on the scanned barcode or QR code (asset ID)
    const asset = assets.find(a => a.id === value);
    
    if (asset) {
      // Check if there are any maintenance records for this asset
      const assetMaintenance = data.filter(m => m.assetId === asset.id);
      
      if (assetMaintenance.length > 0) {
        toast.success(`Asset Found: ${asset.name}`, {
          description: `${assetMaintenance.length} maintenance record(s) found`
        });
        
        // Highlight maintenance records for this asset
        const tableRows = document.querySelectorAll('table tr');
        assetMaintenance.forEach(maintenance => {
          const index = data.findIndex(m => m.id === maintenance.id);
          if (tableRows[index + 1]) { // +1 for the header row
            tableRows[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
            tableRows[index + 1].classList.add('bg-primary/10');
            setTimeout(() => {
              tableRows[index + 1].classList.remove('bg-primary/10');
            }, 2000);
          }
        });
      } else {
        toast.info(`Asset Found: ${asset.name}`, {
          description: "No maintenance records found. Create one?"
        });
        
        // Pre-fill form for new maintenance record
        setFormData({
          id: `m${Date.now()}`,
          assetId: asset.id,
          assetName: asset.name,
          type: 'Preventive',
          status: 'Scheduled',
          description: '',
          assignedTo: '',
          scheduledDate: new Date().toISOString().split('T')[0],
          completedDate: null,
          notes: ''
        });
        setEditing(null);
        setDialogOpen(true);
      }
    } else {
      toast.error('Asset not found', {
        description: 'No asset matches this code'
      });
    }
  };

  return (
    <MainLayout title="Maintenance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Maintenance Records</h1>
            <p className="text-muted-foreground">Track and manage asset maintenance activities</p>
          </div>
          <Button variant="outline" onClick={handleScanBarcode}>
            <ScanBarcode className="h-4 w-4 mr-2" />
            Scan Asset Code
          </Button>
        </div>
        
        <DataTable 
          title="Maintenance Records" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update maintenance details below.' : 'Enter the details for the new maintenance record.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset</Label>
                <Select 
                  value={formData.assetId} 
                  onValueChange={handleAssetChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name} ({asset.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Maintenance Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleChange('type', value as Maintenance['type'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value as Maintenance['status'])}
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
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned Technician</Label>
                  <Select 
                    value={formData.assignedTo} 
                    onValueChange={(value) => handleChange('assignedTo', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {itStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input 
                    id="scheduledDate" 
                    type="date" 
                    value={formData.scheduledDate} 
                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completedDate">Completion Date (if completed)</Label>
                  <Input 
                    id="completedDate" 
                    type="date" 
                    value={formData.completedDate || ''}
                    onChange={(e) => handleChange('completedDate', e.target.value || null)}
                    disabled={formData.status !== 'Completed'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes} 
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Barcode Scanner Dialog */}
        <BarcodeScanner
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleScannedBarcode}
        />
      </div>
    </MainLayout>
  );
};

export default MaintenancePage;
