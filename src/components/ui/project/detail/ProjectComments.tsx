import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { IProjectComment, IProjectCommentCreateRequest } from '@/types/project-comment';
import { projectCommentService } from '@/api/projectCommentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import ProjectCommentItem from './ProjectCommentItem';
import Loading from '@/components/ui/Loading';

interface ProjectCommentsProps {
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

const ProjectComments: React.FC<ProjectCommentsProps> = ({ projectId }) => {
  const [comments, setComments] = useState<IProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // New comment form
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit/Delete states
  const [updatingCommentId, setUpdatingCommentId] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectComments = await projectCommentService.getProjectComments(projectId);
        setComments(projectComments);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('❌ Failed to fetch project comments:', apiError);
        if (apiError.response?.status === 403) {
          setError('Brak uprawnień do przeglądania komentarzy projektu');
        } else if (apiError.response?.status === 404) {
          setError('Projekt nie został znaleziony');
        } else {
          setError(apiError.response?.data?.message || 'Nie udało się pobrać komentarzy projektu');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const request: IProjectCommentCreateRequest = {
        content: newComment.trim()
      };

      const addedComment = await projectCommentService.addComment(projectId, request);
      
      // Add new comment to the beginning of the list
      setComments(prevComments => [addedComment, ...prevComments]);
      setNewComment('');
      setSuccessMessage('Komentarz został dodany pomyślnie');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error adding comment:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do dodawania komentarzy w tym projekcie');
      } else if (apiError.response?.status === 400) {
        setError('Treść komentarza jest nieprawidłowa');
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się dodać komentarza');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId: number, content: string) => {
    setUpdatingCommentId(commentId);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedComment = await projectCommentService.updateComment(projectId, commentId, {
        content: content
      });

      // Update comment in the list
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      );

      setSuccessMessage('Komentarz został zaktualizowany');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error updating comment:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do edycji tego komentarza');
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się zaktualizować komentarza');
      }
    } finally {
      setUpdatingCommentId(null);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId);
    setError(null);
    setSuccessMessage(null);

    try {
      await projectCommentService.deleteComment(projectId, commentId);
      
      // Remove comment from the list
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );

      setSuccessMessage('Komentarz został usunięty');
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (err) {
      const apiError = err as ApiError;
      console.error('❌ Error deleting comment:', apiError);
      if (apiError.response?.status === 403) {
        setError('Brak uprawnień do usunięcia tego komentarza');
      } else {
        setError(apiError.response?.data?.message || 'Nie udało się usunąć komentarza');
      }
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">
          Komentarze ({comments.length})
        </h3>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert className="border-red-600 bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-600 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Add Comment Form */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-base">Dodaj komentarz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Napisz komentarz..."
            className="bg-gray-800 border-gray-600 text-white resize-none"
            rows={3}
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">
              {newComment.length}/1000 znaków
            </span>
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Dodawanie...' : 'Dodaj komentarz'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="py-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-white/40" />
              <p className="text-white/60 text-lg">Brak komentarzy</p>
              <p className="text-white/40 text-sm mt-1">
                Bądź pierwszy i dodaj komentarz do tego projektu
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <ProjectCommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              isUpdating={updatingCommentId === comment.id}
              isDeleting={deletingCommentId === comment.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectComments;
