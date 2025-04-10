
import React from 'react';
import { Download, Upload, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from './SearchBar';

interface TableHeaderProps {
  title: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdd?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  title, 
  searchQuery, 
  setSearchQuery, 
  onAdd 
}) => {
  return (
    <div className="data-grid-header">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="search-filter">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
  );
};

export default TableHeader;
