import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocialNetworkList, SocialNetworkModal, useClients } from 'bazzuca-react';
import type { SocialNetworkInfo } from 'bazzuca-react';
import { toast } from 'sonner';
import { ArrowLeft, Globe } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export default function ClientNetworksPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = id ? parseInt(id, 10) : 0;

  const { clients } = useClients();
  const client = clients.find(c => c.clientId === clientId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetworkInfo | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleCreate = () => { setSelectedNetwork(undefined); setIsModalOpen(true); };
  const handleEdit = (network: SocialNetworkInfo) => { setSelectedNetwork(network); setIsModalOpen(true); };
  const handleDelete = () => { toast.success('Social network deleted'); triggerRefresh(); };
  const handleSave = () => {
    toast.success(selectedNetwork ? 'Network updated' : 'Network added');
    setIsModalOpen(false);
    setSelectedNetwork(undefined);
    triggerRefresh();
  };
  const handleClose = () => { setIsModalOpen(false); setSelectedNetwork(undefined); };
  const handleBack = () => { navigate(ROUTES.CLIENTS); };

  if (!client) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-up">
        <button onClick={handleBack} className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </button>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">Client not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={handleBack} className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors text-sm animate-fade-up">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </button>

      <div className="mb-8 animate-fade-up stagger-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-rose-500 flex items-center justify-center shadow-lg shadow-brand-secondary/20">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {client.name}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Manage social network accounts
        </p>
      </div>

      <div className="animate-fade-up stagger-2">
        <SocialNetworkList
          clientId={clientId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          showCreateButton={true}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <SocialNetworkModal
        isOpen={isModalOpen}
        onClose={handleClose}
        clientId={clientId}
        network={selectedNetwork}
        onSave={handleSave}
      />
    </div>
  );
}
