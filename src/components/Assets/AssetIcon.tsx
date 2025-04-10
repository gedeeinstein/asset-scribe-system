
import React from 'react';
import { Computer, Laptop, Printer, Monitor, Server, Network, HardDrive } from 'lucide-react';

interface AssetIconProps {
  type: string;
  className?: string;
}

const AssetIcon: React.FC<AssetIconProps> = ({ type, className = "h-5 w-5" }) => {
  switch (type) {
    case 'Desktop PC':
      return <Computer className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Printer':
      return <Printer className={className} />;
    case 'Monitor':
      return <Monitor className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Networking':
      return <Network className={className} />;
    default:
      return <HardDrive className={className} />;
  }
};

export default AssetIcon;
