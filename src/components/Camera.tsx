import React, { useState, useEffect, useRef } from 'react';
import { Camera as CameraIcon, X, Check, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeFoodImage } from '../services/gemini';
import { FoodItem } from '../types';

interface CameraProps {
  onCapture: (food: FoodItem) => void;
  onClose: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please ensure permissions are granted.');
      console.error(err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const base64 = capturedImage.split(',')[1];
      const nutrition = await analyzeFoodImage(base64);
      
      const newFood: FoodItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: nutrition.name || 'Unknown Food',
        calories: nutrition.calories || 0,
        protein: nutrition.protein || 0,
        carbs: nutrition.carbs || 0,
        fat: nutrition.fat || 0,
        timestamp: Date.now(),
        imageUrl: capturedImage,
      };
      
      onCapture(newFood);
      onClose();
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {!capturedImage ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={capturedImage} 
            className="w-full h-full object-cover" 
            alt="Captured food"
          />
        )}

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>

        {error && (
          <div className="absolute top-20 left-6 right-6 p-4 bg-red-500/80 backdrop-blur-md rounded-xl text-white text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="h-40 bg-zinc-900 flex items-center justify-center px-8 relative">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div 
              key="capture-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-12"
            >
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <ImageIcon size={24} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">Gallery</span>
              </button>

              <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
              >
                <CameraIcon size={32} />
              </button>

              <div className="w-14" /> {/* Spacer to balance gallery button */}
            </motion.div>
          ) : (
            <motion.div 
              key="actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-12"
            >
              <button
                onClick={() => setCapturedImage(null)}
                className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <div className="w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center">
                  <RefreshCw size={24} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">Retake</span>
              </button>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex flex-col items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50"
              >
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  {isAnalyzing ? (
                    <RefreshCw className="animate-spin" size={32} />
                  ) : (
                    <Check size={32} />
                  )}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">
                  {isAnalyzing ? 'Analyzing...' : 'Confirm'}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileSelect}
      />
    </motion.div>
  );
};
