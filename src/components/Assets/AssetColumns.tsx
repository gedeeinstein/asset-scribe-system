
import React from 'react';
import { Asset, users, divisions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Barcode, QrCode } from 'lucide-react';
import AssetIcon from './AssetIcon';
import AssetStatusBadge from './AssetStatusBadge';

interface AssetColumnsProps {
  showBarcode: (asset: Asset) => void;
}

export const getAssetColumns = ({ showBarcode }: AssetColumnsProps) => [
  { 
    key: 'name', 
    title: 'Asset Name',
    render: (row: Asset) => (
      <div className="flex items-center">
        <div className="mr-2 text-primary">
          <AssetIcon type={row.type} />
        </div>
        <span>{row.name}</span>
      </div>
    )
  },
  { key: 'type', title: 'Type' },
  { 
    key: 'status', 
    title: 'Status',
    render: (row: Asset) => <AssetStatusBadge status={row.status} />
  },
  { 
    key: 'assignedTo', 
    title: 'Assigned To',
    render: (row: Asset) => {
      if (!row.assignedTo) return <span className="text-muted-foreground">Unassigned</span>;
      const user = users.find(u => u.name === row.assignedTo);
      return user ? user.name : 'Unknown';
    }
  },
  { 
    key: 'division', 
    title: 'Division',
    render: (row: Asset) => {
      if (!row.division) return <span className="text-muted-foreground">Unassigned</span>;
      const division = divisions.find(d => d.name === row.division);
      return division ? division.name : 'Unknown';
    }
  },
  { 
    key: 'components', 
    title: 'Components',
    render: (row: Asset) => (
      <span>{row.components.length} components</span>
    )
  },
  { 
    key: 'actions',
    title: 'Code',
    render: (row: Asset) => (
      <Button 
        variant="ghost" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          showBarcode(row);
        }}
      >
        <div className="flex items-center">
          <Barcode className="h-4 w-4 mr-1" />
          <QrCode className="h-4 w-4" />
        </div>
      </Button>
    )
  }
];

export default getAssetColumns;
