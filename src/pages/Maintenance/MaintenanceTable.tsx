
import { assets, users } from "../../data/mockData";
import { Maintenance } from "../../types/models";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash, CheckCircle } from "lucide-react";

interface MaintenanceTableProps {
  maintenanceList: Maintenance[];
  onEdit: (maintenance: Maintenance) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const MaintenanceTable = ({ 
  maintenanceList, 
  onEdit, 
  onComplete, 
  onDelete 
}: MaintenanceTableProps) => {
  const getStatusBadge = (status: Maintenance['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Maintenance['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getAssetName = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? `${asset.name} (${asset.assetTag})` : 'Unknown Asset';
  };

  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    return users.find(user => user.id === userId)?.name || 'Unknown User';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Table>
      <TableCaption>A list of all maintenance records.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Reported Date</TableHead>
          <TableHead>Reported By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenanceList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">No maintenance records found</TableCell>
          </TableRow>
        ) : (
          maintenanceList.map((maintenance) => (
            <TableRow key={maintenance.id}>
              <TableCell>{getAssetName(maintenance.assetId)}</TableCell>
              <TableCell>{maintenance.title}</TableCell>
              <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
              <TableCell>{getPriorityBadge(maintenance.priority)}</TableCell>
              <TableCell>{formatDate(maintenance.dateReported)}</TableCell>
              <TableCell>{getUserName(maintenance.reportedById)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(maintenance)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {maintenance.status !== 'completed' && (
                      <DropdownMenuItem onClick={() => onComplete(maintenance.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(maintenance.id)}
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
  );
};

export default MaintenanceTable;
