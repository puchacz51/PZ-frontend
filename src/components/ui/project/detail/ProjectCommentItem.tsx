import { useState } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Edit2, Trash2, User } from 'lucide-react';
import { IProjectComment } from '@/types/project-comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectCommentItemProps {
  comment: IProjectComment;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const ProjectCommentItem: React.FC<ProjectCommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSaveEdit = () => {
    if (editContent.trim() !== comment.content.trim()) {
      onUpdate(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(comment.id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy HH:mm', { locale: pl });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatarUrl} alt={`${comment.user.firstName} ${comment.user.lastName}`} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {comment.user.avatarUrl ? (
                  <User className="h-4 w-4" />
                ) : (
                  getInitials(comment.user.firstName, comment.user.lastName)
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              <p className="text-white/60 text-xs">
                {formatDate(comment.createdAt)}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <span className="ml-1">(edytowano: {formatDate(comment.updatedAt)})</span>
                )}
              </p>
            </div>
          </div>
          
          {(comment.canEdit || comment.canDelete) && !isEditing && (
            <div className="flex items-center space-x-1">
              {comment.canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdating || isDeleting}
                  className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-gray-700"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
              
              {comment.canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isUpdating || isDeleting}
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Usunąć komentarz?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/60">
                        Ta akcja jest nieodwracalna. Komentarz zostanie trwale usunięty.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                        Anuluj
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Usuwanie...' : 'Usuń'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
              maxLength={1000}
              placeholder="Treść komentarza..."
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">
                {editContent.length}/1000 znaków
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="text-white/60 hover:text-white hover:bg-gray-700"
                >
                  Anuluj
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || editContent.trim() === comment.content.trim() || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? 'Zapisywanie...' : 'Zapisz'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white/90 text-sm whitespace-pre-wrap">
            {comment.content}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCommentItem;
