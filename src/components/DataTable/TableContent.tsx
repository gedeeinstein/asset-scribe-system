
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@/components/ui/table';

interface Column {
  key: string;
  title: string;
  render?: (row: any) => React.ReactNode;
}

interface TableContentProps {
  columns: Column[];
  displayData: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const TableContent: React.FC<TableContentProps> = ({
  columns,
  displayData,
  onEdit,
  onDelete
}) => {
  return (
    <div className="data-grid-content">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.title}</TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            displayData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit && onEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete && onDelete(row)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableContent;
