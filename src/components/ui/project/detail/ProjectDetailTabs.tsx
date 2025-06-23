import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IProject } from '@/types/project';
import ProjectFilesManager from './ProjectFilesManager';
import ProjectComments from './ProjectComments';

interface ProjectDetailTabsProps {
  project: IProject;
}

const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({ project }) => {
    const [activeTab, setActiveTab] = useState('info');

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">      <TabsList className="bg-white/10 text-white">
        <TabsTrigger value="info">Informacje</TabsTrigger>
        <TabsTrigger value="files">Pliki</TabsTrigger>
        <TabsTrigger value="comments">
          Komentarze {project.commentCount !== undefined && project.commentCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-600 rounded-full">
              {project.commentCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white">Opis projektu</h3>
            <p className="text-white/80 mt-2">{project.description || 'Brak opisu'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-medium text-white">Data rozpoczęcia</h3>
              <p className="text-white/80">{new Date(project.startDate).toLocaleDateString('pl-PL')}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-white">Data zakończenia</h3>
              <p className="text-white/80">{new Date(project.endDate).toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-white">Status</h3>
            <p className="text-white/80">{project.status}</p>
          </div>
        </div>
      </TabsContent>
        <TabsContent value="files" className="pt-4">
        <ProjectFilesManager projectId={project.id} />
      </TabsContent>

      <TabsContent value="comments" className="pt-4">
        <ProjectComments projectId={project.id} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
