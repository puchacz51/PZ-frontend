import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { IFileUploadRequest } from '@/types/file';

interface FileDropZoneProps {
  onFilesUpload: (files: IFileUploadRequest[]) => void;
  isUploading?: boolean;
  currentUsername: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ 
  onFilesUpload, 
  isUploading = false, 
  currentUsername 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileRequests: IFileUploadRequest[] = Array.from(e.dataTransfer.files).map(file => ({
        file,
        uploadedBy: currentUsername
      }));
      
      onFilesUpload(fileRequests);
    }
  }, [onFilesUpload, currentUsername]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileRequests: IFileUploadRequest[] = Array.from(e.target.files).map(file => ({
        file,
        uploadedBy: currentUsername
      }));
      
      onFilesUpload(fileRequests);
    }
  }, [onFilesUpload, currentUsername]);

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-white/20 bg-white/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 rounded-full bg-white/10">
          <Upload className="h-8 w-8 text-white/70" />
        </div>
        <div className="text-white">
          <p className="font-medium">Przeciągnij i upuść pliki</p>
          <p className="text-sm text-white/70">lub</p>
        </div>
        <label className="cursor-pointer bg-white/10 hover:bg-white hover:text-black text-white px-4 py-2 rounded-md transition-colors">
          Wybierz pliki
          <input 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};

export default FileDropZone;
