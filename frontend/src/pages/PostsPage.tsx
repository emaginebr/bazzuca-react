import { useState } from 'react';
import { PostList, PostCalendar, useClients } from 'bazzuca-react';
import type { PostInfo } from 'bazzuca-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { toast } from 'sonner';
import { Calendar, List, MessageSquare } from 'lucide-react';

export default function PostsPage() {
  const navigate = useNavigate();
  const { clients } = useClients();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const handleEdit = (post: PostInfo) => { navigate(ROUTES.POSTS_EDIT(post.postId)); };
  const handleView = (post: PostInfo) => { navigate(ROUTES.POSTS_VIEW(post.postId)); };
  const handlePublish = () => { toast.success('Post published successfully'); };
  const handleCreate = () => { navigate(ROUTES.POSTS_NEW); };
  const handlePostClick = (post: PostInfo) => { navigate(ROUTES.POSTS_VIEW(post.postId)); };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-rose-500 flex items-center justify-center shadow-lg shadow-brand-secondary/20">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Posts</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              Manage and schedule your social media posts
            </p>
          </div>

          <div className="flex items-center gap-1 glass rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-4 animate-fade-up stagger-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Client
          </label>
          <select
            value={selectedClientId || ''}
            onChange={(e) => setSelectedClientId(e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 text-sm glass rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client.clientId} value={client.clientId}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {viewMode === 'calendar' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Month
            </label>
            <input
              type="month"
              value={`${year}-${month.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [y, m] = e.target.value.split('-');
                setYear(Number(y));
                setMonth(Number(m));
              }}
              className="px-3 py-2 text-sm glass rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
        )}
      </div>

      <div className="animate-fade-up stagger-2">
        {viewMode === 'list' ? (
          <PostList
            month={month}
            year={year}
            clientId={selectedClientId}
            onEdit={handleEdit}
            onView={handleView}
            onPublish={handlePublish}
            onCreate={handleCreate}
            showCreateButton={true}
          />
        ) : (
          <PostCalendar
            month={month}
            year={year}
            clientId={selectedClientId}
            onPostClick={handlePostClick}
          />
        )}
      </div>
    </div>
  );
}
