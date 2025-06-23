import { useState } from "react";
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
import { Users, AlertCircle } from "lucide-react";
import { projectUserService } from "@/api/projectUserService";
import { IProjectUser, ProjectRoleLabel } from "@/types/project-user";

interface EditUserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (updatedMember: IProjectUser) => void;
  projectId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  currentRole: ProjectRoleLabel;
}

const roleOptions: { value: ProjectRoleLabel; label: string }[] = [
  { value: "Manager", label: "Manager" },
  { value: "Developer", label: "Developer" },
  { value: "Designer", label: "Designer" },
  { value: "Tester", label: "Tester" },
  { value: "Analyst", label: "Analyst" },
];

const EditUserRoleModal: React.FC<EditUserRoleModalProps> = ({
  isOpen,
  onClose,
  onUpdateRole,
  projectId,
  user,
  currentRole
}) => {
  const [selectedRole, setSelectedRole] = useState<ProjectRoleLabel>(currentRole || "Developer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zabezpieczenie przed nieprawidłowymi danymi
  if (!user || !currentRole) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === currentRole) {
      handleClose();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedMember = await projectUserService.updateUserRole(projectId, user.id, {
        role: selectedRole
      });

      onUpdateRole(updatedMember);
      handleClose();
    } catch (error: unknown) {
      console.error("Failed to update user role:", error);
      const errorResponse = error as { response?: { status: number } };
      if (errorResponse.response?.status === 403) {
        setError("Nie masz uprawnień do zmiany ról w tym projekcie");
      } else if (errorResponse.response?.status === 404) {
        setError("Nie znaleziono użytkownika w projekcie");
      } else {
        setError("Nie udało się zaktualizować roli użytkownika");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRole(currentRole);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/90 border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Zmień rolę użytkownika
          </DialogTitle>          <DialogDescription className="text-white/70">
            Zmień rolę użytkownika <span className="font-semibold">{user?.firstName || ''} {user?.lastName || ''}</span> w projekcie
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">
              Nowa rola w projekcie
            </Label>
            <Select value={selectedRole} onValueChange={(value: ProjectRoleLabel) => setSelectedRole(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/20">
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value} className="text-white hover:bg-white/10">
                    {role.label}
                    {role.value === currentRole && (
                      <span className="ml-2 text-xs text-white/50">(aktualna)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="border-white/20 text-black hover:bg-white/10 hover:text-white">
              Anuluj
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || selectedRole === currentRole}
              className="bg-white text-black hover:bg-white/90"
            >
              {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserRoleModal;
