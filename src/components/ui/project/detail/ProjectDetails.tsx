import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProject } from "@/types/project";
import { CalendarDays, Clock, User, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { mockUsers } from "@/types/user";

interface ProjectDetailsProps {
  project: IProject;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const createdAt = parseISO(project.createdAt);
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.endDate);
  
  // Find creator
  const creator = mockUsers.find(user => user.login === project.createdBy);
  const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : project.createdBy;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Project Details */}
      <Card className="col-span-1 md:col-span-2 bg-black/40 border border-white/10 text-white">
        <CardHeader>
          <CardTitle>Informacje o projekcie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-white/70">Opis</h3>
            <p className="mt-1 text-white">{project.description}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-white/70">Data rozpoczęcia</h3>
              <div className="mt-1 flex items-center text-white">
                <CalendarDays className="h-4 w-4 mr-2 text-white/50" />
                {format(startDate, "dd MMMM yyyy", { locale: pl })}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white/70">Data zakończenia</h3>
              <div className="mt-1 flex items-center text-white">
                <CalendarDays className="h-4 w-4 mr-2 text-white/50" />
                {format(endDate, "dd MMMM yyyy", { locale: pl })}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-white/70">Utworzony przez</h3>
              <div className="mt-1 flex items-center text-white">
                <User className="h-4 w-4 mr-2 text-white/50" />
                {creatorName}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white/70">Data utworzenia</h3>
              <div className="mt-1 flex items-center text-white">
                <Clock className="h-4 w-4 mr-2 text-white/50" />
                {format(createdAt, "dd MMMM yyyy", { locale: pl })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Stats */}
      <div className="space-y-6">
        <Card className="bg-black/40 border border-white/10 text-white">
          <CardHeader>
            <CardTitle>Status projektu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Status:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  project.status === "Completed" ? "bg-green-600/30 text-green-300" :
                  project.status === "In Progress" ? "bg-blue-600/30 text-blue-300" :
                  project.status === "Not Started" ? "bg-gray-600/30 text-gray-300" :
                  project.status === "On Hold" ? "bg-amber-600/30 text-amber-300" :
                  project.status === "Canceled" ? "bg-red-600/30 text-red-300" :
                  "bg-purple-600/30 text-purple-300"
                }`}>
                  {project.status === "Not Started" ? "Nie rozpoczęty" :
                   project.status === "In Progress" ? "W trakcie" :
                   project.status === "Completed" ? "Ukończony" :
                   project.status === "On Hold" ? "Wstrzymany" :
                   project.status === "Canceled" ? "Anulowany" :
                   "W weryfikacji"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Czas trwania:</span>
                <span className="text-sm text-white">
                  {format(startDate, "dd.MM.yyyy")} - {format(endDate, "dd.MM.yyyy")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between text-white">
            <CardTitle>Zespół projektu</CardTitle>
            <Users className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70 mb-2">Członkowie zespołu przypisani do projektu</p>
            <div className="flex flex-col gap-2">
              {/* This would be filled with actual team members in a real application */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Przejdź do zakładki Zespół</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
