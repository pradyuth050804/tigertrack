import { useState } from "react";
import { Upload, X, Search, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { identifyTiger } from "@/lib/supabase-services";

const StripeIdentification = () => {
  const [leftFlankImage, setLeftFlankImage] = useState<File | null>(null);
  const [rightFlankImage, setRightFlankImage] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string>("");
  const [rightPreview, setRightPreview] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null, side: 'left' | 'right') => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
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
      setLeftPreview("");
    } else {
      setRightFlankImage(null);
      setRightPreview("");
    }
  };

  const analyzeStripes = async () => {
    if (!leftFlankImage || !rightFlankImage) {
      toast({
        title: "Images required",
        description: "Please upload both left and right flank images",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Send both images to the backend for identification
      const result = await identifyTiger(leftFlankImage, rightFlankImage);
      
      if (result) {
        setResults(result);
        toast({
          title: "Analysis complete",
          description: "Tiger identification results are ready",
        });
      } else {
        throw new Error("No match found");
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to identify tiger. Please try again.",
        variant: "destructive",
      });
      console.error("Stripe analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Stripe Identification</h1>
        <p className="text-muted-foreground">
          Upload tiger stripe images to identify and match against our database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          
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
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                  <input
                    id="left-flank"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'left')}
                  />
                </label>
              ) : (
                <div className="relative h-48 border border-border rounded-lg overflow-hidden group">
                  <img src={leftPreview} alt="Left flank" className="w-full h-full object-cover" />
                  <button
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
                  className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP</p>
                  <input
                    id="right-flank"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'right')}
                  />
                </label>
              ) : (
                <div className="relative h-48 border border-border rounded-lg overflow-hidden group">
                  <img src={rightPreview} alt="Right flank" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage('right')}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={analyzeStripes}
            disabled={isAnalyzing || !leftFlankImage || !rightFlankImage}
            className="w-full mt-6 gradient-tiger"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing Stripes...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Identify Tiger
              </>
            )}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Identification Results</h2>
          
          {!results ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
              <p>Upload images and click identify to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Match Found</h3>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    {results.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiger ID:</span>
                    <span className="font-mono font-medium">{results.tiger_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{results.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reserve:</span>
                    <span>{results.reserve}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span>{results.last_seen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      {results.status}
                    </Badge>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  View Full Profile
                </Button>
              </div>

              {results.alternative_matches && results.alternative_matches.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Alternative Matches</h4>
                  <div className="space-y-2">
                    {results.alternative_matches?.map((match: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted/30 border border-border text-sm"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono">{match.tiger_id}</span>
                          <Badge variant="outline">{match.confidence}%</Badge>
                        </div>
                        <div className="text-muted-foreground mt-1">{match.name || "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <h3 className="font-semibold">Upload Images</h3>
            <p className="text-sm text-muted-foreground">
              Upload clear images of tiger stripes: left flank and right flank
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <h3 className="font-semibold">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Our ML model analyzes stripe patterns and matches against database
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              3
            </div>
            <h3 className="font-semibold">Get Results</h3>
            <p className="text-sm text-muted-foreground">
              Receive identification with confidence score and tiger details
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StripeIdentification;
