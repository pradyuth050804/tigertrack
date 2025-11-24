import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AddElephantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddElephantDialog: React.FC<AddElephantDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    aliasName: '',
    sex: 'Male',
    ageClass: 'Adult',
    district: 'Mysuru',
    reserve: 'Bandipur',
    status: 'Alive',
    latitude: '',
    longitude: '',
    lastSeen: '',
    trackingCollar: false,
    tusker: false,
    conflictCase: false,
    notes: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Elephant Code is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.lastSeen.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Last Seen date is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Construct payload for creating elephant record
      // In a real app, this would be sent to a backend API or Supabase
      const elephantRecord = {
        id: formData.code,
        name: formData.aliasName || null,
        sex: formData.sex,
        age_class: formData.ageClass,
        state: 'Karnataka', // Could be dynamic
        district: formData.district,
        reserve: formData.reserve,
        collared: formData.trackingCollar,
        collar_id: formData.trackingCollar ? `COLLAR-${formData.code}` : null,
        last_location: `${formData.latitude}, ${formData.longitude}` || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        movement_distance: null,
        battery: formData.trackingCollar ? 85 : null,
        signal: formData.trackingCollar ? 'Strong' : null,
        last_transmission: formData.trackingCollar ? 'now' : null,
        status: formData.status,
        // Additional fields (custom)
        tusker: formData.tusker,
        conflict_case: formData.conflictCase,
        notes: formData.notes,
      };

      // Log the payload (in production, send to API)
      console.log('Creating elephant record:', elephantRecord);

      // TODO: Call createElephant service
      // const result = await createElephant(...);

      toast({
        title: 'Success',
        description: `Elephant record ${formData.code} created successfully`,
      });

      // Reset form and close dialog
      setFormData({
        code: '',
        aliasName: '',
        sex: 'Male',
        ageClass: 'Adult',
        district: 'Mysuru',
        reserve: 'Bandipur',
        status: 'Alive',
        latitude: '',
        longitude: '',
        lastSeen: '',
        trackingCollar: false,
        tusker: false,
        conflictCase: false,
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Error creating elephant record:', error);
      toast({
        title: 'Error',
        description: 'Failed to create elephant record',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
          <h2 className="text-lg font-semibold">Add New Elephant Record</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Code and Alias Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code" className="text-sm font-medium">
                Elephant Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="e.g., KA-BNR-E23"
                value={formData.code}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="aliasName" className="text-sm font-medium">
                Alias Name
              </Label>
              <Input
                id="aliasName"
                name="aliasName"
                type="text"
                placeholder="e.g., Jumbo, Raja"
                value={formData.aliasName}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Row 2: Sex and Age Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sex" className="text-sm font-medium">
                Sex <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => handleSelectChange('sex', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ageClass" className="text-sm font-medium">
                Age Class <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.ageClass}
                onValueChange={(value) => handleSelectChange('ageClass', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Calf">Calf</SelectItem>
                  <SelectItem value="Juvenile">Juvenile</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: District and Reserve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="district" className="text-sm font-medium">
                District <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleSelectChange('district', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mysuru">Mysuru</SelectItem>
                  <SelectItem value="Chamarajanagar">Chamarajanagar</SelectItem>
                  <SelectItem value="Kodagu">Kodagu</SelectItem>
                  <SelectItem value="Hassan">Hassan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reserve" className="text-sm font-medium">
                Reserve
              </Label>
              <Select
                value={formData.reserve}
                onValueChange={(value) => handleSelectChange('reserve', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bandipur">Bandipur</SelectItem>
                  <SelectItem value="Nagarahole">Nagarahole</SelectItem>
                  <SelectItem value="Mudumalai">Mudumalai</SelectItem>
                  <SelectItem value="Wayanad">Wayanad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Status and Latitude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alive">Alive</SelectItem>
                  <SelectItem value="Dead">Dead</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                  <SelectItem value="Relocated">Relocated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="latitude" className="text-sm font-medium">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="0.0001"
                placeholder="e.g., 11.6643"
                value={formData.latitude}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Row 5: Longitude only */}
          <div>
            <Label htmlFor="longitude" className="text-sm font-medium">
              Longitude
            </Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.0001"
              placeholder="e.g., 76.6862"
              value={formData.longitude}
              onChange={handleInputChange}
              className="mt-2"
            />
          </div>

          {/* Row 6: Last Seen */}
          <div>
            <Label htmlFor="lastSeen" className="text-sm font-medium">
              Last Seen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastSeen"
              name="lastSeen"
              type="datetime-local"
              value={formData.lastSeen}
              onChange={handleInputChange}
              className="mt-2"
            />
          </div>

          {/* Checkboxes: Tracking Collar, Tusker, Conflict Case */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="trackingCollar"
                name="trackingCollar"
                checked={formData.trackingCollar}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="trackingCollar" className="text-sm font-medium">
                Tracking Collar
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tusker"
                name="tusker"
                checked={formData.tusker}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="tusker" className="text-sm font-medium">
                Tusker
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="conflictCase"
                name="conflictCase"
                checked={formData.conflictCase}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="conflictCase" className="text-sm font-medium">
                Conflict Case
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes
            </Label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Additional observations..."
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddElephantDialog;
