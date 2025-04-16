import { useState } from 'react';
import { IFile, IFileUploadRequest, mockFiles } from '@/types/file';
import FileDropZone from './FileDropZone';
import ProjectFilesList from './ProjectFilesList';

interface ProjectFilesManagerProps {
  projectId: number;
  initialFiles?: IFile[];
}

const ProjectFilesManager: React.FC<ProjectFilesManagerProps> = ({ 
  projectId, 
  initialFiles = [] 
}) => {
  const [files, setFiles] = useState<IFile[]>(initialFiles.length > 0 ? initialFiles : mockFiles);
  const [uploading, setUploading] = useState(false);

  const handleFilesUpload = async (fileRequests: IFileUploadRequest[]) => {
    setUploading(true);
    
    try {
      const newFiles: IFile[] = fileRequests.map((req, index) => ({
        id: Date.now() + index,
        fileName: req.file.name,
        filePath: `/uploads/${req.file.name}`,
        uploadedBy: req.uploadedBy,
        createdAt: new Date().toISOString()
      }));

      setFiles(prevFiles => [...newFiles, ...prevFiles]);
      
      console.log('Files to upload:', fileRequests);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      console.log('Deleting file with ID:', fileId);
      
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = (file: IFile) => {
    console.log('Downloading file:', file);    
    alert(`Pobieranie pliku: ${file.fileName}`);
  };

  const currentUser = "user123";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Pliki projektu</h3>
      <FileDropZone 
        onFilesUpload={handleFilesUpload} 
        isUploading={uploading} 
        currentUsername={currentUser}
      />
      
      <div className="mt-6">
        <h4 className="text-md font-medium text-white mb-3">Załączone pliki</h4>
        <ProjectFilesList 
          files={files}
          onDeleteFile={handleDeleteFile}
          onDownloadFile={handleDownloadFile}
        />
      </div>
    </div>
  );
};

export default ProjectFilesManager;
