
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
import { users, divisions, Division } from '@/lib/data';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

const Divisions = () => {
  const [data, setData] = useState([...divisions]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Division | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    location: '',
    manager: ''
  });

  const columns = [
    { key: 'name', title: 'Division Name' },
    { key: 'description', title: 'Description' },
    { key: 'location', title: 'Location' },
    { 
      key: 'manager', 
      title: 'Manager',
      render: (row: Division) => {
        const manager = users.find(u => u.name === row.manager);
        return <span>{manager ? manager.name : 'Unassigned'}</span>;
      }
    },
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `d${Date.now()}`,
      name: '',
      description: '',
      location: '',
      manager: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (division: Division) => {
    setEditing(division);
    setFormData({...division});
    setDialogOpen(true);
  };

  const handleDelete = (division: Division) => {
    if (confirm(`Are you sure you want to delete ${division.name}?`)) {
      setData(data.filter(d => d.id !== division.id));
      toast.success(`Division ${division.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      setData(data.map(d => d.id === editing.id ? formData : d));
      toast.success(`Division ${formData.name} updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`Division ${formData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Get managers (users with Manager or IT Admin role)
  const managers = users.filter(user => 
    user.role === 'Manager' || user.role === 'IT Admin'
  );

  return (
    <MainLayout title="Divisions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Divisions</h1>
            <p className="text-muted-foreground">Manage organization divisions and departments</p>
          </div>
        </div>
        
        <DataTable 
          title="Divisions" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Division' : 'Add New Division'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update division details below.' : 'Enter the details for the new division.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Division Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={(e) => handleChange('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Select 
                    value={formData.manager} 
                    onValueChange={(value) => handleChange('manager', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map(manager => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} Division
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Divisions;
