
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import DataTable from '@/components/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanBarcode } from 'lucide-react';
import BarcodeDisplay from '@/components/Barcode/BarcodeDisplay';
import BarcodeScanner from '@/components/Barcode/BarcodeScanner';
import useAssetManagement from '@/hooks/useAssetManagement';
import AssetForm from '@/components/Assets/AssetForm';
import { getAssetColumns } from '@/components/Assets/AssetColumns';

const Assets = () => {
  const {
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
  } = useAssetManagement();

  const columns = getAssetColumns({ showBarcode });

  return (
    <MainLayout title="Assets">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assets</h1>
            <p className="text-muted-foreground">Manage all IT hardware and software assets</p>
          </div>
          <Button variant="outline" onClick={handleScanBarcode}>
            <ScanBarcode className="h-4 w-4 mr-2" />
            Scan Code
          </Button>
        </div>
        
        <DataTable 
          title="Asset Inventory" 
          columns={columns} 
          data={data}
          onAdd={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update asset details below.' : 'Enter the details for the new asset.'}
              </DialogDescription>
            </DialogHeader>
            
            <AssetForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editing={editing}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <BarcodeDisplay 
          value={currentBarcode.value} 
          title={currentBarcode.title}
          open={barcodeDialogOpen}
          onOpenChange={setBarcodeDialogOpen}
        />

        <BarcodeScanner
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScan={handleScannedBarcode}
        />
      </div>
    </MainLayout>
  );
};

export default Assets;
