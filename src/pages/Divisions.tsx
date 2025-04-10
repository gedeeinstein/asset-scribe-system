
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { divisions } from "../data/mockData";
import { Division } from "../types/models";

const Divisions = () => {
  const [divisionsList, setDivisionsList] = useState<Division[]>(divisions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateDivision = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const division: Division = {
      id: currentDivision?.id || `division-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      createdAt: currentDivision?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentDivision) {
      setDivisionsList(prev => prev.map(d => d.id === division.id ? division : d));
      toast({
        title: "Division Updated",
        description: "The division has been updated successfully",
      });
    } else {
      setDivisionsList(prev => [...prev, division]);
      toast({
        title: "Division Added",
        description: "The new division has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentDivision(null);
  };

  const handleDeleteDivision = (id: string) => {
    setDivisionsList(prev => prev.filter(division => division.id !== id));
    toast({
      title: "Division Deleted",
      description: "The division has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditDivision = (division: Division) => {
    setCurrentDivision(division);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateDivision} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Division Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={currentDivision?.name || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            rows={4}
            defaultValue={currentDivision?.description || ''}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentDivision(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentDivision ? 'Update Division' : 'Add Division'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Divisions</h1>
          <p className="text-muted-foreground">Manage company divisions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentDivision(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Division
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{currentDivision ? 'Edit Division' : 'Add New Division'}</DialogTitle>
              <DialogDescription>
                {currentDivision 
                  ? 'Update the division details below.' 
                  : 'Fill in the details for the new division.'}
              </DialogDescription>
            </DialogHeader>
            {renderAddEditForm()}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all company divisions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Division Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisionsList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No divisions found</TableCell>
            </TableRow>
          ) : (
            divisionsList.map((division) => (
              <TableRow key={division.id}>
                <TableCell className="font-medium">{division.name}</TableCell>
                <TableCell>{division.description || '-'}</TableCell>
                <TableCell>{formatDate(division.createdAt)}</TableCell>
                <TableCell>{formatDate(division.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditDivision(division)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteDivision(division.id)}
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

export default Divisions;
