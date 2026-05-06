import React, { useState } from 'react';
import { ToolLayout } from './ToolLayout';
import { Upload, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImageToolProps {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  promptTemplate: () => string;
  placeholder: string;
  actionLabel: string;
  onProcess?: () => Promise<boolean>;
}

export const ImageTool: React.FC<ImageToolProps> = ({ id, name, description, icon, color, promptTemplate, placeholder, actionLabel, onProcess }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    // Mock upload
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');
  };

  const handleProcess = async () => {
    if (!image) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ToolLayout title={name} description={description} icon={icon} color={color}>
      <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-app-border rounded-3xl p-12 text-center group hover:border-orange-500/50 transition-all bg-app-fg/5">
        {!image ? (
          <div onClick={handleUpload} className="cursor-pointer space-y-4">
            <div className="w-16 h-16 bg-app-fg/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform text-app-muted">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-app-fg">{placeholder}</p>
            <p className="text-xs text-app-muted font-medium">PNG, JPG ou WEBP jusqu'à 10MB</p>
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-md">
            <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-2xl shadow-xl" />
            <button
              onClick={handleProcess}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center gap-3 hover:bg-orange-600 transition-all"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
              {loading ? 'Traitement...' : actionLabel}
            </button>
            <button onClick={() => setImage(null)} className="text-xs font-bold text-app-muted hover:text-app-fg">Changer d'image</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
