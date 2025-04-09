import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mockProjectUsers } from "@/types/project-user";
import { mockUsers } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
// import AddTeamMemberModal from "./AddTeamMemberModal";

interface ProjectTeamProps {
  projectId: number;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState("");
//   const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [projectTeam, setProjectTeam] = useState(() => 
    mockProjectUsers.filter(pu => pu.projectId === projectId)
  );

  // Map project users to full user objects
  const teamWithUserData = projectTeam.map(teamMember => {
    const user = mockUsers.find(u => u.id === teamMember.userId);
    return {
      ...teamMember,
      user: user || {
        id: teamMember.userId,
        login: "unknown",
        email: "unknown",
        role: "unknown",
        firstName: "Unknown",
        lastName: "User"
      }
    };
  });

  const filteredTeam = teamWithUserData.filter(member => 
    member.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

//   const handleAddMember = (newMember: typeof projectTeam[0]) => {
//     setProjectTeam(prev => [...prev, newMember]);
//   };

  const handleRemoveMember = (memberId: number) => {
    setProjectTeam(prev => prev.filter(member => member.id !== memberId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Wyszukaj członka zespołu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
        </div>
        
        <Button 
          className="bg-white/10 text-white hover:bg-white/20 border border-white/20 group w-full sm:w-auto"
          // onClick={() => setIsAddMemberModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4 group-hover:text-white" />
          Dodaj członka zespołu
        </Button>
      </div>

      {filteredTeam.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map(member => (
            <Card key={member.id} className="bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
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
                    <p className="text-white/70 text-sm">@{member.user.login}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Rola w projekcie:</span>
                    <span className="text-xs text-white">{member.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Dołączył:</span>
                    <span className="text-xs text-white">
                      {format(parseISO(member.createdAt), "dd MMM yyyy", { locale: pl })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Usuń z zespołu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-black/40 border border-white/10">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-white/5 p-6 backdrop-blur-sm">
              <UserPlus className="h-12 w-12 text-white/30" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">Brak członków zespołu</h3>
            <p className="mt-1 text-white/60">
              {searchQuery 
                ? "Nie znaleziono członków zespołu spełniających kryteria wyszukiwania." 
                : "Ten projekt nie ma jeszcze przypisanych członków zespołu."}
            </p>
            <Button 
              className="mt-4 bg-white/10 text-white hover:bg-white/20 border border-white/20"
              // onClick={() => setIsAddMemberModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Dodaj pierwszego członka zespołu
            </Button>
          </div>
        </Card>
      )}

      {/* <AddTeamMemberModal 
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={handleAddMember}
        projectId={projectId}
        existingMembers={projectTeam.map(member => member.userId)}
      /> */}
    </div>
  );
};

export default ProjectTeam;
