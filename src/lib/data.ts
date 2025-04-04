
// Sample mock data for the IT Inventory Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  active: boolean;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  location: string;
  manager: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentCategory?: string;
  active: boolean;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpires: string | null;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'Available' | 'In Use' | 'In Maintenance' | 'Retired';
  assignedTo: string | null;
  division: string | null;
  purchaseDate: string;
  warrantyExpires: string | null;
  lastMaintenance: string | null;
  components: string[];
  notes: string;
}

export interface Maintenance {
  id: string;
  assetId: string;
  assetName: string;
  type: 'Preventive' | 'Corrective' | 'Calibration' | 'Upgrade';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  description: string;
  assignedTo: string;
  scheduledDate: string;
  completedDate: string | null;
  notes: string;
}

// Sample Users
export const users: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', role: 'IT Admin', division: 'IT Department', active: true },
  { id: 'u2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Manager', division: 'Finance', active: true },
  { id: 'u3', name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'End User', division: 'Marketing', active: true },
  { id: 'u4', name: 'Alice Williams', email: 'alice.williams@example.com', role: 'IT Support', division: 'IT Department', active: true },
  { id: 'u5', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'End User', division: 'HR', active: false },
  { id: 'u6', name: 'Diana Prince', email: 'diana.prince@example.com', role: 'End User', division: 'Operations', active: true },
  { id: 'u7', name: 'Edward Norton', email: 'edward.norton@example.com', role: 'Manager', division: 'Sales', active: true },
  { id: 'u8', name: 'Fiona Apple', email: 'fiona.apple@example.com', role: 'End User', division: 'R&D', active: true },
];

// Sample Divisions
export const divisions: Division[] = [
  { id: 'd1', name: 'IT Department', description: 'Information Technology', location: 'Floor 1', manager: 'John Doe' },
  { id: 'd2', name: 'Finance', description: 'Financial Operations', location: 'Floor 2', manager: 'Jane Smith' },
  { id: 'd3', name: 'Marketing', description: 'Marketing and PR', location: 'Floor 2', manager: 'Bob Johnson' },
  { id: 'd4', name: 'HR', description: 'Human Resources', location: 'Floor 1', manager: 'Charlie Brown' },
  { id: 'd5', name: 'Operations', description: 'Operations Management', location: 'Floor 3', manager: 'Diana Prince' },
  { id: 'd6', name: 'Sales', description: 'Sales Department', location: 'Floor 3', manager: 'Edward Norton' },
  { id: 'd7', name: 'R&D', description: 'Research and Development', location: 'Floor 4', manager: 'Fiona Apple' },
];

// Sample Categories
export const categories: Category[] = [
  { id: 'c1', name: 'Desktop PC', description: 'Desktop computers', active: true },
  { id: 'c2', name: 'Laptop', description: 'Portable computers', active: true },
  { id: 'c3', name: 'Printer', description: 'Printing devices', active: true },
  { id: 'c4', name: 'Monitor', description: 'Display devices', active: true },
  { id: 'c5', name: 'Server', description: 'Server hardware', active: true },
  { id: 'c6', name: 'Networking', description: 'Network equipment', active: true },
  { id: 'c7', name: 'Peripherals', description: 'Computer peripherals', active: true },
  { id: 'c8', name: 'Software', description: 'Software licenses', active: true },
  { id: 'c9', name: 'Mobile Device', description: 'Smartphones and tablets', active: true },
  { id: 'c10', name: 'Other', description: 'Other hardware', active: true },
];

// Sample Components
export const components: Component[] = [
  { 
    id: 'comp1', 
    name: 'Intel Core i7-12700K', 
    type: 'CPU', 
    manufacturer: 'Intel', 
    model: 'Core i7-12700K', 
    serialNumber: 'INTELCPU001', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2026-01-15', 
    notes: '12th Gen, 12 Cores' 
  },
  { 
    id: 'comp2', 
    name: 'NVIDIA RTX 3080', 
    type: 'GPU', 
    manufacturer: 'NVIDIA', 
    model: 'GeForce RTX 3080', 
    serialNumber: 'NVGPU002', 
    purchaseDate: '2022-11-10', 
    warrantyExpires: '2025-11-10', 
    notes: '10GB GDDR6X' 
  },
  { 
    id: 'comp3', 
    name: 'Samsung 1TB SSD', 
    type: 'Storage', 
    manufacturer: 'Samsung', 
    model: '980 PRO', 
    serialNumber: 'SAMSSD003', 
    purchaseDate: '2023-02-20', 
    warrantyExpires: '2028-02-20', 
    notes: 'NVMe PCIe 4.0' 
  },
  { 
    id: 'comp4', 
    name: 'Corsair 32GB RAM', 
    type: 'Memory', 
    manufacturer: 'Corsair', 
    model: 'Vengeance RGB Pro', 
    serialNumber: 'CORSRAM004', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2028-01-15', 
    notes: '2x16GB DDR4 3600MHz' 
  },
  { 
    id: 'comp5', 
    name: 'ASUS ROG Motherboard', 
    type: 'Motherboard', 
    manufacturer: 'ASUS', 
    model: 'ROG Strix Z690-E', 
    serialNumber: 'ASUSMB005', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2026-01-15', 
    notes: 'ATX, LGA1700' 
  },
  { 
    id: 'comp6', 
    name: 'Corsair Power Supply', 
    type: 'PSU', 
    manufacturer: 'Corsair', 
    model: 'RM850x', 
    serialNumber: 'CORPSU006', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2028-01-15', 
    notes: '850W, 80+ Gold' 
  },
  { 
    id: 'comp7', 
    name: 'Logitech G Pro Keyboard', 
    type: 'Keyboard', 
    manufacturer: 'Logitech', 
    model: 'G Pro Mechanical', 
    serialNumber: 'LOGIKB007', 
    purchaseDate: '2023-03-05', 
    warrantyExpires: '2025-03-05', 
    notes: 'Tenkeyless, GX Blue Clicky' 
  },
  { 
    id: 'comp8', 
    name: 'Logitech G Pro X Mouse', 
    type: 'Mouse', 
    manufacturer: 'Logitech', 
    model: 'G Pro X Superlight', 
    serialNumber: 'LOGIMS008', 
    purchaseDate: '2023-03-05', 
    warrantyExpires: '2025-03-05', 
    notes: 'Wireless, 25K DPI' 
  },
  { 
    id: 'comp9', 
    name: 'Samsung 27" Monitor', 
    type: 'Monitor', 
    manufacturer: 'Samsung', 
    model: 'Odyssey G7', 
    serialNumber: 'SAMMON009', 
    purchaseDate: '2023-01-30', 
    warrantyExpires: '2026-01-30', 
    notes: '27", 1440p, 240Hz, Curved' 
  },
  { 
    id: 'comp10', 
    name: 'NZXT Case', 
    type: 'Case', 
    manufacturer: 'NZXT', 
    model: 'H510 Elite', 
    serialNumber: 'NZXTCASE010', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2025-01-15', 
    notes: 'Mid-Tower, Tempered Glass' 
  }
];

// Sample Assets
export const assets: Asset[] = [
  { 
    id: 'a1', 
    name: 'Marketing PC-01', 
    type: 'Desktop PC', 
    category: 'Desktop PC', 
    status: 'In Use', 
    assignedTo: 'Bob Johnson', 
    division: 'Marketing', 
    purchaseDate: '2023-01-15', 
    warrantyExpires: '2026-01-15', 
    lastMaintenance: '2023-06-15', 
    components: ['comp1', 'comp2', 'comp3', 'comp4', 'comp5', 'comp6', 'comp10'],
    notes: 'High-performance workstation for graphic design' 
  },
  { 
    id: 'a2', 
    name: 'Finance Laptop-03', 
    type: 'Laptop', 
    category: 'Laptop', 
    status: 'In Use', 
    assignedTo: 'Jane Smith', 
    division: 'Finance', 
    purchaseDate: '2022-11-10', 
    warrantyExpires: '2025-11-10', 
    lastMaintenance: '2023-05-20', 
    components: [],
    notes: 'Dell XPS 15, 32GB RAM, 1TB SSD' 
  },
  { 
    id: 'a3', 
    name: 'IT Monitor-05', 
    type: 'Monitor', 
    category: 'Monitor', 
    status: 'In Use', 
    assignedTo: 'John Doe', 
    division: 'IT Department', 
    purchaseDate: '2023-01-30', 
    warrantyExpires: '2026-01-30', 
    lastMaintenance: null, 
    components: ['comp9'],
    notes: '27" 4K Monitor' 
  },
  { 
    id: 'a4', 
    name: 'HR Printer-01', 
    type: 'Printer', 
    category: 'Printer', 
    status: 'In Maintenance', 
    assignedTo: 'Charlie Brown', 
    division: 'HR', 
    purchaseDate: '2021-06-15', 
    warrantyExpires: '2024-06-15', 
    lastMaintenance: '2023-07-01', 
    components: [],
    notes: 'HP LaserJet Pro, Network printer' 
  },
  { 
    id: 'a5', 
    name: 'Sales PC-04', 
    type: 'Desktop PC', 
    category: 'Desktop PC', 
    status: 'Available', 
    assignedTo: null, 
    division: null, 
    purchaseDate: '2023-02-20', 
    warrantyExpires: '2026-02-20', 
    lastMaintenance: null, 
    components: ['comp1', 'comp3', 'comp4', 'comp5', 'comp6', 'comp10'],
    notes: 'New PC, ready for deployment' 
  }
];

// Sample Maintenance Records
export const maintenance: Maintenance[] = [
  { 
    id: 'm1', 
    assetId: 'a1', 
    assetName: 'Marketing PC-01',
    type: 'Preventive', 
    status: 'Completed', 
    description: 'Regular system cleanup and updates', 
    assignedTo: 'John Doe', 
    scheduledDate: '2023-06-15', 
    completedDate: '2023-06-15', 
    notes: 'Updated drivers and cleaned dust' 
  },
  { 
    id: 'm2', 
    assetId: 'a2', 
    assetName: 'Finance Laptop-03',
    type: 'Preventive', 
    status: 'Completed', 
    description: 'Software updates and security patches', 
    assignedTo: 'Alice Williams', 
    scheduledDate: '2023-05-20', 
    completedDate: '2023-05-20', 
    notes: 'Applied security updates and optimized performance' 
  },
  { 
    id: 'm3', 
    assetId: 'a4', 
    assetName: 'HR Printer-01',
    type: 'Corrective', 
    status: 'In Progress', 
    description: 'Paper jam issues and calibration', 
    assignedTo: 'Alice Williams', 
    scheduledDate: '2023-07-01', 
    completedDate: null, 
    notes: 'Parts ordered for replacement' 
  },
  { 
    id: 'm4', 
    assetId: 'a1', 
    assetName: 'Marketing PC-01',
    type: 'Upgrade', 
    status: 'Scheduled', 
    description: 'RAM upgrade from 32GB to 64GB', 
    assignedTo: 'John Doe', 
    scheduledDate: '2023-08-15', 
    completedDate: null, 
    notes: 'New RAM modules have been ordered' 
  },
  { 
    id: 'm5', 
    assetId: 'a5', 
    assetName: 'Sales PC-04',
    type: 'Preventive', 
    status: 'Scheduled', 
    description: 'Initial setup and software installation', 
    assignedTo: 'Alice Williams', 
    scheduledDate: '2023-08-10', 
    completedDate: null, 
    notes: 'Prepare for deployment to Sales team' 
  }
];
