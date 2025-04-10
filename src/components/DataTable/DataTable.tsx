
import React, { useState } from 'react';
import TableHeader from './TableHeader';
import TableContent from './TableContent';
import TableFooter from './TableFooter';

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
      <TableHeader 
        title={title} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onAdd={onAdd} 
      />
      
      <TableContent 
        columns={columns} 
        displayData={displayData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      <TableFooter 
        page={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredDataLength={filteredData.length}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default DataTable;
