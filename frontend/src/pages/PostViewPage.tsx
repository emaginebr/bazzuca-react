import { useParams, useNavigate } from 'react-router-dom';
import { PostViewer } from 'bazzuca-react';
import type { PostInfo } from 'bazzuca-react';
import { ROUTES } from '../lib/constants';
import { toast } from 'sonner';

export default function PostViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleEdit = (post: PostInfo) => { navigate(ROUTES.POSTS_EDIT(post.postId)); };
  const handlePublish = () => { toast.success('Post published'); };
  const handleBack = () => { navigate(ROUTES.POSTS); };

  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <PostViewer
        postId={id ? Number(id) : undefined}
        onEdit={handleEdit}
        onPublish={handlePublish}
        onBack={handleBack}
      />
    </div>
  );
}
