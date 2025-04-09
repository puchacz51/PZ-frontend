import { IProject } from "@/types/project";
import { Card } from "@/components/ui/card";
import { parseISO } from "date-fns";
import ProjectCardHeader from "./ProjectCardHeader";
import ProjectCardContent from "./ProjectCardContent";
import ProjectCardProgress from "./ProjectCardProgress";
import ProjectCardFooter from "./ProjectCardFooter";

interface ProjectCardProps {
    project: IProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const endDate = parseISO(project.endDate);
    const isOverdue = new Date() > endDate;

    return (
        <Card 
            className="group transition-all duration-300 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 
                       backdrop-blur-sm relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
            {isOverdue && project.status !== "Completed" && project.status !== "Canceled" && (
                <div className="absolute -bottom-80 -left-60 w-120 h-120 rounded-full bg-gradient-to-br from-red-500/40 to-red-700/60 
                               blur-3xl opacity-60 mix-blend-screen -z-10 
                               before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)] 
                               before:opacity-40 before:[background-size:0.5rem_0.5rem]">
                </div>
            )}
            
            <ProjectCardHeader project={project} />
            <ProjectCardContent project={project} />
            <ProjectCardProgress project={project} />
            <ProjectCardFooter project={project} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </Card>
    );
};

export default ProjectCard;
