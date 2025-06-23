import { FileText, Download, Calendar, User, FolderOpen } from 'lucide-react';
import { IProjectFile } from '@/types/file';
import { Button } from '@/components/ui/button';
import { projectFileService } from '@/api/projectFileService';
import { Link } from '@tanstack/react-router';

interface MyFilesListProps {
  files: IProjectFile[];
  onDownloadFile: (file: IProjectFile) => void;
}

const MyFilesList: React.FC<MyFilesListProps> = ({ 
  files, 
  onDownloadFile
}) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <FileText className="h-16 w-16 mx-auto mb-4 text-white/40" />
        <h3 className="text-xl font-medium text-white mb-2">Brak przesłanych plików</h3>
        <p className="text-white/70 mb-6">Jeszcze nie przesłałeś żadnych plików do projektów</p>
        <Link 
          to="/projects"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FolderOpen className="h-4 w-4" />
          <span>Zobacz projekty</span>
        </Link>
      </div>
    );
  }

  // Group files by project
  const filesByProject = files.reduce((acc, file) => {
    if (!acc[file.projectId]) {
      acc[file.projectId] = [];
    }
    acc[file.projectId].push(file);
    return acc;
  }, {} as Record<number, IProjectFile[]>);

  return (
    <div className="space-y-6">
      {Object.entries(filesByProject).map(([projectId, projectFiles]) => (
        <div key={projectId} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Projekt #{projectId}</span>
              <span className="text-sm text-white/60 font-normal">
                ({projectFiles.length} {projectFiles.length === 1 ? 'plik' : projectFiles.length < 5 ? 'pliki' : 'plików'})
              </span>
            </h3>
            <Link 
              to="/projects/$projectId"
              params={{ projectId }}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Zobacz projekt
            </Link>
          </div>
          
          <div className="space-y-2">
            {projectFiles.map(file => (
              <div 
                key={file.id} 
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-white/10 rounded flex-shrink-0">
                      <span className="text-lg">
                        {projectFileService.getFileIcon(file.originalFileName)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium truncate">
                          {file.originalFileName}
                        </h4>
                        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                          {projectFileService.formatFileSize(file.fileSize)}
                        </span>
                      </div>
                      
                      {file.description && (
                        <p className="text-white/70 text-sm mb-2 line-clamp-2">
                          {file.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Przesłano przez Ciebie</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(file.uploadDate).toLocaleDateString('pl-PL')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-3">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => onDownloadFile(file)}
                      className="h-8 w-8 text-white/70 hover:text-white hover:bg-blue-500/20"
                      title="Pobierz plik"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyFilesList;
