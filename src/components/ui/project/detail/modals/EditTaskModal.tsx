import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatusDisplay, ITask } from "@/types/task";
import { taskService } from "@/api/taskService";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITask;
  onUpdate: (updatedTask: ITask) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: task.name,
    description: task.description,
    status: task.status,
    assignedTo: task.assignedToUser?.email || '',
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: TaskStatusDisplay) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(task.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        assignedTo: formData.assignedTo || undefined,
        dueDate: formData.dueDate || undefined
      });
      
      onUpdate(updatedTask);
      onClose();
    } catch (err: any) {
      console.error('✏️ Failed to update task:', err);
      setError(err.response?.data?.message || 'Nie udało się zaktualizować zadania');
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskStatusOptions: TaskStatusDisplay[] = [
    "To Do",
    "In Progress", 
    "Review",
    "Completed",
    "Blocked"
  ];

  const getStatusLabel = (status: TaskStatusDisplay) => {
    switch (status) {
      case "To Do": return "Do zrobienia";
      case "In Progress": return "W trakcie";
      case "Review": return "Do sprawdzenia";
      case "Completed": return "Ukończone";
      case "Blocked": return "Zablokowane";
      default: return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>✏️ Edytuj zadanie</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nazwa zadania</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nazwa zadania"
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
              placeholder="Opis zadania"
              className="bg-white/10 text-white border-white/20 min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Wybierz status" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white">
                  {taskStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-white">Termin wykonania</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="text-white">Przypisane do (email)</Label>
            <Input
              id="assignedTo"
              name="assignedTo"
              type="email"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="user@example.com"
              className="bg-white/10 text-white border-white/20"
            />
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
              {isSubmitting ? '⏳ Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
