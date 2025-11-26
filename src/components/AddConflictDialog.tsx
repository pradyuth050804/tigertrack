import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Conflict } from "@/types";

interface AddConflictDialogProps {
    existingConflicts: Conflict[];
}

const AddConflictDialog = ({ existingConflicts }: AddConflictDialogProps) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Get sample data from existing conflicts
    const sampleConflict = existingConflicts[0] || {
        type: "Crop Damage" as const,
        severity: "Medium" as const,
        species: "Elephant" as const,
        animal_id: "IN-AS-008",
        location: "Kaziranga Buffer Zone, Assam",
        latitude: 26.5775,
        longitude: 93.1711,
        status: "Under Investigation" as const,
        casualties: "None",
    };

    const [formData, setFormData] = useState({
        type: sampleConflict.type,
        severity: sampleConflict.severity,
        species: sampleConflict.species,
        animal_id: sampleConflict.animal_id || "",
        location: sampleConflict.location,
        latitude: sampleConflict.latitude?.toString() || "",
        longitude: sampleConflict.longitude?.toString() || "",
        date: new Date().toISOString().split("T")[0],
        status: "Under Investigation" as Conflict["status"],
        casualties: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Generate new conflict ID
        const existingIds = existingConflicts.map((c) => c.id);
        const maxId = existingIds.reduce((max, id) => {
            const num = parseInt(id.split("-")[2]);
            return num > max ? num : max;
        }, 0);
        const newId = `CF-2024-${String(maxId + 1).padStart(3, "0")}`;

        const newConflict: Conflict = {
            id: newId,
            type: formData.type as Conflict["type"],
            severity: formData.severity as Conflict["severity"],
            species: formData.species as Conflict["species"],
            animal_id: formData.animal_id || null,
            location: formData.location,
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null,
            date: formData.date,
            status: formData.status,
            casualties: formData.casualties || null,
            description: formData.description || null,
        };

        // In a real app, this would call an API
        // For now, we'll just update the cache
        queryClient.setQueryData(["conflicts"], (old: Conflict[] = []) => {
            return [newConflict, ...old];
        });

        toast.success(`Conflict ${newId} created successfully`);
        setOpen(false);

        // Reset form
        setFormData({
            type: sampleConflict.type,
            severity: sampleConflict.severity,
            species: sampleConflict.species,
            animal_id: sampleConflict.animal_id || "",
            location: sampleConflict.location,
            latitude: sampleConflict.latitude?.toString() || "",
            longitude: sampleConflict.longitude?.toString() || "",
            date: new Date().toISOString().split("T")[0],
            status: "Under Investigation",
            casualties: "",
            description: "",
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Conflict
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Conflict</DialogTitle>
                    <DialogDescription>
                        Record a new human-wildlife conflict incident
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Conflict Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, type: value as Conflict["type"] })
                                }
                            >
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Crop Damage">Crop Damage</SelectItem>
                                    <SelectItem value="Human Injury">Human Injury</SelectItem>
                                    <SelectItem value="Livestock Loss">Livestock Loss</SelectItem>
                                    <SelectItem value="Property Damage">Property Damage</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity</Label>
                            <Select
                                value={formData.severity}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, severity: value as Conflict["severity"] })
                                }
                            >
                                <SelectTrigger id="severity">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="species">Species</Label>
                            <Select
                                value={formData.species}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, species: value as Conflict["species"] })
                                }
                            >
                                <SelectTrigger id="species">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tiger">Tiger</SelectItem>
                                    <SelectItem value="Elephant">Elephant</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="animal_id">Animal ID (Optional)</Label>
                            <Input
                                id="animal_id"
                                value={formData.animal_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, animal_id: e.target.value })
                                }
                                placeholder="e.g., IN-AS-008"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                required
                                placeholder="e.g., Kaziranga Buffer Zone, Assam"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="0.0001"
                                value={formData.latitude}
                                onChange={(e) =>
                                    setFormData({ ...formData, latitude: e.target.value })
                                }
                                placeholder="e.g., 26.5775"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="0.0001"
                                value={formData.longitude}
                                onChange={(e) =>
                                    setFormData({ ...formData, longitude: e.target.value })
                                }
                                placeholder="e.g., 93.1711"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value as Conflict["status"] })
                                }
                            >
                                <SelectTrigger id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Compensated">Compensated</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="casualties">Casualties</Label>
                            <Input
                                id="casualties"
                                value={formData.casualties}
                                onChange={(e) =>
                                    setFormData({ ...formData, casualties: e.target.value })
                                }
                                placeholder="e.g., None, 1 injured, 2 cattle"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Additional details about the incident..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create Conflict</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddConflictDialog;
