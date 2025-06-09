import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus, IProject } from "@/types/project";
import { projectService } from "@/api/projectService";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: IProject) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onProjectCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started' as ProjectStatus
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: ProjectStatus) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newProject = await projectService.createProject(formData);
      onProjectCreated(newProject);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started'
      });
    } catch (err: any) {
      console.error('📁 Failed to create project:', err);
      setError(err.response?.data?.message || 'Nie udało się utworzyć projektu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectStatusOptions: ProjectStatus[] = [
    "Not Started",
    "In Progress", 
    "Completed",
    "On Hold",
    "Canceled",
    "Under Review"
  ];

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "Not Started": return "Nie rozpoczęty";
      case "In Progress": return "W trakcie";
      case "Completed": return "Ukończony";
      case "On Hold": return "Wstrzymany";
      case "Canceled": return "Anulowany";
      case "Under Review": return "W weryfikacji";
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>📁 Utwórz nowy projekt</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nazwa projektu</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nazwa projektu"
              className="bg-white/10 text-white border-white/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Opis</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opis projektu"
              className="bg-white/10 text-white border-white/20 min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-white">Data rozpoczęcia</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-white/10 text-white border-white/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-white">Data zakończenia</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="bg-white/10 text-white border-white/20"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-white">Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-white/10 text-white border-white/20">
                <SelectValue placeholder="Wybierz status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border border-white/10 text-white">
                {projectStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white/10 text-white border-white/20 hover:bg-white"
            >
              Anuluj
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black hover:bg-white/80"
            >
              {isSubmitting ? '⏳ Tworzenie...' : '📁 Utwórz projekt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
