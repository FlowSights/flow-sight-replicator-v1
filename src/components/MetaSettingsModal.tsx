import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { metaApi, MetaAdAccount } from '@/lib/meta-api';
import { CheckCircle2, AlertCircle, Settings2, Key, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MetaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaSettingsModal: React.FC<MetaSettingsModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState(localStorage.getItem('meta_access_token') || '');
  const [accounts, setAccounts] = useState<MetaAdAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(localStorage.getItem('meta_ad_account_id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('meta_access_token'));

  const handleFetchAccounts = async () => {
    if (!token) {
      toast.error('Por favor ingresa un Access Token');
      return;
    }

    setIsLoading(true);
    try {
      const data = await metaApi.getAdAccounts(token);
      setAccounts(data);
      localStorage.setItem('meta_access_token', token);
      setIsConnected(true);
      toast.success('Token validado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al validar el token');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    localStorage.setItem('meta_ad_account_id', accountId);
    toast.success('Cuenta publicitaria seleccionada');
  };

  const handleDisconnect = () => {
    localStorage.removeItem('meta_access_token');
    localStorage.removeItem('meta_ad_account_id');
    setToken('');
    setAccounts([]);
    setSelectedAccountId('');
    setIsConnected(false);
    toast.info('Meta desconectado');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#080808] border border-white/10 rounded-[32px] overflow-hidden p-0">
        <div className="bg-gradient-to-br from-[#0668E1] to-[#0047AB] p-8">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Settings2 className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-wider">Integración Meta</DialogTitle>
            </div>
            <DialogDescription className="text-white/70 font-medium">
              Conecta tu cuenta para publicar anuncios directamente desde Flowsight.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          {/* Token Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-500">System Access Token</Label>
              {isConnected && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase">
                  <CheckCircle2 size={12} /> Conectado
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="password"
                  placeholder="EAA..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-white/5 border-white/10 pl-10 h-12 text-white placeholder:text-gray-600 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleFetchAccounts} 
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white h-12 px-6 rounded-xl border border-white/10"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validar'}
              </Button>
            </div>
          </div>

          {/* Account Selection */}
          {isConnected && accounts.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Seleccionar Cuenta Publicitaria</Label>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleSaveAccount(acc.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                      selectedAccountId === acc.id
                        ? 'bg-[#0668E1]/10 border-[#0668E1] text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className={selectedAccountId === acc.id ? 'text-[#0668E1]' : 'text-gray-500'} size={18} />
                      <div>
                        <p className="text-sm font-black tracking-tight">{acc.name}</p>
                        <p className="text-[10px] opacity-50">ID: {acc.account_id}</p>
                      </div>
                    </div>
                    {selectedAccountId === acc.id && <CheckCircle2 size={16} className="text-[#0668E1]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {!isConnected && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
                Asegúrate de que tu token tenga los permisos <b>ads_management</b> y <b>ads_read</b> activados en el portal de desarrolladores de Meta.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {isConnected && (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="flex-1 bg-transparent border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
              >
                Desconectar
              </Button>
            )}
            <Button 
              onClick={onClose}
              className="flex-1 bg-white text-black hover:bg-gray-200 rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
