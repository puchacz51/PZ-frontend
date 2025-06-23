import { FileText, Download, Trash2 } from 'lucide-react';
import { IFile } from '@/types/file';
import { Button } from '@/components/ui/button';

interface ProjectFilesListProps {
  files: IFile[];
  onDeleteFile: (fileId: number) => void;
  onDownloadFile: (file: IFile) => void;
}

const ProjectFilesList: React.FC<ProjectFilesListProps> = ({ 
  files, 
  onDeleteFile,
  onDownloadFile
}) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        <p>Brak załączonych plików</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map(file => (
        <div 
          key={file.id} 
          className="flex items-center justify-between p-3 rounded-md bg-white/5 border border-white/10"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded">
              <FileText className="h-5 w-5 text-white/70" />
            </div>
            <div>
              <p className="text-white font-medium">{file.fileName}</p>
              <p className="text-xs text-white/60">
                Dodano: {new Date(file.createdAt).toLocaleDateString()} przez {file.uploadedBy}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onDownloadFile(file)}
              className="h-8 w-8 text-white/70 hover:text-black hover:bg-white"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onDeleteFile(file.id)}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-red-500/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectFilesList;
