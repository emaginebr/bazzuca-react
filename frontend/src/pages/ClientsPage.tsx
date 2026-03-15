import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientList, ClientModal, useClients } from 'bazzuca-react';
import type { ClientInfo } from 'bazzuca-react';
import { toast } from 'sonner';
import { ROUTES } from '../lib/constants';
import { Users } from 'lucide-react';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | undefined>(undefined);
  const { refreshClients } = useClients();

  const handleCreate = () => {
    setSelectedClient(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (client: ClientInfo) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleView = (client: ClientInfo) => {
    navigate(ROUTES.CLIENT_NETWORKS(client.clientId));
  };

  const handleDelete = async () => {
    toast.success('Client deleted successfully');
    await refreshClients();
  };

  const handleSave = async () => {
    toast.success(selectedClient ? 'Client updated' : 'Client created');
    setIsModalOpen(false);
    setSelectedClient(undefined);
    await refreshClients();
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedClient(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-violet-600 flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <Users className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Manage your social media clients and their networks
        </p>
      </div>

      <div className="animate-fade-up stagger-1">
        <ClientList
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onView={handleView}
          showCreateButton={true}
        />
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleClose}
        client={selectedClient}
        onSave={handleSave}
      />
    </div>
  );
}
