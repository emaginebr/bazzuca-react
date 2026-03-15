import { PostCalendar, useClients } from 'bazzuca-react';
import type { PostInfo } from 'bazzuca-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { clients } = useClients();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(undefined);

  const handlePostClick = (post: PostInfo) => {
    navigate(ROUTES.POSTS_VIEW(post.postId));
  };

  const handlePreviousMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else { setMonth(month - 1); }
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else { setMonth(month + 1); }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-accent/20">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          View and manage your scheduled posts
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between animate-fade-up stagger-1">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousMonth}
            className="p-2 glass rounded-lg hover:bg-white/[0.08] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <h2 className="text-lg font-bold text-foreground min-w-[180px] text-center">
            {monthName}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 glass rounded-lg hover:bg-white/[0.08] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

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
      </div>

      <div className="animate-fade-up stagger-2">
        <PostCalendar
          month={month}
          year={year}
          clientId={selectedClientId}
          onPostClick={handlePostClick}
        />
      </div>
    </div>
  );
}
