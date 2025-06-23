import { useState, useEffect } from 'react';
import { IProjectFile } from '@/types/file';
import { projectFileService } from '@/api/projectFileService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MyFilesList from './MyFilesList';

const MyFilesPage: React.FC = () => {
  const [files, setFiles] = useState<IProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const myFiles = await projectFileService.getMyFiles();
        setFiles(myFiles);
      } catch (err) {
        const apiError = err as { response?: { status: number; data?: { message: string } } };
        console.error('❌ Failed to fetch my files:', apiError);
        setError(apiError.response?.data?.message || 'Nie udało się pobrać twoich plików');
      } finally {
        setLoading(false);
      }
    };

    fetchMyFiles();
  }, []);

  const handleDownloadFile = async (file: IProjectFile) => {
    try {
      const blob = await projectFileService.downloadFile(file.projectId, file.id);
      projectFileService.triggerFileDownload(blob, file.originalFileName);
    } catch (err) {
      const apiError = err as { response?: { status: number; data?: { message: string } } };
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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>📁</span>
            <span>Moje pliki</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="bg-red-500/10 border-red-500/50 mb-6">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 text-red-200 hover:text-white underline"
                >
                  Zamknij
                </button>
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Łącznie przesłano {files.length} {files.length === 1 ? 'plik' : files.length < 5 ? 'pliki' : 'plików'}
              </p>
              {files.length > 0 && (
                <p className="text-white/60 text-sm">
                  Łączny rozmiar: {projectFileService.formatFileSize(
                    files.reduce((sum, file) => sum + file.fileSize, 0)
                  )}
                </p>
              )}
            </div>
          </div>

          <MyFilesList 
            files={files} 
            onDownloadFile={handleDownloadFile}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyFilesPage;
