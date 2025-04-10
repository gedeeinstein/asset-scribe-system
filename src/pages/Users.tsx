
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
import { users, divisions } from "../data/mockData";
import { User } from "../types/models";

const Users = () => {
  const [usersList, setUsersList] = useState<User[]>(users);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAddOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const user: User = {
      id: currentUser?.id || `user-${Date.now()}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      divisionId: formData.get('divisionId') as string,
      role: (formData.get('role') as User['role']),
      phone: formData.get('phone') as string || undefined,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentUser) {
      setUsersList(prev => prev.map(u => u.id === user.id ? user : u));
      toast({
        title: "User Updated",
        description: "The user has been updated successfully",
      });
    } else {
      setUsersList(prev => [...prev, user]);
      toast({
        title: "User Added",
        description: "The new user has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = (id: string) => {
    setUsersList(prev => prev.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully",
      variant: "destructive"
    });
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'technician':
        return <Badge className="bg-blue-500">Technician</Badge>;
      case 'user':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getDivisionName = (divisionId: string) => {
    return divisions.find(div => div.id === divisionId)?.name || 'Unknown';
  };

  const renderAddEditForm = () => (
    <form onSubmit={handleAddOrUpdateUser} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={currentUser?.name || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            defaultValue={currentUser?.email || ''}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="divisionId">Division</Label>
          <Select name="divisionId" defaultValue={currentUser?.divisionId || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map(division => (
                <SelectItem key={division.id} value={division.id}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select name="role" defaultValue={currentUser?.role || 'user'}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            defaultValue={currentUser?.phone || ''}
          />
        </div>
      </div>
      <DialogFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => {
            setIsDialogOpen(false);
            setCurrentUser(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {currentUser ? 'Update User' : 'Add User'}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage users of IT assets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentUser(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {currentUser 
                  ? 'Update the user details below.' 
                  : 'Fill in the details for the new user.'}
              </DialogDescription>
            </DialogHeader>
            {renderAddEditForm()}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of all users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No users found</TableCell>
            </TableRow>
          ) : (
            usersList.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getDivisionName(user.divisionId)}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{user.phone || '-'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
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

export default Users;
