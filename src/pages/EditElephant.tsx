import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import { useElephant } from '@/hooks/use-elephants';
import { updateElephant } from '@/lib/animal-services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const EditElephant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: elephant, isLoading } = useElephant(id || '');
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (elephant) {
      setForm({
        name: elephant.name || '',
        status: elephant.status || 'Active',
        latitude: elephant.latitude ?? '',
        longitude: elephant.longitude ?? '',
        last_seen: elephant.last_seen || '',
        collared: elephant.collared || false,
        collar_id: elephant.collar_id || '',
        battery: elephant.battery ?? '',
        signal: elephant.signal || '',
      });
    }
  }, [elephant]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const updates: any = {
        name: form.name || null,
        status: form.status,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        last_seen: form.last_seen || null,
        collared: !!form.collared,
        collar_id: form.collar_id || null,
        battery: form.battery ? Number(form.battery) : null,
        signal: form.signal || null,
      };
      const result = await updateElephant(id, updates, user?.role);
      if (result) {
        toast({ title: 'Updated', description: `Elephant ${id} updated` });
        navigate(`/elephants/${id}`);
      } else {
        toast({ title: 'Error', description: 'Failed to update elephant', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Update error', err);
      toast({ title: 'Error', description: 'Failed to update elephant', variant: 'destructive' });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BackButton fallbackPath="/elephants" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Elephant {id}</h1>
        <p className="text-muted-foreground">Modify fields and save changes</p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Name</Label>
            <Input name="name" value={form.name || ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Status</Label>
            <Input name="status" value={form.status || ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Latitude</Label>
            <Input name="latitude" type="number" step="0.0001" value={form.latitude ?? ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Longitude</Label>
            <Input name="longitude" type="number" step="0.0001" value={form.longitude ?? ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Last Seen</Label>
            <Input name="last_seen" type="text" value={form.last_seen || ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Collar ID</Label>
            <Input name="collar_id" value={form.collar_id || ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Battery (%)</Label>
            <Input name="battery" type="number" value={form.battery ?? ''} onChange={handleChange} className="mt-2" />
          </div>
          <div>
            <Label className="text-sm">Signal</Label>
            <Input name="signal" value={form.signal || ''} onChange={handleChange} className="mt-2" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => navigate(`/elephants/${id}`)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default EditElephant;
