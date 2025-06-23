import { useState, useMemo, useEffect } from "react";
import { projectService } from "@/api/projectService";
import { IProject } from "@/types/project";
import ProjectCard from "../card/ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProjectFilterBar from "./ProjectFilterBar";
import NewBadge from "../../NewBadge";
import CreateProjectModal from "../modals/CreateProjectModal";

// Define types for sorting and filtering
export type ProjectSortOption = "newest" | "oldest" | "nameAZ" | "nameZA" | "endDateSoon" | "endDateLater";
export type ProjectFilterStatus = "all" | "notStarted" | "inProgress" | "completed" | "onHold" | "canceled" | "underReview";

const ProjectList = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<ProjectSortOption>("newest");
    const [statusFilter, setStatusFilter] = useState<ProjectFilterStatus>("all");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await projectService.getAllProjects();
                setProjects(data);
            } catch (err: any) {
                console.error('📋 Failed to fetch projects:', err);
                setError(err.response?.data?.message || 'Nie udało się pobrać projektów');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Apply filtering
    const filteredProjects = useMemo(() => {
        // First filter by search query
        let filtered = projects.filter((project) => {
            return project.name.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // Then filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((project) => {
                switch (statusFilter) {
                    case "notStarted":
                        return project.status === "Not Started";
                    case "inProgress":
                        return project.status === "In Progress";
                    case "completed":
                        return project.status === "Completed";
                    case "onHold":
                        return project.status === "On Hold";
                    case "canceled":
                        return project.status === "Canceled";
                    case "underReview":
                        return project.status === "Under Review";
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "nameAZ":
                    return a.name.localeCompare(b.name);
                case "nameZA":
                    return b.name.localeCompare(a.name);
                case "endDateSoon":
                    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                case "endDateLater":
                    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
                default:
                    return 0;
            }
        });
    }, [searchQuery, sortBy, statusFilter, projects]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSortBy("newest");
        setStatusFilter("all");
    };

    const handleProjectCreated = (newProject: IProject) => {
        setProjects(prevProjects => [newProject, ...prevProjects]);
    };

    const activeFiltersCount = (statusFilter !== "all" ? 1 : 0) + (sortBy !== "newest" ? 1 : 0);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                >
                    🔄 Spróbuj ponownie
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input placeholder="Wyszukaj projekt..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400" />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/20 group flex-1 sm:flex-none" onClick={() => setShowFilters(!showFilters)}>
                            <NewBadge />
                            <Filter className="mr-2 h-4 w-4 group-hover:text-white" />
                            Filtry
                            {activeFiltersCount > 0 && <span className="ml-2 bg-white/20 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">{activeFiltersCount}</span>}
                        </Button>

                        <Button 
                            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 group flex-1 sm:flex-none"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <PlusCircle className="mr-2 h-4 w-4 group-hover:text-white" />
                            Nowy projekt
                        </Button>
                    </div>
                </div>

                {showFilters && <ProjectFilterBar sortBy={sortBy} onSortChange={setSortBy} statusFilter={statusFilter} onStatusChange={setStatusFilter} onClearFilters={handleClearFilters} />}

                {activeFiltersCount > 0 && !showFilters && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">Aktywne filtry:</span>
                        {statusFilter !== "all" && (
                            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full flex items-center">
                                Status:{" "}
                                {statusFilter === "notStarted"
                                    ? "Nie rozpoczęty"
                                    : statusFilter === "inProgress"
                                    ? "W trakcie"
                                    : statusFilter === "completed"
                                    ? "Ukończony"
                                    : statusFilter === "onHold"
                                    ? "Wstrzymany"
                                    : statusFilter === "canceled"
                                    ? "Anulowany"
                                    : "W weryfikacji"}
                                <button className="ml-1" onClick={() => setStatusFilter("all")} aria-label="Usuń filtr statusu">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {sortBy !== "newest" && (
                            <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full flex items-center">
                                Sortowanie:{" "}
                                {sortBy === "oldest" ? "Od najstarszych" : sortBy === "nameAZ" ? "Nazwa A-Z" : sortBy === "nameZA" ? "Nazwa Z-A" : sortBy === "endDateSoon" ? "Termin najbliższy" : "Termin najdalszy"}
                                <button className="ml-1" onClick={() => setSortBy("newest")} aria-label="Usuń sortowanie">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        <Button variant="link" className="text-xs text-white/60 p-0 h-auto" onClick={handleClearFilters}>
                            Wyczyść wszystkie
                        </Button>
                    </div>
                )}
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
                    {(searchQuery || statusFilter !== "all" || sortBy !== "newest") && (
                        <Button variant="outline" className="mt-4 bg-white/10 text-white hover:bg-white/20 border border-white/20" onClick={handleClearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Wyczyść filtry
                        </Button>
                    )}
                </div>
            )}
            <CreateProjectModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
};

export default ProjectList;
