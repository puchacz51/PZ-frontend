import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockTasks, ITask } from "@/types/task";
import TaskCard from "./TaskCard";
// import AddTaskModal from "./AddTaskModal";

interface ProjectTasksProps {
  projectId: number;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState("");
//   const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>(() => 
    mockTasks.filter(task => task.projectId === projectId)
  );

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

//   const handleAddTask = (newTask: ITask) => {
//     setTasks(prevTasks => [...prevTasks, newTask]);
//   };

  const handleUpdateTask = (updatedTask: ITask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Wyszukaj zadanie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>
        
        <Button 
          className="bg-white/10 text-white hover:bg-white/20 border border-white/20 group w-full sm:w-auto"
          onClick={() => {  
            // setIsAddTaskModalOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4 group-hover:text-white" />
          Nowe zadanie
        </Button>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onUpdate={handleUpdateTask} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-black/40 border border-white/10">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-white/5 p-6 backdrop-blur-sm">
              <Search className="h-12 w-12 text-white/30" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">Brak zadań</h3>
            <p className="mt-1 text-white/60">
              {searchQuery 
                ? "Nie znaleziono zadań spełniających kryteria wyszukiwania." 
                : "Ten projekt nie ma jeszcze żadnych zadań."}
            </p>
            <Button 
              className="mt-4 bg-white/10 text-white hover:bg-white/20 border border-white/20"
              onClick={() => {
                // setIsAddTaskModalOpen(true)
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj pierwsze zadanie
            </Button>
          </div>
        </Card>
      )}

      {/* <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        onAddTask={handleAddTask}
        projectId={projectId}
      /> */}
    </div>
  );
};

export default ProjectTasks;
