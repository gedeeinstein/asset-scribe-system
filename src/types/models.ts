
// Common types
export type ID = string;
export type Timestamp = string;

// User model
export interface User {
  id: ID;
  name: string;
  email: string;
  divisionId: ID;
  role: 'admin' | 'user' | 'technician';
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Division model
export interface Division {
  id: ID;
  name: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category model
export interface Category {
  id: ID;
  name: string;
  description?: string;
  type: 'hardware' | 'software';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Component model
export interface Component {
  id: ID;
  name: string;
  categoryId: ID;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  purchaseDate?: Timestamp;
  warrantyExpiration?: Timestamp;
  specifications?: Record<string, string>;
  status: 'available' | 'in-use' | 'defective';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Asset model
export interface Asset {
  id: ID;
  name: string;
  assetTag: string;
  categoryId: ID;
  assignedToId?: ID;
  locationId?: ID;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  purchaseDate?: Timestamp;
  warrantyExpiration?: Timestamp;
  notes?: string;
  components?: ID[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Maintenance model
export interface Maintenance {
  id: ID;
  assetId: ID;
  reportedById: ID;
  assignedToId?: ID;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dateReported: Timestamp;
  dateCompleted?: Timestamp;
  solution?: string;
  cost?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
