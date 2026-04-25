import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Bookmark } from 'lucide-react';

interface PreviewProps {
  headline: string;
  description: string;
  cta: string;
  imageUrl?: string;
  platform: 'meta' | 'tiktok' | 'linkedin' | 'google';
}

export const MetaPreview: React.FC<PreviewProps> = ({ headline, description, cta, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">FlowSights</p>
            <p className="text-xs text-gray-500">Patrocinado</p>
          </div>
        </div>
        <span className="text-gray-500">•••</span>
      </div>

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Ad"
          className="w-full h-64 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{headline}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{description}</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
          {cta}
        </button>
      </div>

      {/* Interactions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-between text-gray-600 dark:text-gray-400">
        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-sm">123</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">45</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-500 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export const TikTokPreview: React.FC<PreviewProps> = ({ headline, description, cta, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto aspect-video relative"
    >
      {/* Video Background */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="TikTok Ad"
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
        <h3 className="font-bold text-white text-lg mb-2">{headline}</h3>
        <p className="text-sm text-white/90 mb-3">{description}</p>
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full w-fit transition-colors">
          {cta}
        </button>
      </div>

      {/* Side Controls */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-6 text-white">
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <Heart className="w-6 h-6" />
          <span className="text-xs">234</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs">89</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <Share2 className="w-6 h-6" />
          <span className="text-xs">56</span>
        </button>
      </div>
    </motion.div>
  );
};

export const LinkedInPreview: React.FC<PreviewProps> = ({ headline, description, cta, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto border border-gray-200 dark:border-gray-800"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">FlowSights</p>
            <p className="text-xs text-gray-500">Patrocinado</p>
          </div>
        </div>
        <span className="text-gray-500">•••</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{headline}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{description}</p>
      </div>

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="LinkedIn Ad"
          className="w-full h-48 object-cover"
        />
      )}

      {/* CTA */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors">
          {cta}
        </button>
      </div>

      {/* Interactions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex justify-between text-gray-600 dark:text-gray-400 text-sm">
        <button className="hover:text-blue-600 transition-colors">👍 234</button>
        <button className="hover:text-blue-600 transition-colors">💬 45</button>
        <button className="hover:text-blue-600 transition-colors">↗️ 12</button>
      </div>
    </motion.div>
  );
};

export const GoogleAdsPreview: React.FC<PreviewProps> = ({ headline, description, cta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto border border-gray-200 dark:border-gray-800 p-4"
    >
      {/* Search Result Style */}
      <div className="space-y-3">
        {/* URL */}
        <p className="text-sm text-green-600 dark:text-green-400">flowsights.com › ads</p>

        {/* Headline */}
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
          {headline}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>

        {/* Extensions */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{cta}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Envío Gratis</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Garantía 100%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
