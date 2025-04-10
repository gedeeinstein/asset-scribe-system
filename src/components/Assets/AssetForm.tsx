
import React, { useState } from 'react';
import { Asset } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogFooter } from '@/components/ui/dialog';
import BasicInfoTab from './AssetFormTabs/BasicInfoTab';
import DetailsTab from './AssetFormTabs/DetailsTab';
import ComponentsTab from './AssetFormTabs/ComponentsTab';

interface AssetFormProps {
  formData: Asset;
  setFormData: (data: Asset) => void;
  onSubmit: (e: React.FormEvent) => void;
  editing: Asset | null;
  onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  editing, 
  onCancel 
}) => {
  const [selectedComponents, setSelectedComponents] = useState<string[]>(formData.components);

  const handleChange = (field: string, value: string | null | string[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <form onSubmit={(e) => {
      const updatedFormData = {
        ...formData,
        components: selectedComponents
      };
      setFormData(updatedFormData);
      onSubmit(e);
    }} className="space-y-4">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicInfoTab 
            formData={formData} 
            handleChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="details">
          <DetailsTab 
            formData={formData} 
            handleChange={handleChange} 
          />
        </TabsContent>
        
        <TabsContent value="components">
          <ComponentsTab 
            selectedComponents={selectedComponents}
            setSelectedComponents={setSelectedComponents}
          />
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editing ? 'Update' : 'Add'} Asset
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AssetForm;
