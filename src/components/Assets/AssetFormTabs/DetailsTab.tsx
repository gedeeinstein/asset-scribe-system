
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Asset } from '@/lib/data';

interface DetailsTabProps {
  formData: Asset;
  handleChange: (field: string, value: string | null | string[]) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input 
            id="purchaseDate" 
            type="date" 
            value={formData.purchaseDate}
            onChange={(e) => handleChange('purchaseDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyExpires">Warranty Expiration (Optional)</Label>
          <Input 
            id="warrantyExpires" 
            type="date" 
            value={formData.warrantyExpires || ''}
            onChange={(e) => handleChange('warrantyExpires', e.target.value || null)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastMaintenance">Last Maintenance (Optional)</Label>
          <Input 
            id="lastMaintenance" 
            type="date" 
            value={formData.lastMaintenance || ''}
            onChange={(e) => handleChange('lastMaintenance', e.target.value || null)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          value={formData.notes} 
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default DetailsTab;
