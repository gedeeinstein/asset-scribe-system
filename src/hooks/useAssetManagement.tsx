
import { useState } from 'react';
import { Asset, assets } from '@/lib/data';
import { toast } from 'sonner';

const useAssetManagement = () => {
  const [data, setData] = useState([...assets]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Asset>({
    id: '',
    name: '',
    type: '',
    category: '',
    status: 'Available',
    assignedTo: null,
    division: null,
    purchaseDate: '',
    warrantyExpires: null,
    lastMaintenance: null,
    components: [],
    notes: ''
  });
  
  // For barcode/QR display
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [currentBarcode, setCurrentBarcode] = useState({ value: '', title: '' });
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleAddNew = () => {
    setEditing(null);
    setFormData({
      id: `a${Date.now()}`,
      name: '',
      type: '',
      category: '',
      status: 'Available',
      assignedTo: null,
      division: null,
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyExpires: null,
      lastMaintenance: null,
      components: [],
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditing(asset);
    setFormData({...asset});
    setDialogOpen(true);
  };

  const handleDelete = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
      setData(data.filter(a => a.id !== asset.id));
      toast.success(`Asset ${asset.name} deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      setData(data.map(a => a.id === editing.id ? formData : a));
      toast.success(`Asset ${formData.name} updated successfully.`);
    } else {
      setData([...data, formData]);
      toast.success(`Asset ${formData.name} added successfully.`);
    }
    
    setDialogOpen(false);
  };

  const showBarcode = (asset: Asset) => {
    setCurrentBarcode({ 
      value: asset.id, 
      title: asset.name 
    });
    setBarcodeDialogOpen(true);
  };

  const handleScanBarcode = () => {
    setScannerOpen(true);
  };

  const handleScannedBarcode = (value: string) => {
    const asset = data.find(a => a.id === value);
    
    if (asset) {
      toast.success(`Asset Found: ${asset.name}`, {
        description: `Type: ${asset.type} | Status: ${asset.status}`
      });
      
      const index = data.findIndex(a => a.id === value);
      
      const tableRows = document.querySelectorAll('table tr');
      if (tableRows[index + 1]) {
        tableRows[index + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        tableRows[index + 1].classList.add('bg-primary/10');
        setTimeout(() => {
          tableRows[index + 1].classList.remove('bg-primary/10');
        }, 2000);
      }
    } else {
      toast.error('Asset not found', {
        description: 'No asset matches this barcode'
      });
    }
  };

  return {
    data,
    dialogOpen,
    setDialogOpen,
    editing,
    formData,
    setFormData,
    barcodeDialogOpen,
    setBarcodeDialogOpen,
    currentBarcode,
    scannerOpen,
    setScannerOpen,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
    showBarcode,
    handleScanBarcode,
    handleScannedBarcode
  };
};

export default useAssetManagement;
