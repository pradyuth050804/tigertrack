import { useState, useRef, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Activity, Heart, Scale, Clock, AlertTriangle, Image as ImageIcon, FileText, Zap, Upload, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/components/BackButton";
import TerritoryInformation from "@/components/TerritoryInformation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useElephant } from "@/hooks/use-elephants";

const getStatusColor = (status: string) => {
  const colors = {
    Alive: "bg-secondary/20 text-secondary border-secondary/40",
    Monitoring: "bg-warning/10 text-warning border-warning/20",
    Missing: "bg-destructive/10 text-destructive border-destructive/20",
    Dead: "bg-muted text-muted-foreground border-muted",
  };
  return colors[status as keyof typeof colors] || colors.Alive;
};

const ElephantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: elephant, isLoading, error } = useElephant(id || "");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<Record<string, {image?: string}>>({
    '2025': { image: '' },
    '2024': { image: '' },
    '2023': { image: '' },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('ElephantProfile - id:', id);
  console.log('ElephantProfile - elephant:', elephant);
  console.log('ElephantProfile - error:', error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!elephant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Elephant Not Found</h2>
        <p className="text-muted-foreground mb-4">The elephant you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/elephants")}>Back to Elephants</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back Button */}
      <BackButton fallbackPath="/elephants" />

      {/* Header with Elephant Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold tracking-tight">{elephant.name || elephant.id}</h1>
              <Badge className={getStatusColor(elephant.status)}>{elephant.status}</Badge>
            </div>
            <p className="text-muted-foreground">
              {elephant.sex} • {elephant.age_class} • {elephant.reserve}
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Elephant ID</div>
            <div className="font-mono font-medium text-sm">{elephant.id}</div>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">District</div>
            <div className="font-medium text-sm">{elephant.district}</div>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Reserve</div>
            <div className="font-medium text-sm">{elephant.reserve}</div>
          </Card>
          <Card className="p-4 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">Last Seen</div>
            <div className="font-medium text-sm">{elephant.last_seen}</div>
          </Card>
        </div>

        {/* Notes Section */}
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
          <div className="text-sm">
            <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Notes</div>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">Herd matriarch with excellent tusks. Known for leading the herd through multiple reserves. Important for group cohesion and survival.</p>
          </div>
        </Card>
      </div>

      {/* Reference Images */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reference Image</h3>
        <div className="mb-6">
          <div 
            className={`relative aspect-video max-w-2xl mx-auto rounded-lg flex items-center justify-center border-2 ${!images[selectedYear]?.image ? 'border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer' : 'border-transparent'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {images[selectedYear]?.image ? (
              <>
                <img 
                  src={images[selectedYear].image} 
                  alt="Elephant reference" 
                  className="w-full h-full object-contain rounded-md"
                />
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-full hover:bg-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedImages = {...images};
                    updatedImages[selectedYear].image = '';
                    setImages(updatedImages);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Click to upload reference image</p>
                <p className="text-xs mt-1 text-muted-foreground flex items-center justify-center gap-1">
                  <Upload className="h-3 w-3" /> Supported formats: JPG, PNG, WebP
                </p>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (!file) return;
              
              setIsUploading(true);
              setUploadProgress(0);
              
              // Simulate upload progress
              const interval = setInterval(() => {
                setUploadProgress(prev => {
                  if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                  }
                  return prev + 10;
                });
              }, 100);
              
              try {
                // In a real app, you would upload the file to your server here
                // For demo purposes, we'll just create a local URL
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                const reader = new FileReader();
                reader.onloadend = () => {
                  const imageUrl = reader.result as string;
                  const updatedImages = {...images};
                  if (!updatedImages[selectedYear]) {
                    updatedImages[selectedYear] = {};
                  }
                  updatedImages[selectedYear].image = imageUrl;
                  setImages(updatedImages);
                  setIsUploading(false);
                  setUploadProgress(0);
                  
                  // Reset file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                };
                reader.readAsDataURL(file);
              } catch (error) {
                console.error('Error uploading image:', error);
                setIsUploading(false);
                setUploadProgress(0);
              }
            }}
          />
        </div>
        
        {isUploading && (
          <div className="w-full bg-muted rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mb-4">
          <p className="mb-2">Available Years:</p>
          <Select 
            value={selectedYear} 
            onValueChange={(value) => setSelectedYear(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(images).map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="health" className="text-xs sm:text-sm">Health Status</TabsTrigger>
          <TabsTrigger value="sightings" className="text-xs sm:text-sm">Sightings Info</TabsTrigger>
          <TabsTrigger value="media" className="text-xs sm:text-sm">Media Reports</TabsTrigger>
          <TabsTrigger value="others" className="text-xs sm:text-sm">Others</TabsTrigger>
          <TabsTrigger value="location" className="text-xs sm:text-sm">Location</TabsTrigger>
        </TabsList>

        {/* Health Status Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card className="p-6 border-t-4 border-t-green-500">
            <h3 className="text-lg font-semibold mb-4">Current Health Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="text-2xl font-bold">4,200 kg</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Checkup</p>
                <p className="text-lg font-semibold">Jan 20, 2025</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Body Condition</p>
                <p className="text-lg font-semibold text-green-600">Excellent</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded border border-red-200 dark:border-red-800">
                <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">Injuries/Concerns</p>
                <p className="text-sm text-red-800 dark:text-red-200">Minor tusk damage on left side. No cause for concern.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Treatment Given</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">Routine health checks, vaccines updated, tusk monitoring ongoing</p>
              </div>
            </div>
          </Card>

          {/* Health History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Health History</h3>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">January 20, 2025</p>
                    <p className="text-xs text-muted-foreground mt-1">Examined by: Dr. Ramesh Kumar</p>
                    <p className="text-sm font-medium mt-2">Weight: 4,200 kg</p>
                    <p className="text-sm text-foreground/80">Body Condition: Muscular and well-nourished</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">Excellent</Badge>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">December 15, 2024</p>
                    <p className="text-xs text-muted-foreground mt-1">Examined by: Dr. Priya Sharma</p>
                    <p className="text-sm font-medium mt-2">Weight: 4,180 kg</p>
                    <p className="text-sm text-foreground/80">Body Condition: Healthy and active</p>
                    <p className="text-xs text-foreground/70 mt-1">Minor territorial conflict resolved. Recovery progressing well.</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">Good</Badge>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sightings Info Tab */}
        <TabsContent value="sightings" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Sighting Timeline</h3>
              <Badge variant="outline">Total Sightings: 18</Badge>
            </div>
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">January 22, 2025</p>
                    <p className="text-xs text-muted-foreground">8:45 AM</p>
                    <p className="text-sm font-medium mt-2">Bandipur Core Zone - Sector B</p>
                    <p className="text-xs text-muted-foreground">Coordinates: 11.6687°N, 76.3052°E</p>
                    <p className="text-sm text-foreground/80 mt-1">Spotted with herd of 8 elephants, grazing near water hole.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">January 15, 2025</p>
                    <p className="text-xs text-muted-foreground">3:20 PM</p>
                    <p className="text-sm font-medium mt-2">Mangsik Range</p>
                    <p className="text-xs text-muted-foreground">Coordinates: 11.6349°N, 76.3612°E</p>
                    <p className="text-sm text-foreground/80 mt-1">Leading herd through migration route. Natural behavior observed.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Media Reports Tab */}
        <TabsContent value="media" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6">Media Coverage</h3>
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300 mt-1">News Article</Badge>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Bandipur's Matriarch Leads Herd Through Reserve Successfully</p>
                    <p className="text-xs text-muted-foreground">Source: The Hindu</p>
                    <p className="text-sm text-foreground/80 mt-2">Conservation officials celebrate successful herd migration led by the matriarch, demonstrating excellent wildlife management.</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Article
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">📅 Jan 18, 2025</Badge>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300 mt-1">Photo Feature</Badge>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Karnataka's Elephants: Guardians of the Forest</p>
                    <p className="text-xs text-muted-foreground">Source: Wildlife Today</p>
                    <p className="text-sm text-foreground/80 mt-2">Documentary photo series showcasing the importance of elephant herds in maintaining forest ecosystems and biodiversity.</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Article
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">📅 Nov 5, 2024</Badge>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Others Tab */}
        <TabsContent value="others" className="space-y-6 pt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">General Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Elephant ID</p>
                  <p className="font-semibold">{elephant.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Alias Name</p>
                  <p className="font-semibold">{elephant.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Sex</p>
                  <p className="font-semibold">{elephant.sex}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Age Class</p>
                  <p className="font-semibold">{elephant.age_class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">District</p>
                  <p className="font-semibold">{elephant.district}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Reserve</p>
                  <p className="font-semibold">{elephant.reserve}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tracking & Monitoring</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">Tracking Collar</span>
                <Badge className="bg-green-100 text-green-800 border-green-300">Yes - Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">Human-Wildlife Conflict</span>
                <Badge variant="outline">2 Incidents</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lineage Information</h3>
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">Mother</p>
                <p className="text-sm text-purple-800 dark:text-purple-200">No mother information recorded</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Father</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">No father information recorded</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200 italic">
                  ℹ️ Tip: Tracking lineage helps in understanding genetic diversity and breeding patterns in elephant populations.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Additional Notes</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Add any additional notes here..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" className="px-6">Cancel</Button>
                <Button className="px-6 bg-green-600 hover:bg-green-700">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Last Known Location</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Latitude</p>
                  <p className="font-mono font-medium text-lg">11.6890°N</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Longitude</p>
                  <p className="font-mono font-medium text-lg">76.7812°E</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded">
                  <p className="text-xs text-muted-foreground">District</p>
                  <p className="font-semibold text-sm">Mysuru</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Reserve</p>
                  <p className="font-semibold text-sm">Bandipur</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Last Seen</p>
                  <p className="font-semibold text-sm">Jan 22, 08:45</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-muted-foreground mb-2">Coordinates</p>
                <code className="text-xs bg-muted p-2 rounded block">11.6890°N, 76.7812°E</code>
              </div>
            </div>
          </Card>

          {/* Map Placeholder */}
          <Card className="p-6">
            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950/50 dark:to-green-900/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-sm">KA-BNR-E18</p>
                <p className="text-xs text-muted-foreground mt-1">Mysooru, Karnataka</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              <MapPin className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>
          </Card>
          {/* Territory Information Section */}
          <div className="pt-6 border-t">
            <TerritoryInformation
              primaryReserve={elephant.reserve || "Bandipur"}
              district={elephant.district || "Mysuru"}
              territoryRange="110.50 sq. km"
              recentSightings={2}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElephantProfile;