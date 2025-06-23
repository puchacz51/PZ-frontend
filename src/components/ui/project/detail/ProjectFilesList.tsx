import { FileText, Download, Trash2, Calendar, User } from 'lucide-react';
import { IProjectFile } from '@/types/file';
import { Button } from '@/components/ui/button';
import { projectFileService } from '@/api/projectFileService';

interface ProjectFilesListProps {
  files: IProjectFile[];
  onDeleteFile: (fileId: number) => void;
  onDownloadFile: (file: IProjectFile) => void;
}

const ProjectFilesList: React.FC<ProjectFilesListProps> = ({ 
  files, 
  onDeleteFile,
  onDownloadFile
}) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <FileText className="h-12 w-12 mx-auto mb-4 text-white/40" />
        <p className="text-lg">Brak załączonych plików</p>
        <p className="text-sm mt-1">Przeciągnij pliki lub użyj przycisku "Wybierz pliki" powyżej</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map(file => (
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
                    <span>{file.uploadedBy.firstName} {file.uploadedBy.lastName}</span>
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
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onDeleteFile(file.id)}
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-red-500/20"
                title="Usuń plik"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectFilesList;
