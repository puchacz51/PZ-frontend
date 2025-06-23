import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { IProjectFileCreateRequest } from '@/types/file';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FileDropZoneProps {
  onFilesUpload: (files: IProjectFileCreateRequest[]) => void;
  isUploading?: boolean;
}

interface FileWithDescription {
  file: File;
  description: string;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ 
  onFilesUpload, 
  isUploading = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithDescription[]>([]);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

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
      const newFiles: FileWithDescription[] = Array.from(e.dataTransfer.files).map(file => ({
        file,
        description: ''
      }));
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setShowDescriptionModal(true);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileWithDescription[] = Array.from(e.target.files).map(file => ({
        file,
        description: ''
      }));
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setShowDescriptionModal(true);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  }, []);

  const handleDescriptionChange = (index: number, description: string) => {
    setSelectedFiles(prev => 
      prev.map((item, i) => i === index ? { ...item, description } : item)
    );
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    const fileRequests: IProjectFileCreateRequest[] = selectedFiles.map(({ file, description }) => ({
      file,
      description: description.trim() || undefined
    }));
    
    onFilesUpload(fileRequests);
    setSelectedFiles([]);
    setShowDescriptionModal(false);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setShowDescriptionModal(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
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
          {selectedFiles.length > 0 && (
            <p className="text-sm text-white/70">
              Wybrano {selectedFiles.length} plik(ów)
            </p>
          )}
        </div>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-4">
              Dodaj opisy do plików (opcjonalne)
            </h3>
            
            <div className="space-y-4 mb-6">
              {selectedFiles.map((fileItem, index) => (
                <div key={index} className="border border-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium">{fileItem.file.name}</p>
                      <p className="text-white/60 text-sm">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFile(index)}
                      className="text-white/70 hover:text-white hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`description-${index}`} className="text-white/80 text-sm">
                      Opis pliku
                    </Label>
                    <Textarea
                      id={`description-${index}`}
                      value={fileItem.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      placeholder="Dodaj opis pliku..."
                      className="mt-1 bg-white/10 text-white border-white/20 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                className="text-white hover:bg-white/10"
                disabled={isUploading}
              >
                Anuluj
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Przesyłanie...' : `Prześlij ${selectedFiles.length} plik(ów)`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropZone;
