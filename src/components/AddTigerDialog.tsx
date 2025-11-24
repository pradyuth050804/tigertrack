import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
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
import { createTiger } from '@/lib/supabase-services';

interface AddTigerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTigerDialog: React.FC<AddTigerDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image state
  const [leftFlankImage, setLeftFlankImage] = useState<File | null>(null);
  const [rightFlankImage, setRightFlankImage] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string>('');
  const [rightPreview, setRightPreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    tigerCode: '',
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
    conflictCase: false,
    notes: '',
  });

  if (!isOpen) return null;

  const handleFileSelect = (file: File | null, side: 'left' | 'right') => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'left') {
        setLeftFlankImage(file);
        setLeftPreview(reader.result as string);
      } else {
        setRightFlankImage(file);
        setRightPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftFlankImage(null);
      setLeftPreview('');
    } else {
      setRightFlankImage(null);
      setRightPreview('');
    }
  };

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

    if (!formData.tigerCode.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tiger Code is required',
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
      // Extract state code from tiger code (e.g., "IN-MP-001" -> "MP")
      const codeparts = formData.tigerCode.split('-');
      const stateCode = codeparts[1] || 'MP';

      // Call createTiger service with images and role
      const result = await createTiger(
        formData.aliasName || formData.tigerCode,
        stateCode,
        leftFlankImage,
        rightFlankImage,
        user?.role
      );

      if (result) {
        toast({
          title: 'Success',
          description: `Tiger record ${formData.tigerCode} created successfully`,
        });

        // Reset form
        setFormData({
          tigerCode: '',
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
          conflictCase: false,
          notes: '',
        });
        setLeftFlankImage(null);
        setRightFlankImage(null);
        setLeftPreview('');
        setRightPreview('');

        if (onSuccess) {
          onSuccess();
        }

        onClose();
      } else {
        throw new Error('Create failed');
      }
    } catch (error: any) {
      console.error('Error creating tiger record:', error);
      toast({
        title: 'Error',
        description:
          error?.message || 'Failed to create tiger record. Please try again.',
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
          <h2 className="text-lg font-semibold">Add New Tiger Record</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section: Flank Images */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Flank Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Flank */}
              <div className="space-y-3">
                <Label htmlFor="left-flank" className="text-sm font-medium">
                  Left Flank Image
                </Label>
                {!leftPreview ? (
                  <label
                    htmlFor="left-flank"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload</p>
                    <input
                      id="left-flank"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(e.target.files[0], 'left')
                      }
                    />
                  </label>
                ) : (
                  <div className="relative h-32 border border-border rounded-lg overflow-hidden group">
                    <img
                      src={leftPreview}
                      alt="Left flank"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('left')}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Flank */}
              <div className="space-y-3">
                <Label htmlFor="right-flank" className="text-sm font-medium">
                  Right Flank Image
                </Label>
                {!rightPreview ? (
                  <label
                    htmlFor="right-flank"
                    className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Click to upload</p>
                    <input
                      id="right-flank"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(e.target.files[0], 'right')
                      }
                    />
                  </label>
                ) : (
                  <div className="relative h-32 border border-border rounded-lg overflow-hidden group">
                    <img
                      src={rightPreview}
                      alt="Right flank"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('right')}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Basic Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Basic Information</h3>

            {/* Row 1: Code and Alias Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="tigerCode" className="text-sm font-medium">
                  Tiger Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tigerCode"
                  name="tigerCode"
                  type="text"
                  placeholder="e.g., KA-BNR-T23"
                  value={formData.tigerCode}
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
                  placeholder="e.g., Stripes, Raja"
                  value={formData.aliasName}
                  onChange={handleInputChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional friendly name
                </p>
              </div>
            </div>

            {/* Row 2: Sex and Age Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  onValueChange={(value) =>
                    handleSelectChange('ageClass', value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cub">Cub</SelectItem>
                    <SelectItem value="Sub-adult">Sub-adult</SelectItem>
                    <SelectItem value="Adult">Adult</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: District and Reserve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="district" className="text-sm font-medium">
                  District <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) =>
                    handleSelectChange('district', value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mysuru">Mysuru</SelectItem>
                    <SelectItem value="Chamarajanagar">
                      Chamarajanagar
                    </SelectItem>
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
                  onValueChange={(value) =>
                    handleSelectChange('reserve', value)
                  }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleSelectChange('status', value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alive">Alive</SelectItem>
                    <SelectItem value="Dead">Dead</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
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
            <div className="mb-4">
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
            <div className="mb-4">
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

            {/* Checkboxes: Tracking Collar and Conflict Case */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trackingCollar"
                  name="trackingCollar"
                  checked={formData.trackingCollar}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="trackingCollar"
                  className="text-sm font-medium cursor-pointer"
                >
                  Tracking Collar
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
                <Label
                  htmlFor="conflictCase"
                  className="text-sm font-medium cursor-pointer"
                >
                  Conflict Case
                </Label>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
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
              rows={3}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Flank photos can be added year-wise after creating the
              record. Click on the tiger ID to access the detail page.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddTigerDialog;
