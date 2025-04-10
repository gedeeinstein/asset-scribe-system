
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
import { Plus, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categories } from "../data/mockData";
import { Category } from "../types/models";

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const category: Category = {
      id: currentCategory?.id || `category-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      type: formData.get('type') as Category['type'],
      createdAt: currentCategory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentCategory) {
      setCategoriesList(prev => prev.map(c => c.id === category.id ? category : c));
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully",
      });
    } else {
      setCategoriesList(prev => [...prev, category]);
      toast({
        title: "Category Added",
        description: "The new category has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    setCategoriesList(prev => prev.filter(category => category.id !== id));
    toast({
      title: "Category Deleted",
      description: "The category has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const getTypeBadge = (type: Category['type']) => {
    switch (type) {
      case 'hardware':
        return <Badge className="bg-blue-500">Hardware</Badge>;
      case 'software':
        return <Badge className="bg-green-500">Software</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateCategory} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={currentCategory?.name || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={currentCategory?.type || 'hardware'}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="software">Software</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            rows={4}
            defaultValue={currentCategory?.description || ''}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentCategory(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentCategory ? 'Update Category' : 'Add Category'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage hardware and software categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentCategory(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{currentCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {currentCategory 
                  ? 'Update the category details below.' 
                  : 'Fill in the details for the new category.'}
              </DialogDescription>
            </DialogHeader>
            {renderAddEditForm()}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all asset categories.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No categories found</TableCell>
            </TableRow>
          ) : (
            categoriesList.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{getTypeBadge(category.type)}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCategory(category.id)}
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

export default Categories;
