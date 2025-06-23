import { CardHeader, CardTitle } from "@/components/ui/card";
import { IProject } from "@/types/project";
import ProjectStatusBadge from "../common/ProjectStatusBadge";

interface ProjectCardHeaderProps {
  project: IProject;
}

const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ project }) => {
  const isOverdue = new Date() > new Date(project.endDate);

  return (
    <CardHeader className="pb-3 relative">
      <div className="flex justify-between items-start">
        <CardTitle className="text-white text-xl font-semibold tracking-tight">
          {project.name}
        </CardTitle>
        
        <div className="flex gap-2 items-center">
          <ProjectStatusBadge status={project.status} />
          
          {isOverdue && project.status !== "Completed" && project.status !== "Canceled" && (
            <span className="bg-red-600/80 text-white text-xs px-2 py-1 rounded-full font-medium">
              Po terminie
            </span>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default ProjectCardHeader;
