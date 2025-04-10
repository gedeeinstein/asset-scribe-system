
import { 
  User, 
  Division, 
  Category, 
  Component, 
  Asset, 
  Maintenance 
} from "../types/models";

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    divisionId: "division-1",
    role: "admin",
    phone: "555-1234",
    createdAt: "2024-01-01T12:00:00Z",
    updatedAt: "2024-01-01T12:00:00Z"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    divisionId: "division-2",
    role: "user",
    phone: "555-5678",
    createdAt: "2024-01-02T12:00:00Z",
    updatedAt: "2024-01-02T12:00:00Z"
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    divisionId: "division-3",
    role: "technician",
    phone: "555-9012",
    createdAt: "2024-01-03T12:00:00Z",
    updatedAt: "2024-01-03T12:00:00Z"
  }
];

// Mock Divisions
export const divisions: Division[] = [
  {
    id: "division-1",
    name: "IT Department",
    description: "Information Technology Department",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "division-2",
    name: "Finance",
    description: "Finance and Accounting Department",
    createdAt: "2024-01-01T10:05:00Z",
    updatedAt: "2024-01-01T10:05:00Z"
  },
  {
    id: "division-3",
    name: "HR",
    description: "Human Resources Department",
    createdAt: "2024-01-01T10:10:00Z",
    updatedAt: "2024-01-01T10:10:00Z"
  }
];

// Mock Categories
export const categories: Category[] = [
  {
    id: "category-1",
    name: "Desktop PC",
    type: "hardware",
    description: "Desktop computers",
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-01-01T09:00:00Z"
  },
  {
    id: "category-2",
    name: "Laptop",
    type: "hardware",
    description: "Portable computers",
    createdAt: "2024-01-01T09:05:00Z",
    updatedAt: "2024-01-01T09:05:00Z"
  },
  {
    id: "category-3",
    name: "Monitor",
    type: "hardware",
    description: "Display screens",
    createdAt: "2024-01-01T09:10:00Z",
    updatedAt: "2024-01-01T09:10:00Z"
  },
  {
    id: "category-4",
    name: "Printer",
    type: "hardware",
    description: "Printing devices",
    createdAt: "2024-01-01T09:15:00Z",
    updatedAt: "2024-01-01T09:15:00Z"
  },
  {
    id: "category-5",
    name: "Operating System",
    type: "software",
    description: "Computer operating systems",
    createdAt: "2024-01-01T09:20:00Z",
    updatedAt: "2024-01-01T09:20:00Z"
  },
  {
    id: "category-6",
    name: "Office Suite",
    type: "software",
    description: "Productivity software",
    createdAt: "2024-01-01T09:25:00Z",
    updatedAt: "2024-01-01T09:25:00Z"
  }
];

// Mock Components
export const components: Component[] = [
  {
    id: "component-1",
    name: "Intel Core i7-11700K",
    categoryId: "category-1",
    model: "i7-11700K",
    manufacturer: "Intel",
    serialNumber: "CPU123456",
    purchaseDate: "2023-06-15T00:00:00Z",
    warrantyExpiration: "2026-06-15T00:00:00Z",
    specifications: {
      "Cores": "8",
      "Threads": "16",
      "Base Clock": "3.6 GHz",
      "Turbo Clock": "5.0 GHz"
    },
    status: "in-use",
    createdAt: "2023-06-16T09:00:00Z",
    updatedAt: "2023-06-16T09:00:00Z"
  },
  {
    id: "component-2",
    name: "NVIDIA GeForce RTX 3080",
    categoryId: "category-1",
    model: "RTX 3080",
    manufacturer: "NVIDIA",
    serialNumber: "GPU789012",
    purchaseDate: "2023-06-15T00:00:00Z",
    warrantyExpiration: "2025-06-15T00:00:00Z",
    specifications: {
      "Memory": "10GB GDDR6X",
      "CUDA Cores": "8704"
    },
    status: "in-use",
    createdAt: "2023-06-16T09:05:00Z",
    updatedAt: "2023-06-16T09:05:00Z"
  },
  {
    id: "component-3",
    name: "Samsung 970 EVO Plus 1TB",
    categoryId: "category-1",
    model: "970 EVO Plus",
    manufacturer: "Samsung",
    serialNumber: "SSD345678",
    purchaseDate: "2023-06-15T00:00:00Z",
    warrantyExpiration: "2028-06-15T00:00:00Z",
    specifications: {
      "Capacity": "1TB",
      "Interface": "NVMe PCIe 3.0 x4",
      "Read Speed": "3500 MB/s"
    },
    status: "in-use",
    createdAt: "2023-06-16T09:10:00Z",
    updatedAt: "2023-06-16T09:10:00Z"
  },
  {
    id: "component-4",
    name: "Corsair Vengeance RGB Pro 32GB",
    categoryId: "category-1",
    model: "Vengeance RGB Pro",
    manufacturer: "Corsair",
    serialNumber: "RAM901234",
    purchaseDate: "2023-06-15T00:00:00Z",
    warrantyExpiration: "2028-06-15T00:00:00Z",
    specifications: {
      "Capacity": "32GB (2x16GB)",
      "Speed": "3600MHz",
      "Type": "DDR4"
    },
    status: "in-use",
    createdAt: "2023-06-16T09:15:00Z",
    updatedAt: "2023-06-16T09:15:00Z"
  },
  {
    id: "component-5",
    name: "ASUS ProArt Display 27\"",
    categoryId: "category-3",
    model: "PA278QV",
    manufacturer: "ASUS",
    serialNumber: "MON567890",
    purchaseDate: "2023-05-10T00:00:00Z",
    warrantyExpiration: "2026-05-10T00:00:00Z",
    specifications: {
      "Size": "27 inches",
      "Resolution": "2560x1440",
      "Panel Type": "IPS"
    },
    status: "in-use",
    createdAt: "2023-05-11T10:00:00Z",
    updatedAt: "2023-05-11T10:00:00Z"
  }
];

// Mock Assets
export const assets: Asset[] = [
  {
    id: "asset-1",
    name: "Development Workstation",
    assetTag: "PC-DEV-001",
    categoryId: "category-1",
    assignedToId: "user-1",
    status: "active",
    purchaseDate: "2023-06-15T00:00:00Z",
    warrantyExpiration: "2026-06-15T00:00:00Z",
    notes: "High-performance workstation for software development",
    components: ["component-1", "component-2", "component-3", "component-4"],
    createdAt: "2023-06-16T09:30:00Z",
    updatedAt: "2023-06-16T09:30:00Z"
  },
  {
    id: "asset-2",
    name: "Marketing Laptop",
    assetTag: "LP-MKT-001",
    categoryId: "category-2",
    assignedToId: "user-2",
    status: "active",
    purchaseDate: "2023-04-20T00:00:00Z",
    warrantyExpiration: "2026-04-20T00:00:00Z",
    notes: "Laptop for marketing department",
    createdAt: "2023-04-21T11:00:00Z",
    updatedAt: "2023-04-21T11:00:00Z"
  },
  {
    id: "asset-3",
    name: "HR Monitor",
    assetTag: "MON-HR-001",
    categoryId: "category-3",
    assignedToId: "user-3",
    status: "active",
    purchaseDate: "2023-05-10T00:00:00Z",
    warrantyExpiration: "2026-05-10T00:00:00Z",
    components: ["component-5"],
    createdAt: "2023-05-11T10:30:00Z",
    updatedAt: "2023-05-11T10:30:00Z"
  }
];

// Mock Maintenance Records
export const maintenanceRecords: Maintenance[] = [
  {
    id: "maintenance-1",
    assetId: "asset-1",
    reportedById: "user-1",
    assignedToId: "user-3",
    title: "System overheating",
    description: "Workstation is shutting down due to overheating during intensive tasks",
    status: "completed",
    priority: "high",
    dateReported: "2024-03-10T14:30:00Z",
    dateCompleted: "2024-03-11T16:45:00Z",
    solution: "Cleaned dust from CPU and GPU heat sinks, replaced thermal paste",
    cost: 25.00,
    createdAt: "2024-03-10T14:30:00Z",
    updatedAt: "2024-03-11T16:45:00Z"
  },
  {
    id: "maintenance-2",
    assetId: "asset-2",
    reportedById: "user-2",
    assignedToId: "user-3",
    title: "Keyboard not working properly",
    description: "Several keys on the laptop keyboard are not responding",
    status: "in-progress",
    priority: "medium",
    dateReported: "2024-04-05T09:15:00Z",
    createdAt: "2024-04-05T09:15:00Z",
    updatedAt: "2024-04-05T09:15:00Z"
  },
  {
    id: "maintenance-3",
    assetId: "asset-3",
    reportedById: "user-3",
    title: "Screen flickering",
    description: "Monitor screen flickers intermittently during use",
    status: "pending",
    priority: "low",
    dateReported: "2024-04-08T11:30:00Z",
    createdAt: "2024-04-08T11:30:00Z",
    updatedAt: "2024-04-08T11:30:00Z"
  }
];
