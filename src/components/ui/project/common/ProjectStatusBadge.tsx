import { ProjectStatus } from "@/types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "Not Started":
        return "bg-gray-600/80 text-white";
      case "In Progress":
        return "bg-blue-600/80 text-white";
      case "Completed":
        return "bg-green-600/80 text-white";
      case "On Hold":
        return "bg-amber-600/80 text-white";
      case "Canceled":
        return "bg-red-600/80 text-white";
      case "Under Review":
        return "bg-purple-600/80 text-white";
      default:
        return "bg-gray-600/80 text-white";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "Not Started":
        return "Nie rozpoczęty";
      case "In Progress":
        return "W trakcie";
      case "Completed":
        return "Ukończony";
      case "On Hold":
        return "Wstrzymany";
      case "Canceled":
        return "Anulowany";
      case "Under Review":
        return "W weryfikacji";
      default:
        return status;
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default ProjectStatusBadge;
