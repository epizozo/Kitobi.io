import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Download, RefreshCw, CheckCircle2, AlertCircle, FileUp, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '../../lib/utils';
import { DropzoneOptions } from 'react-dropzone';

interface WordToPdfConverterProps {
  onProcess: () => void;
}

export const WordToPdfConverter: React.FC<WordToPdfConverterProps> = ({ onProcess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.docx')) {
      setError('Veuillez sélectionner un fichier .docx valide.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setPreviewHtml(null);

    try {
      setProcessing(true);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await (mammoth as any).convertToHtml({ arrayBuffer });
      setPreviewHtml(result.value);
    } catch (err) {
      setError('Erreur lors de la lecture du fichier Word.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const dropzoneOptions: any = {
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const convertToPdf = async () => {
    if (!previewHtml) return;

    try {
      setProcessing(true);
      const element = document.getElementById('pdf-preview-content');
      if (!element) throw new Error('Preview element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${file?.name.replace('.docx', '') || 'document'}.pdf`);
      
      onProcess();
      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de la génération du PDF.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Word vers PDF</h2>
        <p className="text-gray-400">Convertissez vos documents .docx en PDF professionnel instantanément.</p>
      </div>

      {!file ? (
        <div 
          {...getRootProps()} 
          className={cn(
            "relative aspect-[16/9] rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer group overflow-hidden flex flex-col items-center justify-center gap-6",
            isDragActive ? "border-blue-500 bg-blue-500/5" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
          )}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-bold">Déposez votre fichier Word</p>
            <p className="text-sm text-gray-500">Uniquement les fichiers .docx sont supportés</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-bold truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {previewHtml && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Aperçu du document</h3>
                <button
                  onClick={convertToPdf}
                  disabled={processing}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all",
                    processing 
                      ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                      : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                  )}
                >
                  {processing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileDown className="w-5 h-5" />
                  )}
                  {processing ? 'Conversion...' : 'Télécharger en PDF'}
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-white/10 overflow-hidden">
                <div 
                  id="pdf-preview-content"
                  className="prose prose-sm max-w-none text-black bg-white p-8 min-h-[400px]"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-500"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Document converti avec succès !</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
