import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X } from 'lucide-react';
import { MetaPreview, GoogleAdsPreview, TikTokPreview, LinkedInPreview } from './PlatformPreviewsNative';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface EditablePlatformPreviewProps {
  platform: 'meta' | 'google' | 'tiktok' | 'linkedin';
  headline: string;
  description: string;
  cta: string;
  imageUrl?: string;
  businessName?: string;
  websiteUrl?: string;
  onUpdate?: (updates: { headline: string; description: string; cta: string }) => void;
}

export const EditablePlatformPreview: React.FC<EditablePlatformPreviewProps> = ({
  platform,
  headline: initialHeadline,
  description: initialDescription,
  cta: initialCta,
  imageUrl,
  businessName,
  websiteUrl,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(initialHeadline);
  const [description, setDescription] = useState(initialDescription);
  const [cta, setCta] = useState(initialCta);

  const handleSave = () => {
    onUpdate?.({
      headline,
      description,
      cta,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setHeadline(initialHeadline);
    setDescription(initialDescription);
    setCta(initialCta);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-emerald-500/20 shadow-xl"
      >
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Editar Anuncio para {platform.toUpperCase()}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Titular
            </label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ingresa el titular del anuncio"
              maxLength={platform === 'google' ? 30 : 60}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {headline.length} / {platform === 'google' ? 30 : 60} caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingresa la descripción del anuncio"
              maxLength={platform === 'google' ? 90 : 150}
              rows={3}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length} / {platform === 'google' ? 90 : 150} caracteres
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Botón de Acción (CTA)
            </label>
            <Input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Ej: Comprar Ahora, Saber Más"
              maxLength={20}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {cta.length} / 20 caracteres
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              Guardar Cambios
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Botón de edición flotante */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 z-10 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-all hover:scale-110"
        title="Editar anuncio"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {/* Preview según plataforma */}
      {platform === 'meta' && (
        <MetaPreview
          headline={headline}
          description={description}
          cta={cta}
          imageUrl={imageUrl}
          businessName={businessName}
          websiteUrl={websiteUrl}
        />
      )}
      {platform === 'google' && (
        <GoogleAdsPreview
          headline={headline}
          description={description}
          cta={cta}
          imageUrl={imageUrl}
          businessName={businessName}
          websiteUrl={websiteUrl}
        />
      )}
      {platform === 'tiktok' && (
        <TikTokPreview
          headline={headline}
          description={description}
          cta={cta}
          imageUrl={imageUrl}
          businessName={businessName}
        />
      )}
      {platform === 'linkedin' && (
        <LinkedInPreview
          headline={headline}
          description={description}
          cta={cta}
          imageUrl={imageUrl}
          businessName={businessName}
        />
      )}
    </motion.div>
  );
};
