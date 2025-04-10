
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableFooterProps {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  filteredDataLength: number;
  handlePageChange: (newPage: number) => void;
}

const TableFooter: React.FC<TableFooterProps> = ({
  page,
  totalPages,
  itemsPerPage,
  filteredDataLength,
  handlePageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="data-grid-footer">
      <div className="flex items-center space-x-6 text-sm">
        <span>
          Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredDataLength)} of {filteredDataLength} entries
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
  );
};

export default TableFooter;
