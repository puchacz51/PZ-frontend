import { CardContent } from "@/components/ui/card";
import { IProject } from "@/types/project";
import { AlertTriangle } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ProjectCardProgressProps {
  project: IProject;
}

const ProjectCardProgress: React.FC<ProjectCardProgressProps> = ({ project }) => {
  const startDate = parseISO(project.startDate);
  const endDate = parseISO(project.endDate);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const daysCounterRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  
  const daysRemaining = differenceInDays(endDate, today);
  const isOverdue = today > endDate;

  const getProgressBarColor = () => {
    if (project.status === "Completed") return "bg-gradient-to-r from-green-500/70 to-green-400/90";
    if (project.status === "Canceled") return "bg-gradient-to-r from-gray-500/70 to-gray-400/90";
    if (project.status === "On Hold") return "bg-gradient-to-r from-amber-500/70 to-amber-400/90";
    if (isOverdue) return "bg-gradient-to-r from-red-500/70 to-red-400/90";
    return "bg-gradient-to-r from-white/40 to-white/60";
  };

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { width: 0 });
      
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
      });
    }
  }, [progress, isOverdue, project.status]);

  return (
    <CardContent className="pt-0">
      <div className="mt-2">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            ref={progressBarRef} 
            className={`h-full ${getProgressBarColor()}`}
          ></div>
        </div>
        
        <div 
          ref={daysCounterRef}
          className={`flex items-center justify-end mt-2 text-xs font-medium
            ${isOverdue && project.status !== "Completed" && project.status !== "Canceled"
              ? "text-red-400 font-semibold" 
              : daysRemaining < 3 && project.status !== "Completed" && project.status !== "Canceled"
                ? "text-amber-400" 
                : "text-white/60"
            }`}
        >
          {project.status === "Completed" ? (
            <span>Projekt ukończony</span>
          ) : project.status === "Canceled" ? (
            <span>Projekt anulowany</span>
          ) : project.status === "On Hold" ? (
            <span>Projekt wstrzymany</span>
          ) : isOverdue ? (
            <div className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span className="whitespace-nowrap">
                Przekroczono termin o {Math.abs(daysRemaining)} {Math.abs(daysRemaining) === 1 ? 'dzień' : 'dni'}
              </span>
            </div>
          ) : (
            <span>Pozostało: {daysRemaining} {daysRemaining === 1 ? 'dzień' : 'dni'}</span>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default ProjectCardProgress;
