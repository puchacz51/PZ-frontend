import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { ProjectSortOption, ProjectFilterStatus } from "./ProjectList";

interface ProjectFilterBarProps {
  sortBy: ProjectSortOption;
  onSortChange: (value: ProjectSortOption) => void;
  statusFilter: ProjectFilterStatus;
  onStatusChange: (value: ProjectFilterStatus) => void;
  onClearFilters: () => void;
}

const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  sortBy,
  onSortChange,
  statusFilter,
  onStatusChange,
  onClearFilters
}) => {
  return (
    <Card className="p-4 bg-black/40 border border-white/10">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-1">
          <label className="text-xs text-white/60">Status projektu</label>
          <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as ProjectFilterStatus)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Wybierz status" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border border-white/10 text-white">
              <SelectItem value="all">Wszystkie statusy</SelectItem>
              <SelectItem value="notStarted">Nie rozpoczęte</SelectItem>
              <SelectItem value="inProgress">W trakcie</SelectItem>
              <SelectItem value="completed">Ukończone</SelectItem>
              <SelectItem value="onHold">Wstrzymane</SelectItem>
              <SelectItem value="canceled">Anulowane</SelectItem>
              <SelectItem value="underReview">W weryfikacji</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-xs text-white/60">Sortowanie</label>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as ProjectSortOption)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Wybierz sortowanie" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border border-white/10 text-white">
              <SelectItem value="newest">Od najnowszych</SelectItem>
              <SelectItem value="oldest">Od najstarszych</SelectItem>
              <SelectItem value="nameAZ">Nazwa (A-Z)</SelectItem>
              <SelectItem value="nameZA">Nazwa (Z-A)</SelectItem>
              <SelectItem value="endDateSoon">Termin (najbliższy)</SelectItem>
              <SelectItem value="endDateLater">Termin (najdalszy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 w-full sm:w-auto"
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Wyczyść filtry
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectFilterBar;
