import ProjectList from "@/components/ui/project/list/ProjectList";

const ProjectsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Projekty</h1>
      </div>
      
      <ProjectList />
    </div>
  );
}

export default ProjectsPage;