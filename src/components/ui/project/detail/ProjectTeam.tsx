import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, UserPlus, Settings, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { projectUserService } from "@/api/projectUserService";
import { IProjectUser } from "@/types/project-user";
import AddTeamMemberModal from "./modals/AddTeamMemberModal";
import EditUserRoleModal from "./modals/EditUserRoleModal";

interface ProjectTeamProps {
  projectId: number;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState<{
    isOpen: boolean;
    user?: IProjectUser['user'];
    currentRole?: IProjectUser['role'];
  }>({ isOpen: false });  const [projectTeam, setProjectTeam] = useState<IProjectUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState(true);

  // Load project team members
  const loadProjectTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasPermissions(true);      const team = await projectUserService.getProjectUsers(projectId);
      console.log('🔍 Loaded project team:', team);
      setProjectTeam(Array.isArray(team) ? team : []);
    } catch (error: unknown) {
      console.error("Failed to load project team:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage === 'NO_PERMISSIONS') {
        setHasPermissions(false);
        setError("Nie masz uprawnień do przeglądania członków tego zespołu");
      } else if (errorMessage === 'PROJECT_NOT_FOUND') {
        setError("Projekt nie został znaleziony");
      } else {
        setError("Nie udało się załadować członków zespołu");
      }
      
      setProjectTeam([]); // Ustaw pustą tablicę w przypadku błędu
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProjectTeam();
  }, [loadProjectTeam]);
  const filteredTeam = projectTeam.filter(member => {
    // Zabezpieczenie przed niepełnymi danymi
    if (!member || !member.user) {
      return false;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const firstName = member.user.firstName || '';
    const lastName = member.user.lastName || '';
    const email = member.user.email || '';
    const role = member.role || '';
    
    return firstName.toLowerCase().includes(searchLower) ||
           lastName.toLowerCase().includes(searchLower) ||
           email.toLowerCase().includes(searchLower) ||
           role.toLowerCase().includes(searchLower);
  });

  const handleAddMember = (newMember: IProjectUser) => {
    setProjectTeam(prev => [...prev, newMember]);
  };

  const handleUpdateRole = (updatedMember: IProjectUser) => {
    setProjectTeam(prev => 
      prev.map(member => 
        member.user.id === updatedMember.user.id ? updatedMember : member
      )
    );
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      setIsRemoving(userId);
      await projectUserService.removeUserFromProject(projectId, userId);
      setProjectTeam(prev => prev.filter(member => member.user.id !== userId));
    } catch (error) {
      console.error("Failed to remove team member:", error);
      setError("Nie udało się usunąć członka zespołu");
    } finally {
      setIsRemoving(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Ładowanie członków zespołu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Wyszukaj członka zespołu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            disabled={!hasPermissions}
          />
        </div>
        
        {hasPermissions && (
          <Button 
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 group w-full sm:w-auto"
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4 group-hover:text-white" />
            Dodaj członka zespołu
          </Button>
        )}
      </div>      {error && (
        <Alert className={`${!hasPermissions ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredTeam.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map(member => (
            <Card key={member.user.id} className="bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-full">
                    {member.user.avatarUrl ? (
                      <AvatarImage src={member.user.avatarUrl} alt={`${member.user.firstName} ${member.user.lastName}`} />
                    ) : (
                      <AvatarFallback className="bg-white/10 text-white">
                        {member.user.firstName?.[0] || ""}
                        {member.user.lastName?.[0] || ""}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium">{member.user.firstName} {member.user.lastName}</h3>
                    <p className="text-white/70 text-sm">{member.user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Rola w projekcie:</span>
                    <span className="text-xs text-white">{member.role}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    onClick={() => setEditRoleModal({ 
                      isOpen: true, 
                      user: member.user, 
                      currentRole: member.role 
                    })}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Zmień rolę
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                        disabled={isRemoving === member.user.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black/90 border border-white/20 text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Usuń członka zespołu</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                          Czy na pewno chcesz usunąć <span className="font-semibold">{member.user.firstName} {member.user.lastName}</span> z zespołu projektu? Ta akcja nie może być cofnięta.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/20 text-black hover:bg-white/10 hover:text-white">
                          Anuluj
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleRemoveMember(member.user.id)}
                        >
                          {isRemoving === member.user.id ? "Usuwanie..." : "Usuń"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (        <Card className="p-8 text-center bg-black/40 border border-white/10">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-white/5 p-6 backdrop-blur-sm">
              <UserPlus className="h-12 w-12 text-white/30" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">
              {!hasPermissions ? "Brak dostępu do zespołu" : "Brak członków zespołu"}
            </h3>
            <p className="mt-1 text-white/60">
              {!hasPermissions 
                ? "Nie masz uprawnień do przeglądania członków tego zespołu."
                : searchQuery 
                  ? "Nie znaleziono członków zespołu spełniających kryteria wyszukiwania." 
                  : "Ten projekt nie ma jeszcze przypisanych członków zespołu."}
            </p>
            {!searchQuery && hasPermissions && (
              <Button 
                className="mt-4 bg-white/10 text-white hover:bg-white border border-white/20"
                onClick={() => setIsAddMemberModalOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Dodaj pierwszego członka zespołu
              </Button>
            )}
          </div>
        </Card>
      )}      {hasPermissions && (
        <AddTeamMemberModal 
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onAddMember={handleAddMember}
          projectId={projectId}
          existingMembers={projectTeam}
        />
      )}
      {editRoleModal.isOpen && editRoleModal.user && editRoleModal.currentRole && (
        <EditUserRoleModal
          isOpen={editRoleModal.isOpen}
          onClose={() => setEditRoleModal({ isOpen: false })}
          onUpdateRole={handleUpdateRole}
          projectId={projectId}
          user={editRoleModal.user}
          currentRole={editRoleModal.currentRole}
        />
      )}
    </div>
  );
};

export default ProjectTeam;
