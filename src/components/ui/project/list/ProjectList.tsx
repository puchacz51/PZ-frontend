import { useState } from "react";
import { mockProjects } from "@/types/project";
import ProjectCard from "../card/ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProjects = mockProjects.filter(project => {
    return (
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Wyszukaj projekt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>
        
        <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 group w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4 group-hover:text-white" />
          Nowy projekt
        </Button>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-white/5 p-6 backdrop-blur-sm">
            <Search className="h-12 w-12 text-white/30" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-white">Nie znaleziono projektów</h3>
          <p className="mt-1 text-white/60">Spróbuj zmienić kryteria wyszukiwania lub utwórz nowy projekt</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
