import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Check, RotateCcw } from 'lucide-react';

interface PhotoCropperProps {
  src: string;
  onSave: (croppedDataUrl: string) => void;
  onCancel: () => void;
  aspect?: number; // width/height ratio, default 1 (square)
}

export default function PhotoCropper({ src, onSave, onCancel, aspect = 1 }: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const PREVIEW_SIZE = 300;

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    };
    img.src = src;
  }, [src]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = PREVIEW_SIZE;
    canvas.width = size;
    canvas.height = size / aspect;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale image to fill the crop area at current zoom
    const baseScale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const scale = baseScale * zoom;

    const scaledW = img.width * scale;
    const scaledH = img.height * scale;

    // Center + offset
    const x = (canvas.width - scaledW) / 2 + offset.x;
    const y = (canvas.height - scaledH) / 2 + offset.y;

    ctx.drawImage(img, x, y, scaledW, scaledH);

    // Overlay circle clip
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(canvas.width, canvas.height) / 2;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [imgLoaded, zoom, offset, aspect]);

  useEffect(() => { draw(); }, [draw]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(0.5, z - e.deltaY * 0.001)));
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Export full resolution crop
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600 / aspect;
    const ctx = exportCanvas.getContext('2d');
    const img = imgRef.current;
    if (!ctx || !img) return;

    const baseScale = Math.max(exportCanvas.width / img.width, exportCanvas.height / img.height);
    const scale = baseScale * zoom;
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const x = (exportCanvas.width - scaledW) / 2 + (offset.x * exportCanvas.width / PREVIEW_SIZE);
    const y = (exportCanvas.height - scaledH) / 2 + (offset.y * exportCanvas.height / (PREVIEW_SIZE / aspect));
    ctx.drawImage(img, x, y, scaledW, scaledH);

    onSave(exportCanvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl overflow-hidden w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <button onClick={onCancel} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <h3 className="text-white font-semibold">Crop Photo</h3>
          <button onClick={handleSave} className="text-pink-400 hover:text-pink-300 font-bold transition-colors flex items-center gap-1">
            <Check size={18} /> Done
          </button>
        </div>

        {/* Canvas crop area */}
        <div className="relative bg-black flex items-center justify-center" style={{ height: 320 }}>
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '33.33% 33.33%',
            zIndex: 2
          }} />
          {/* Circle guide */}
          <div className="absolute rounded-full border-2 border-white/40 pointer-events-none" style={{ width: 280, height: 280, zIndex: 3 }} />

          <canvas
            ref={canvasRef}
            className="rounded-full"
            style={{ width: 280, height: 280, cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none', zIndex: 1 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <ZoomOut size={18} className="text-white/50 flex-shrink-0" />
            <input
              type="range" min="50" max="400" value={zoom * 100}
              onChange={e => setZoom(parseInt(e.target.value) / 100)}
              className="flex-1 h-1.5 rounded-full appearance-none bg-white/20"
              style={{ accentColor: '#ec4899' }}
            />
            <ZoomIn size={18} className="text-white/50 flex-shrink-0" />
          </div>
          <p className="text-white/40 text-xs text-center">Drag to reposition • Pinch or scroll to zoom</p>
        </div>
      </div>
    </div>
  );
}
