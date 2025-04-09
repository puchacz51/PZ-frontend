import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { IProject } from "@/types/project";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface ProjectCardFooterProps {
  project: IProject;
}

const ProjectCardFooter: React.FC<ProjectCardFooterProps> = ({ project }) => {
  return (
    <CardFooter className="gap-2 border-t border-white/5 pt-3 relative">
      <Button 
        variant="outline" 
        className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white group" 
        asChild
      >
        <Link to={`/projects/${project.id}`}>
          Szczegóły
          <ArrowRight className="h-4 w-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>      
    </CardFooter>
  );
};

export default ProjectCardFooter;
