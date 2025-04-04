
import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  X,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Column {
  key: string;
  title: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  columns, 
  data,
  onAdd,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    return Object.values(item).some(
      value => 
        value !== null && 
        value !== undefined && 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="data-grid">
      <div className="data-grid-header">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="search-filter">
          <div className="relative w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" /> Import
            </Button>
            {onAdd && (
              <Button onClick={onAdd} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" /> Add New
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="data-grid-content">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.title}</th>
              ))}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                  No data found
                </td>
              </tr>
            ) : (
              displayData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  <td className="text-right">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="data-grid-footer">
          <div className="flex items-center space-x-6 text-sm">
            <span>
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - page) <= 1
                )
                .reduce((acc, pageNum, i, arr) => {
                  if (i > 0 && arr[i - 1] !== pageNum - 1) {
                    acc.push('...');
                  }
                  acc.push(pageNum);
                  return acc;
                }, [] as (number | string)[])
                .map((pageNum, i) => 
                  typeof pageNum === 'number' ? (
                    <Button
                      key={i}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  ) : (
                    <span key={i} className="px-2">
                      {pageNum}
                    </span>
                  )
                )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
