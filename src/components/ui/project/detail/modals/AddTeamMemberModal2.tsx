import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { projectUserService } from "@/api/projectUserService";
import { userService } from "@/api/userService";
import { IProjectUser, ProjectRoleLabel } from "@/types/project-user";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: IProjectUser) => void;
  projectId: number;
  existingMembers: IProjectUser[];
}

interface UserOption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

const roleOptions: { value: ProjectRoleLabel; label: string }[] = [
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Tester", label: "Tester" },
  { value: "Analyst", label: "Analyst" },
];

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  projectId,
  existingMembers
}) => {
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [selectedRole, setSelectedRole] = useState<ProjectRoleLabel>("Developer");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load available users
  const loadAvailableUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const allUsers = await userService.getAllUsers();
      
      // Filter out users who are already members of the project
      const existingUserIds = existingMembers.map(member => member.user.id);
      const filtered = allUsers
        .filter(user => !existingUserIds.includes(user.id))
        .map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl
        }));
      
      setAvailableUsers(filtered);
    } catch (error) {
      console.error("Failed to load users:", error);
      setError("Nie udało się załadować listy użytkowników");
    } finally {
      setIsLoadingUsers(false);
    }
  }, [existingMembers]);

  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers();
    }
  }, [isOpen, loadAvailableUsers]);

  const filteredUsers = availableUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Proszę wybrać użytkownika");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newMember = await projectUserService.assignUserToProject(projectId, {
        userEmail: selectedUser.email,
        role: selectedRole
      });

      onAddMember(newMember);
      handleClose();
    } catch (error: unknown) {
      console.error("Failed to add team member:", error);
      const errorResponse = error as { response?: { status: number; data?: { message?: string } } };
      if (errorResponse.response?.status === 403) {
        setError("Nie masz uprawnień do dodawania członków do tego projektu");
      } else if (errorResponse.response?.status === 404) {
        setError("Nie znaleziono użytkownika lub projektu");
      } else if (errorResponse.response?.status === 400) {
        setError(errorResponse.response.data?.message || "Użytkownik jest już członkiem tego projektu");
      } else {
        setError("Nie udało się dodać członka zespołu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRole("Developer");
    setSearchQuery("");
    setError(null);
    onClose();
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as ProjectRoleLabel);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/90 border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Dodaj członka zespołu
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Dodaj nowego członka do zespołu projektowego
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="user-search">Wybierz użytkownika</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="user-search"
                placeholder="Szukaj użytkownika..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                disabled={isLoadingUsers}
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="text-center py-4 text-white/70">
              Ładowanie użytkowników...
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-white/70">
                  {searchQuery ? "Nie znaleziono użytkowników" : "Wszyscy użytkownicy są już członkami projektu"}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-white/20 border border-white/30"
                        : "bg-white/5 hover:bg-white/10 border border-transparent"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-white/70 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Rola w projekcie</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Wybierz rolę" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {roleOptions.map((role) => (
                  <SelectItem 
                    key={role.value} 
                    value={role.value}
                    className="text-white hover:bg-white/10 focus:bg-white/10"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-white/20 text-black hover:bg-white/10 hover:text-white"
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedUser}
              className="bg-white text-black hover:bg-white/90"
            >
              {isLoading ? "Dodawanie..." : "Dodaj członka"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberModal;
