import { useState, useRef } from 'react';
import { uploadDataset } from '../services/api.js';

const UploadCard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selected = event.target.files[0] || null;
    setFile(selected);
    setMessage(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.name.endsWith('.pdf'))) {
      setFile(dropped);
      setMessage(null);
      setError(null);
    } else {
      setError('Please drop a valid CSV or PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }
    setIsUploading(true);
    setMessage(null);
    setError(null);
    try {
      const result = await uploadDataset(file);
      setMessage(`✓ Dataset "${file.name}" uploaded successfully`);
      if (onUploadSuccess) onUploadSuccess(result);
    } catch (err) {
      console.error(err);
      setError('Failed to upload dataset. Please check the backend and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="glass-card rounded-2xl p-6 transition-all duration-300 animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan/20 to-brand-500/20 text-neon-cyan">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Upload Dataset
          </h2>
          <p className="text-xs text-slate-500">
            Import historical market data (CSV/PDF) for backtesting
          </p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
          isDragging
            ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_30px_rgba(0,212,255,0.1)]'
            : file
            ? 'border-neon-green/40 bg-neon-green/5'
            : 'border-slate-700/50 bg-navy-900/40 hover:border-brand-500/40 hover:bg-navy-850/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,.pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10">
              <svg className="h-5 w-5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-mono text-sm font-medium text-neon-green">{file.name}</span>
            <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="h-8 w-8 text-slate-600 transition-colors group-hover:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-brand-400">Click to browse</span> or drag and drop
            </p>
            <p className="text-[10px] text-slate-600">CSV or PDF files only</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs">
          {message && (
            <p className="flex items-center gap-1.5 text-neon-green">
              <span className="status-dot bg-neon-green shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
              {message}
            </p>
          )}
          {error && (
            <p className="flex items-center gap-1.5 text-rose-400">
              <span className="status-dot bg-rose-400" />
              {error}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="btn-neon px-5 py-2.5 text-xs shadow-neon"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </span>
          ) : (
            'Upload File'
          )}
        </button>
      </div>
    </section>
  );
};

export default UploadCard;
