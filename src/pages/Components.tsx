
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
import { Plus, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { components, categories } from "../data/mockData";
import { Component } from "../types/models";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Components = () => {
  const [componentsList, setComponentsList] = useState<Component[]>(components);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [currentSpecs, setCurrentSpecs] = useState<{ key: string; value: string }[]>([]);
  const { toast } = useToast();

  const handleAddOrUpdateComponent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Convert specs array to record
    const specifications: Record<string, string> = {};
    currentSpecs.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specifications[spec.key] = spec.value;
      }
    });
    
    const component: Component = {
      id: currentComponent?.id || `component-${Date.now()}`,
      name: formData.get('name') as string,
      categoryId: formData.get('categoryId') as string,
      model: formData.get('model') as string || undefined,
      manufacturer: formData.get('manufacturer') as string || undefined,
      serialNumber: formData.get('serialNumber') as string || undefined,
      purchaseDate: formData.get('purchaseDate') as string || undefined,
      warrantyExpiration: formData.get('warrantyExpiration') as string || undefined,
      specifications,
      status: formData.get('status') as Component['status'],
      createdAt: currentComponent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentComponent) {
      setComponentsList(prev => prev.map(c => c.id === component.id ? component : c));
      toast({
        title: "Component Updated",
        description: "The component has been updated successfully",
      });
    } else {
      setComponentsList(prev => [...prev, component]);
      toast({
        title: "Component Added",
        description: "The new component has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentComponent(null);
    setCurrentSpecs([]);
  };

  const handleDeleteComponent = (id: string) => {
    setComponentsList(prev => prev.filter(component => component.id !== id));
    toast({
      title: "Component Deleted",
      description: "The component has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditComponent = (component: Component) => {
    setCurrentComponent(component);
    
    // Convert specifications record to array for editing
    const specs: { key: string; value: string }[] = [];
    if (component.specifications) {
      Object.entries(component.specifications).forEach(([key, value]) => {
        specs.push({ key, value });
      });
    }
    
    setCurrentSpecs(specs.length > 0 ? specs : [{ key: '', value: '' }]);
    setIsDialogOpen(true);
  };

  const handleAddSpec = () => {
    setCurrentSpecs([...currentSpecs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setCurrentSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    setCurrentSpecs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getStatusBadge = (status: Component['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'in-use':
        return <Badge className="bg-blue-500">In Use</Badge>;
      case 'defective':
        return <Badge variant="destructive">Defective</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateComponent} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Component Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={currentComponent?.name || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select name="categoryId" defaultValue={currentComponent?.categoryId || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c.type === 'hardware').map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input 
            id="model" 
            name="model" 
            defaultValue={currentComponent?.model || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input 
            id="manufacturer" 
            name="manufacturer" 
            defaultValue={currentComponent?.manufacturer || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input 
            id="serialNumber" 
            name="serialNumber" 
            defaultValue={currentComponent?.serialNumber || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={currentComponent?.status || 'available'}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="defective">Defective</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input 
            id="purchaseDate" 
            name="purchaseDate" 
            type="date" 
            defaultValue={currentComponent?.purchaseDate ? new Date(currentComponent.purchaseDate).toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyExpiration">Warranty Expiration</Label>
          <Input 
            id="warrantyExpiration" 
            name="warrantyExpiration" 
            type="date" 
            defaultValue={currentComponent?.warrantyExpiration ? new Date(currentComponent.warrantyExpiration).toISOString().split('T')[0] : ''}
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <Label>Specifications</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSpec}>
              Add Spec
            </Button>
          </div>
          {currentSpecs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input 
                placeholder="Key" 
                value={spec.key} 
                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
              />
              <Input 
                placeholder="Value" 
                value={spec.value} 
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveSpec(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentComponent(null);
            setCurrentSpecs([]);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentComponent ? 'Update Component' : 'Add Component'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Components</h1>
          <p className="text-muted-foreground">Manage hardware components</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setCurrentComponent(null);
              setCurrentSpecs([{ key: '', value: '' }]);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{currentComponent ? 'Edit Component' : 'Add New Component'}</DialogTitle>
              <DialogDescription>
                {currentComponent 
                  ? 'Update the component details below.' 
                  : 'Fill in the details for the new component.'}
              </DialogDescription>
            </DialogHeader>
            {renderAddEditForm()}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all hardware components.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {componentsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No components found</TableCell>
            </TableRow>
          ) : (
            componentsList.map((component) => (
              <TableRow key={component.id}>
                <TableCell className="font-medium">{component.name}</TableCell>
                <TableCell>{getCategoryName(component.categoryId)}</TableCell>
                <TableCell>{component.manufacturer || '-'}</TableCell>
                <TableCell>{component.model || '-'}</TableCell>
                <TableCell>{component.serialNumber || '-'}</TableCell>
                <TableCell>{getStatusBadge(component.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditComponent(component)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <Sheet>
                        <SheetTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Plus className="mr-2 h-4 w-4" /> Specifications
                          </DropdownMenuItem>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{component.name} Specifications</SheetTitle>
                            <SheetDescription>
                              Technical details for this component
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            <Card>
                              <CardContent className="pt-6">
                                <dl className="space-y-4">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                                    <dd>{component.manufacturer || 'Not specified'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                                    <dd>{component.model || 'Not specified'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                                    <dd>{component.serialNumber || 'Not specified'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                                    <dd>{formatDate(component.purchaseDate)}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">Warranty Expiration</dt>
                                    <dd>{formatDate(component.warrantyExpiration)}</dd>
                                  </div>
                                </dl>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="pt-6">
                                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                                {component.specifications && Object.keys(component.specifications).length > 0 ? (
                                  <dl className="space-y-2">
                                    {Object.entries(component.specifications).map(([key, value]) => (
                                      <div key={key} className="grid grid-cols-2">
                                        <dt className="text-sm font-medium text-gray-500">{key}</dt>
                                        <dd>{value}</dd>
                                      </div>
                                    ))}
                                  </dl>
                                ) : (
                                  <p className="text-muted-foreground">No specifications available</p>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComponent(component.id)}
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

export default Components;
