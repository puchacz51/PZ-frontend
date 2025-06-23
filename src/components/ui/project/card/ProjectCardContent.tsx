import { CardContent } from "@/components/ui/card";
import { IProject } from "@/types/project";
import { CalendarDays, Clock, User } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { mockUsers } from "@/types/user";

interface ProjectCardContentProps {
  project: IProject;
}

const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ project }) => {
  const createdAt = parseISO(project.createdAt);
  
  // Find the user who created the project
  const creator = mockUsers.find(user => user.login === project.createdBy);
  const creatorName = creator ? `${creator.firstName} ${creator.lastName}` : project.createdBy;

  return (
    <CardContent className="pt-0 relative">
      <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <CalendarDays className="h-4 w-4" />
          <span>
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <User className="h-4 w-4" />
          <span>Utworzony przez: {creatorName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock className="h-4 w-4" />
          <span>{formatDistanceToNow(createdAt, { addSuffix: true, locale: pl })}</span>
        </div>
      </div>
    </CardContent>
  );
};

export default ProjectCardContent;
