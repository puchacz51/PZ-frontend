import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import ProjectDetails from "@/components/ui/project/detail/ProjectDetails";
import ProjectTasks from "@/components/ui/project/detail/ProjectTasks";
import ProjectTeam from "@/components/ui/project/detail/ProjectTeam";
import { IProject, mockProjects } from "@/types/project";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import ProjectStatusBadge from "@/components/ui/project/common/ProjectStatusBadge";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EditProjectModal from "@/components/ui/project/detail/EditProjectModal";
import { Card } from "@/components/ui/card";
import { mockFiles } from "@/types";
import ProjectFilesManager from "@/components/ui/project/detail/ProjectFilesManager";
import NewBadge from "@/components/ui/NewBadge";

const projectFiles = mockFiles;

const ProjectDetailsPage = () => {
    const { projectId } = useParams({ from: "/projects/$projectId" });
    const navigate = useNavigate();
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("details");

    useEffect(() => {
        // Simulate API call
        const fetchProject = async () => {
            setLoading(true);
            try {
                // In a real app, this would be an API call
                const foundProject = mockProjects.find((p) => p.id === Number(projectId));

                if (foundProject) {
                    setProject(foundProject);
                } else {
                    // Project not found
                    navigate({ to: "/projects" });
                }
            } catch (error) {
                console.error("Failed to fetch project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, navigate]);

    const handleProjectUpdate = (updatedProject: IProject) => {
        setProject(updatedProject);
    };

    const handleDeleteProject = async () => {
        // Simulate API call
        try {
            // In a real app, this would be an API call
            console.log(`Deleting project with ID: ${projectId}`);
            navigate({ to: "/projects" });
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card className="bg-black/40 border border-white/10 p-8 text-center">
                    <h2 className="text-2xl font-semibold text-white">Projekt nie został znaleziony</h2>
                    <p className="text-white/70 mt-2">Projekt o podanym ID nie istnieje lub został usunięty.</p>
                    <Button className="mt-4" asChild>
                        <Link to="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Powrót do listy projektów
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Link to="/projects" className="text-white/70 hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">{project.name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ProjectStatusBadge status={project.status} />
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black" onClick={() => setIsEditModalOpen(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edytuj
                    </Button>
                    <Button variant="outline" size="sm" className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300" onClick={handleDeleteProject}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Usuń
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="bg-black border border-white/10 mb-6 w-full md:w-auto gap-2">
                    <TabsTrigger value="details" className="data-[state=active]:bg-white hover:bg-white/90 hover:text-black data-[state=active]:text-black ">
                        Szczegóły projektu
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="data-[state=active]:bg-white hover:bg-white/90 hover:text-black data-[state=active]:text-black ">
                        Zadania
                    </TabsTrigger>
                    <TabsTrigger value="team" className="data-[state=active]:bg-white hover:bg-white/90 hover:text-black data-[state=active]:text-black ">
                        Zespół
                    </TabsTrigger>
                    <TabsTrigger value="files" className="data-[state=active]:bg-white hover:bg-white/90 hover:text-black data-[state=active]:text-black ">
                        <NewBadge />
                        Pliki
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-0">
                    <ProjectDetails project={project} />
                </TabsContent>

                <TabsContent value="tasks" className="mt-0">
                    <ProjectTasks projectId={project.id} />
                </TabsContent>

                <TabsContent value="team" className="mt-0">
                    <ProjectTeam projectId={project.id} />
                </TabsContent>

                <TabsContent value="files" className="pt-4">
                    <ProjectFilesManager projectId={project.id} initialFiles={projectFiles} />
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} project={project} onUpdate={handleProjectUpdate} />
        </div>
    );
};

export default ProjectDetailsPage;
