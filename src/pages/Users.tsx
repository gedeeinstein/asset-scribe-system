
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { users, divisions, User } from '@/lib/data';
import { toast } from 'sonner';

const Users = () => {
  const [data, setData] = useState([...users]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    division: '',
    active: true
  });

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { 
      key: 'division', 
      title: 'Division',
      render: (row: User) => {
        const division = divisions.find(d => d.name === row.division);
        return <span>{division ? division.name : 'Unassigned'}</span>;
      }
    },
    { 
      key: 'active', 
      title: 'Status',
      render: (row: User) => (
        <span className={`px-2 py-1 text-xs rounded-full ${row.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `u${Date.now()}`,
      name: '',
      email: '',
      role: '',
      division: '',
      active: true
    });
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setFormData({...user});
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      setData(data.filter(u => u.id !== user.id));
      toast.success(`User ${user.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      setData(data.map(u => u.id === editing.id ? formData : u));
      toast.success(`User ${formData.name} updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`User ${formData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <MainLayout title="Users">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and access</p>
          </div>
        </div>
        
        <DataTable 
          title="User Accounts" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update user details below.' : 'Enter the details for the new user.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => handleChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Admin">IT Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="IT Support">IT Support</SelectItem>
                      <SelectItem value="End User">End User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Select 
                    value={formData.division} 
                    onValueChange={(value) => handleChange('division', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map(division => (
                        <SelectItem key={division.id} value={division.name}>
                          {division.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(value) => handleChange('active', value)} 
                />
                <Label htmlFor="active">Active Account</Label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Users;
