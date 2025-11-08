import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

export const StripeIdDialog = () => {
  const navigate = useNavigate();
  const [leftFlankImage, setLeftFlankImage] = useState<File | null>(null);
  const [rightFlankImage, setRightFlankImage] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string>("");
  const [rightPreview, setRightPreview] = useState<string>("");

  const handleFileSelect = (file: File, side: 'left' | 'right') => {
    if (file && file.type.startsWith('image/')) {
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
    }
  };

  const removeImage = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftFlankImage(null);
      setLeftPreview("");
    } else {
      setRightFlankImage(null);
      setRightPreview("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card 
          onClick={(e) => {
            e.stopPropagation();
            navigate('/stripe-identification');
          }}
          className="p-6 border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Scan className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">Stripe ID</h3>
              <p className="text-xs text-muted-foreground">Identify tiger</p>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tiger Stripe Identification</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Flank */}
            <div className="space-y-3">
              <Label htmlFor="left-flank" className="text-sm font-medium">
                Left Flank Image
              </Label>
              {!leftPreview ? (
                <label
                  htmlFor="left-flank"
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <input
                    id="left-flank"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'left')}
                  />
                </label>
              ) : (
                <div className="relative h-48 border border-border rounded-lg overflow-hidden">
                  <img src={leftPreview} alt="Left flank" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage('left')}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
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
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <input
                    id="right-flank"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'right')}
                  />
                </label>
              ) : (
                <div className="relative h-48 border border-border rounded-lg overflow-hidden">
                  <img src={rightPreview} alt="Right flank" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage('right')}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button 
            className="w-full" 
            disabled={!leftFlankImage || !rightFlankImage}
          >
            <Scan className="h-4 w-4 mr-2" />
            Identify Tiger
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
