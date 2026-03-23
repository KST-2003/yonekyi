import React, { useState, useRef } from 'react';
import { Camera, Link as LinkIcon, X, Plus, GripVertical } from 'lucide-react';
import PhotoCropper from './PhotoCropper';

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  min?: number;
  max?: number;
}

export default function PhotoUpload({ photos, onChange, min = 0, max = 6 }: PhotoUploadProps) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropSave = (dataUrl: string) => {
    onChange([...photos, dataUrl]);
    setCropSrc(null);
  };

  const handleUrlAdd = () => {
    const url = urlInput.trim();
    if (!url) return;
    setCropSrc(url);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const remove = (i: number) => onChange(photos.filter((_, j) => j !== i));

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...photos];
    [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
    onChange(arr);
  };

  return (
    <>
      {cropSrc && <PhotoCropper src={cropSrc} onSave={handleCropSave} onCancel={() => setCropSrc(null)} />}

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          <span className={`font-bold ${photos.length < (min||0) ? 'text-red-400' : 'text-gray-700'}`}>{photos.length}</span>/{max} photos
          {min > 0 && photos.length < min && <span className="text-red-400 ml-1">(min {min} required)</span>}
        </p>
        {photos.length > 0 && <p className="text-xs text-gray-400">First photo is your main photo</p>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {photos.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <div className="absolute bottom-1.5 left-1.5 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Main</div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <button onClick={() => remove(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full items-center justify-center hidden group-hover:flex text-white hover:bg-red-500 transition-colors">
              <X size={11} />
            </button>
            {i > 0 && (
              <button onClick={() => moveUp(i)}
                className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/70 rounded-full items-center justify-center hidden group-hover:flex text-white text-[10px] font-bold hover:bg-blue-500 transition-colors">
                ↑
              </button>
            )}
          </div>
        ))}

        {photos.length < max && (
          <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
            {showUrlInput ? (
              <div className="p-2 w-full space-y-1.5">
                <input className="w-full text-xs border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  placeholder="Paste image URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUrlAdd()} autoFocus />
                <div className="flex gap-1">
                  <button onClick={handleUrlAdd} className="flex-1 text-xs bg-pink-500 text-white rounded-lg py-1 font-semibold">Add</button>
                  <button onClick={() => setShowUrlInput(false)} className="flex-1 text-xs border border-gray-200 rounded-lg py-1 text-gray-500">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => fileRef.current?.click()}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>
                  <Camera size={18} className="text-white" />
                </button>
                <button onClick={() => setShowUrlInput(true)} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600">
                  <LinkIcon size={9} /> URL
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {photos.length === 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">Tap camera to upload • Or paste an image URL</p>
      )}
    </>
  );
}
