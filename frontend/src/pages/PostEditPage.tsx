import { useNavigate, useParams } from 'react-router-dom';
import { PostEditor, usePosts } from 'bazzuca-react';
import { ROUTES } from '../lib/constants';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function PostEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id, 10) : undefined;
  const { uploadMedia } = usePosts(undefined, undefined, false);

  const handleSave = () => {
    toast.success('Post saved');
    navigate(ROUTES.POSTS);
  };

  const handleCancel = () => {
    navigate(ROUTES.POSTS);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors text-sm animate-fade-up"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </button>

      <div className="animate-fade-up stagger-1">
        <PostEditor
          postId={postId}
          onSave={handleSave}
          onCancel={handleCancel}
          onUploadMedia={uploadMedia}
        />
      </div>
    </div>
  );
}
