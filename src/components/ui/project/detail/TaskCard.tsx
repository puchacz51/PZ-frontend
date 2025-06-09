// import { useState } from "react};
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { ITask } from "@/types/task";
// import EditTaskModal from "./EditTaskModal";
import { mockUsers } from "@/types/user";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface TaskCardProps {
  task: ITask;
  onUpdate: (updatedTask: ITask) => void;
  onDelete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, 
  // onUpdate, 
  onDelete }) => {
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Find assigned user - ensure we render string, not object
  const assignedUser = mockUsers.find(user => user.login === task.assignedTo);
  const assignedName = assignedUser 
    ? `${assignedUser.firstName} ${assignedUser.lastName}` 
    : task.assignedTo;

  const getStatusColor = () => {
    switch (task.status) {
      case "To Do": return "bg-gray-500/30 text-gray-300";
      case "In Progress": return "bg-blue-500/30 text-blue-300";
      case "Review": return "bg-amber-500/30 text-amber-300";
      case "Completed": return "bg-green-500/30 text-green-300";
      case "Blocked": return "bg-red-500/30 text-red-300";
      default: return "bg-gray-500/30 text-gray-300";
    }
  };

  const handleEdit = () => {
    // setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <>
      <Card className="bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-white text-lg">{task.name}</CardTitle>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor()}`}>
              {task.status === "To Do" ? "Do zrobienia" :
               task.status === "In Progress" ? "W trakcie" :
               task.status === "Review" ? "Do sprawdzenia" :
               task.status === "Completed" ? "Ukończone" :
               task.status === "Blocked" ? "Zablokowane" :
               task.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-white/70 line-clamp-3 mb-4">{task.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {assignedUser?.avatarUrl ? (
                  <AvatarImage src={assignedUser.avatarUrl} alt={assignedName} />
                ) : (
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {assignedUser?.firstName?.[0] || "U"}
                    {assignedUser?.lastName?.[0] || ""}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs text-white/70">{assignedName}</span>
            </div>
            <span className="text-xs text-white/50">
              {format(new Date(task.createdAt), "dd MMM yyyy", { locale: pl })}
            </span>
          </div>
        </CardContent>
        <CardFooter className="gap-2 border-t border-white/5 pt-3">
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 bg-white/10 border-white/10 text-white hover:bg-white/20"
            onClick={handleEdit}
          >
            <Edit2 className="h-3 w-3 mr-1" /> Edytuj
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Usuń
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black/90 border border-white/10 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Potwierdzenie usunięcia</AlertDialogTitle>
                <AlertDialogDescription className="text-white/70">
                  Czy na pewno chcesz usunąć zadanie "{task.name}"? Tej operacji nie można cofnąć.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/10 text-white border-white/10 hover:bg-white">Anuluj</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500/30 text-white border-red-500/30 hover:bg-red-500/50"
                  onClick={handleDelete}
                >
                  Usuń
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      {/* <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      /> */}
    </>
  );
};

export default TaskCard;
