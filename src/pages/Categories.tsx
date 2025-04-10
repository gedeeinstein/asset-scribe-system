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
import { Switch } from '@/components/ui/switch';
import { categories, Category } from '@/lib/data';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

const Categories = () => {
  const [data, setData] = useState([...categories]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    description: string;
    parentCategory: string | '';
    active: boolean;
  }>({
    id: '',
    name: '',
    description: '',
    parentCategory: '',
    active: true
  });

  const columns = [
    { key: 'name', title: 'Category Name' },
    { key: 'description', title: 'Description' },
    { 
      key: 'parentCategory', 
      title: 'Parent Category',
      render: (row: Category) => {
        if (!row.parentCategory) return <span className="text-muted-foreground">None</span>;
        const parent = categories.find(c => c.id === row.parentCategory);
        return <span>{parent ? parent.name : 'Unknown'}</span>;
      }
    },
    { 
      key: 'active', 
      title: 'Status',
      render: (row: Category) => (
        <span className={`px-2 py-1 text-xs rounded-full ${row.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `c${Date.now()}`,
      name: '',
      description: '',
      parentCategory: '',
      active: true
    });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditing(category);
    setFormData({
      ...category,
      parentCategory: category.parentCategory || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    const isParent = data.some(c => c.parentCategory === category.id);
    if (isParent) {
      toast.error(`Cannot delete ${category.name} as it is a parent to other categories.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      setData(data.filter(c => c.id !== category.id));
      toast.success(`Category ${category.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      if (formData.parentCategory === editing.id) {
        toast.error("A category cannot be its own parent.");
        return;
      }
      
      setData(data.map(c => c.id === editing.id ? formData : c));
      toast.success(`Category ${formData.name} updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`Category ${formData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const parentCategories = editing 
    ? categories.filter(c => c.id !== editing.id) 
    : categories;

  return (
    <MainLayout title="Categories">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Asset Categories</h1>
            <p className="text-muted-foreground">Manage asset types and categories</p>
          </div>
        </div>
        
        <DataTable 
          title="Categories" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update category details below.' : 'Enter the details for the new category.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
                <Select 
                  value={formData.parentCategory} 
                  onValueChange={(value) => handleChange('parentCategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {parentCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={formData.active} 
                  onCheckedChange={(value) => handleChange('active', value)} 
                />
                <Label htmlFor="active">Active Category</Label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editing ? 'Update' : 'Add'} Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Categories;
