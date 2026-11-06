import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelected, onError, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      validateAndSelect(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      validateAndSelect(files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    // 验证文件类型
    const allowedExtensions = /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i;
    if (!allowedExtensions.test(file.name)) {
      onError('不支持的文件格式');
      return;
    }

    // 验证文件大小（限制 500MB）
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('文件大小超过限制 (MAX 500MB)');
      return;
    }

    onFileSelected(file);
  };

  return (
    <div
      className={`relative border-4 border-dashed p-10 text-center transition-all duration-100 cursor-pointer group ${
        disabled
          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : dragActive
            ? 'border-purple-600 bg-purple-50 translate-y-[-4px] shadow-[8px_8px_0px_0px_rgba(139,92,246,1)]'
            : 'border-black bg-white hover:border-purple-600 hover:bg-purple-50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="space-y-4">
        <div className={`w-16 h-16 mx-auto flex items-center justify-center transition-colors ${
          dragActive ? 'bg-purple-600 text-white' : 'bg-black text-white group-hover:bg-purple-600'
        }`}>
          <Upload size={32} strokeWidth={3} />
        </div>
        
        <div>
          <p className="text-lg font-display font-bold text-black">
            {dragActive ? '释放文件' : '点击或拖拽上传'}
          </p>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-2">
            MP4, MOV, AVI, WEBM • MAX 500MB
          </p>
        </div>
      </div>
    </div>
  );
}
