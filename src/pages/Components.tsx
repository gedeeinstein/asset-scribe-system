
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
import { useComponents } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

// Define the Component interface to match the database schema
interface ComponentType {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_expires: string | null;
  notes: string;
}

const Components = () => {
  const { data = [], refetch } = useComponents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ComponentType | null>(null);
  const [formData, setFormData] = useState<ComponentType>({
    id: '',
    name: '',
    type: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    purchase_date: new Date().toISOString().split('T')[0],
    warranty_expires: null,
    notes: ''
  });

  const columns = [
    { key: 'name', title: 'Component Name' },
    { key: 'type', title: 'Type' },
    { key: 'manufacturer', title: 'Manufacturer' },
    { key: 'model', title: 'Model' },
    { 
      key: 'serial_number', 
      title: 'Serial Number'
    },
    { 
      key: 'purchase_date', 
      title: 'Purchase Date',
      render: (row: ComponentType) => row.purchase_date ? new Date(row.purchase_date).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'warranty_expires', 
      title: 'Warranty Expires',
      render: (row: ComponentType) => row.warranty_expires ? new Date(row.warranty_expires).toLocaleDateString() : 'No warranty'
    }
  ];

  const componentTypes = [
    'CPU', 'GPU', 'RAM', 'Memory', 'Storage', 'Motherboard', 'PSU', 'Case', 
    'Monitor', 'Keyboard', 'Mouse', 'Cooling', 'Network Card', 'Sound Card', 'Other'
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: '',
      name: '',
      type: '',
      manufacturer: '',
      model: '',
      serial_number: '',
      purchase_date: new Date().toISOString().split('T')[0],
      warranty_expires: null,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (component: ComponentType) => {
    setEditing(component);
    setFormData({...component});
    setDialogOpen(true);
  };

  const handleDelete = async (component: ComponentType) => {
    if (confirm(`Are you sure you want to delete ${component.name}?`)) {
      const { error } = await supabase
        .from('it_assets_components')
        .delete()
        .eq('id', component.id);

      if (error) {
        toast.error('Failed to delete component');
        return;
      }

      refetch();
      toast.success(`Component ${component.name} deleted successfully.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      const { error } = await supabase
        .from('it_assets_components')
        .update(formData)
        .eq('id', editing.id);

      if (error) {
        toast.error('Failed to update component');
        return;
      }

      toast.success(`Component ${formData.name} updated successfully.`);
    } else {
      const { error } = await supabase
        .from('it_assets_components')
        .insert([formData]);

      if (error) {
        toast.error('Failed to add component');
        return;
      }

      toast.success(`Component ${formData.name} added successfully.`);
    }
    
    refetch();
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
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input 
                    id="serial_number" 
                    value={formData.serial_number} 
                    onChange={(e) => handleChange('serial_number', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input 
                    id="purchase_date" 
                    type="date" 
                    value={formData.purchase_date}
                    onChange={(e) => handleChange('purchase_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty_expires">Warranty Expiration (Optional)</Label>
                  <Input 
                    id="warranty_expires" 
                    type="date" 
                    value={formData.warranty_expires || ''}
                    onChange={(e) => handleChange('warranty_expires', e.target.value || null)}
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
