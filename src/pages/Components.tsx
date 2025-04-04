
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
import { components, Component } from '@/lib/data';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

const Components = () => {
  const [data, setData] = useState([...components]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Component | null>(null);
  const [formData, setFormData] = useState<Component>({
    id: '',
    name: '',
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyExpires: null,
    notes: ''
  });

  const columns = [
    { key: 'name', title: 'Component Name' },
    { key: 'type', title: 'Type' },
    { key: 'manufacturer', title: 'Manufacturer' },
    { key: 'model', title: 'Model' },
    { key: 'serialNumber', title: 'Serial Number' },
    { 
      key: 'purchaseDate', 
      title: 'Purchase Date',
      render: (row: Component) => new Date(row.purchaseDate).toLocaleDateString()
    },
    { 
      key: 'warrantyExpires', 
      title: 'Warranty Expires',
      render: (row: Component) => row.warrantyExpires ? new Date(row.warrantyExpires).toLocaleDateString() : 'No warranty'
    }
  ];

  const componentTypes = [
    'CPU', 'GPU', 'RAM', 'Memory', 'Storage', 'Motherboard', 'PSU', 'Case', 
    'Monitor', 'Keyboard', 'Mouse', 'Cooling', 'Network Card', 'Sound Card', 'Other'
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `comp${Date.now()}`,
      name: '',
      type: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpires: null,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (component: Component) => {
    setEditing(component);
    setFormData({...component});
    setDialogOpen(true);
  };

  const handleDelete = (component: Component) => {
    if (confirm(`Are you sure you want to delete ${component.name}?`)) {
      setData(data.filter(c => c.id !== component.id));
      toast.success(`Component ${component.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      setData(data.map(c => c.id === editing.id ? formData : c));
      toast.success(`Component ${formData.name} updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`Component ${formData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string | null) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <MainLayout title="Components">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hardware Components</h1>
            <p className="text-muted-foreground">Manage hardware components for PC builds</p>
          </div>
        </div>
        
        <DataTable 
          title="Components" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Component' : 'Add New Component'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update component details below.' : 'Enter the details for the new component.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleChange('type', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input 
                    id="manufacturer" 
                    value={formData.manufacturer} 
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input 
                    id="model" 
                    value={formData.model} 
                    onChange={(e) => handleChange('model', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input 
                    id="serialNumber" 
                    value={formData.serialNumber} 
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                  />
                </div>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={formData.notes} 
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} Component
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Components;
