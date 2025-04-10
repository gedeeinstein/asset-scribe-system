
import React from 'react';

interface AssetStatusBadgeProps {
  status: 'Available' | 'In Use' | 'In Maintenance' | 'Retired';
}

const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({ status }) => {
  let statusColor = '';
  switch (status) {
    case 'Available':
      statusColor = 'bg-green-100 text-green-800';
      break;
    case 'In Use':
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case 'In Maintenance':
      statusColor = 'bg-amber-100 text-amber-800';
      break;
    case 'Retired':
      statusColor = 'bg-gray-100 text-gray-800';
      break;
  }
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
      {status}
    </span>
  );
};

export default AssetStatusBadge;
