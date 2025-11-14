import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createElephant } from "@/lib/supabase-services";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddNewElephant = () => {
  const [leftImage, setLeftImage] = useState<File | null>(null);
  const [rightImage, setRightImage] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string>("");
  const [rightPreview, setRightPreview] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("KA");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileSelect = (file: File | null, side: 'left' | 'right') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'left') {
        setLeftImage(file);
        setLeftPreview(reader.result as string);
      } else {
        setRightImage(file);
        setRightPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftImage(null);
      setLeftPreview("");
    } else {
      setRightImage(null);
      setRightPreview("");
    }
  };

  const handleCreate = async () => {
    if (!name) {
      toast({ title: 'Name required', description: 'Please provide a name', variant: 'destructive' });
      return;
    }
    setIsCreating(true);
    try {
  const created = await createElephant(name, stateCode, leftImage, rightImage, user?.role);
      if (created) {
        toast({ title: 'Elephant created', description: `Created ${created.id}` });
        navigate(`/elephants/${created.id}`);
      } else {
        throw new Error('Create failed');
      }
    } catch (err) {
      console.error('Create elephant error', err);
      toast({ title: 'Creation failed', description: 'Unable to create elephant', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Add New Elephant</h1>
        <p className="text-muted-foreground">Create a new elephant by uploading images and assigning a name.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Images</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="left-image" className="text-sm font-medium">Left Image</Label>
            {!leftPreview ? (
              <label htmlFor="left-image" className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                <input id="left-image" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'left')} />
              </label>
            ) : (
              <div className="relative h-48 border border-border rounded-lg overflow-hidden group">
                <img src={leftPreview} alt="Left" className="w-full h-full object-cover" />
                <button onClick={() => removeImage('left')} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="right-image" className="text-sm font-medium">Right Image</Label>
            {!rightPreview ? (
              <label htmlFor="right-image" className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                <input id="right-image" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'right')} />
              </label>
            ) : (
              <div className="relative h-48 border border-border rounded-lg overflow-hidden group">
                <img src={rightPreview} alt="Right" className="w-full h-full object-cover" />
                <button onClick={() => removeImage('right')} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium">Assign Name</label>
          <input type="text" placeholder="e.g. Matriarch Mala" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border px-3 py-2" />

          <label className="text-sm font-medium">State Code (2 letters)</label>
          <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value.toUpperCase())} maxLength={2} className="w-28 rounded-md border border-border px-3 py-2" />

          <Button onClick={handleCreate} disabled={isCreating} className="w-full mt-2">{isCreating ? 'Creating...' : 'Create New Elephant'}</Button>
        </div>
      </Card>
    </div>
  );
};

export default AddNewElephant;
