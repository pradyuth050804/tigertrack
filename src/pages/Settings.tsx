import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Key, Save, Database, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your dashboard preferences and integrations</p>
      </div>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">API Configuration</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="google-maps-key">Google Maps API Key</Label>
            <Input
              id="google-maps-key"
              type="password"
              placeholder="Enter your Google Maps API key"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Required for map visualization. Get your API key from the{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>
              .
            </p>
          </div>

          <Button onClick={handleSave} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save API Configuration
          </Button>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Auto ID Configuration</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id-format">ID Format Template</Label>
            <Input
              id="id-format"
              defaultValue="IN-[STATE_CODE]-[NUMBER]"
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Automatic ID generation format for new animals
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tiger-prefix">Tiger Prefix</Label>
              <Input id="tiger-prefix" defaultValue="IN" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="elephant-prefix">Elephant Prefix</Label>
              <Input id="elephant-prefix" defaultValue="IN" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Conflict Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about new conflict reports</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Collar Battery Warnings</p>
              <p className="text-sm text-muted-foreground">Alert when battery levels are low</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Sighting Notifications</p>
              <p className="text-sm text-muted-foreground">Updates on recent animal sightings</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Data Export</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your wildlife tracking data in various formats
          </p>

          <div className="flex gap-3">
            <Button variant="outline">Export as CSV</Button>
            <Button variant="outline">Export as PDF</Button>
            <Button variant="outline">Export as JSON</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
