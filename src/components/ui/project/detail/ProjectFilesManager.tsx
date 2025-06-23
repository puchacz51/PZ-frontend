import { useState, useEffect } from 'react';
import { IProjectFile, IProjectFileCreateRequest } from '@/types/file';
import { projectFileService } from '@/api/projectFileService';
import FileDropZone from './FileDropZone';
import ProjectFilesList from './ProjectFilesList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ProjectFilesManagerProps {
  projectId: number;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
}

const ProjectFilesManager: React.FC<ProjectFilesManagerProps> = ({ 
  projectId
}) => {
  const [files, setFiles] = useState<IProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch project files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectFiles = await projectFileService.getProjectFiles(projectId);
        setFiles(projectFiles);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('❌ Failed to fetch project files:', apiError);
        if (apiError.response?.status === 403) {
          setError('Brak uprawnień do przeglądania plików projektu');
        } else if (apiError.response?.status === 404) {
          setError('Projekt nie został znaleziony');
        } else {
          setError(apiError.response?.data?.message || 'Nie udało się pobrać plików projektu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [projectId]);

  const handleFilesUpload = async (fileRequests: IProjectFileCreateRequest[]) => {
    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const uploadPromises = fileRequests.map(request => 
        projectFileService.uploadFile(projectId, request)
      );
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Add new files to the beginning of the list
      setFiles(prevFiles => [...uploadedFiles, ...prevFiles]);
      
      const fileCount = uploadedFiles.length;
      setSuccessMessage(
        `Pomyślnie przesłano ${fileCount} ${fileCount === 1 ? 'plik' : fileCount < 5 ? 'pliki' : 'plików'}`
      );
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error uploading files:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do przesyłania plików do tego projektu');
      } else if (apiError.response?.status === 413) {
        setError('Plik jest zbyt duży. Maksymalny rozmiar pliku to 50MB');
      } else if (apiError.response?.data?.message?.includes('File type')) {
        setError(apiError.response.data.message);
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się przesłać plików');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten plik? Ta operacja jest nieodwracalna.')) {
      return;
    }

    try {
      await projectFileService.deleteFile(projectId, fileId);
      
      // Remove file from the list
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      
      setSuccessMessage('Plik został pomyślnie usunięty');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error deleting file:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do usunięcia tego pliku');
      } else if (apiError.response?.status === 404) {
        setError('Plik nie został znaleziony');
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się usunąć pliku');
      }
    }
  };

  const handleDownloadFile = async (file: IProjectFile) => {
    try {
      const blob = await projectFileService.downloadFile(projectId, file.id);
      projectFileService.triggerFileDownload(blob, file.originalFileName);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error downloading file:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do pobrania tego pliku');
      } else if (apiError.response?.status === 404) {
        setError('Plik nie został znaleziony');
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się pobrać pliku');
      }
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-white">Pliki projektu</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/50"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Pliki projektu</h3>
      
      {/* Error/Success Messages */}
      {error && (
        <Alert className="bg-red-500/10 border-red-500/50">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {error}
            <button 
              onClick={clearMessages}
              className="ml-2 text-red-200 hover:text-white underline"
            >
              Zamknij
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="bg-green-500/10 border-green-500/50">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {/* File Upload Zone */}
      <FileDropZone 
        onFilesUpload={handleFilesUpload} 
        isUploading={uploading} 
      />
      
      {/* Files List */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-md font-medium text-white">
            Załączone pliki ({files.length})
          </h4>
          {files.length > 0 && (
            <p className="text-sm text-white/60">
              Łączny rozmiar: {projectFileService.formatFileSize(
                files.reduce((sum, file) => sum + file.fileSize, 0)
              )}
            </p>
          )}
        </div>
        
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
