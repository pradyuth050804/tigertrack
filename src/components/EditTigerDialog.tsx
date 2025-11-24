import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTiger } from '@/hooks/use-tigers';
import { updateTiger } from '@/lib/animal-services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EditTigerDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditTigerDialog = ({ id, isOpen, onClose, onSuccess }: EditTigerDialogProps) => {
  const { data: tiger, isLoading } = useTiger(id);
  const { toast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (tiger) {
      setForm({
        code: tiger.code || '',
        alias_name: tiger.alias_name || '',
        sex: tiger.sex || 'Male',
        age_class: tiger.age_class || 'Adult',
        district: tiger.district || 'Mysuru',
        reserve: tiger.reserve || 'Bandipur',
        status: tiger.status || 'Alive',
        latitude: tiger.latitude ?? '',
        longitude: tiger.longitude ?? '',
        last_seen: tiger.last_seen || '',
        tracking_collar: !!tiger.tracking_collar,
        conflict_case: !!tiger.conflict_case,
        notes: tiger.notes || '',
      });
    }
  }, [tiger]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      const updates: any = {
        code: form.code || null,
        alias_name: form.alias_name || null,
        sex: form.sex,
        age_class: form.age_class,
        district: form.district,
        reserve: form.reserve,
        status: form.status,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        last_seen: form.last_seen || null,
        tracking_collar: !!form.tracking_collar,
        conflict_case: !!form.conflict_case,
        notes: form.notes || '',
      };
      const result = await updateTiger(id, updates, user?.role);
      if (result) {
        toast({ title: 'Updated', description: `Tiger ${id} updated` });
        onClose();
        onSuccess?.();
      } else {
        toast({ title: 'Error', description: 'Failed to update tiger', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Update error', err);
      toast({ title: 'Error', description: 'Failed to update tiger', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Tiger Record</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Tiger Code *</Label>
              <Input name="code" value={form.code || ''} onChange={handleChange} className="mt-2" placeholder="e.g., KA-BNR-T23" />
            </div>
            <div>
              <Label className="text-sm">Alias Name</Label>
              <Input name="alias_name" value={form.alias_name || ''} onChange={handleChange} className="mt-2" placeholder="e.g., Stripes, Raja" />
              <span className="text-xs text-muted-foreground">Optional friendly name</span>
            </div>
            <div>
              <Label className="text-sm">Sex *</Label>
              <select name="sex" value={form.sex} onChange={handleChange} className="mt-2 w-full border rounded px-2 py-2">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Age Class *</Label>
              <select name="age_class" value={form.age_class} onChange={handleChange} className="mt-2 w-full border rounded px-2 py-2">
                <option value="Adult">Adult</option>
                <option value="Sub-adult">Sub-adult</option>
                <option value="Juvenile">Juvenile</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">District *</Label>
              <select name="district" value={form.district} onChange={handleChange} className="mt-2 w-full border rounded px-2 py-2">
                <option value="Mysuru">Mysuru</option>
                <option value="Chamarajanagar">Chamarajanagar</option>
                <option value="Kodagu">Kodagu</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Reserve *</Label>
              <select name="reserve" value={form.reserve} onChange={handleChange} className="mt-2 w-full border rounded px-2 py-2">
                <option value="Bandipur">Bandipur</option>
                <option value="Nagarhole">Nagarhole</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Status *</Label>
              <select name="status" value={form.status} onChange={handleChange} className="mt-2 w-full border rounded px-2 py-2">
                <option value="Alive">Alive</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Missing">Missing</option>
                <option value="Dead">Dead</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Latitude</Label>
              <Input name="latitude" type="number" step="0.0001" value={form.latitude ?? ''} onChange={handleChange} className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Longitude</Label>
              <Input name="longitude" type="number" step="0.0001" value={form.longitude ?? ''} onChange={handleChange} className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm">Last Seen *</Label>
              <Input name="last_seen" type="datetime-local" value={form.last_seen || ''} onChange={handleChange} className="mt-2" />
            </div>
            <div className="md:col-span-2 flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="tracking_collar" checked={!!form.tracking_collar} onChange={handleChange} /> Tracking Collar
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="conflict_case" checked={!!form.conflict_case} onChange={handleChange} /> Conflict Case
              </label>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm">Notes</Label>
              <Input name="notes" value={form.notes || ''} onChange={handleChange} className="mt-2" placeholder="Additional observations..." />
            </div>
            <div className="md:col-span-2 mt-2">
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-700 flex items-center gap-2">
                <span role="img" aria-label="note">💡</span>
                <span>Note: Flank photos can be added year-wise after creating the record. Click on the tiger ID to access the detail page.</span>
              </div>
            </div>
          </form>
        )}
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-white">Save Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTigerDialog;
