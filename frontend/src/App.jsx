import React, { useState } from 'react';

// Icons setup (cleaner paths)
const Icons = {
  Upload: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
  ),
  Decision: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  ActionItem: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h2.243a2 2 0 011.566.75l2.748 3.435A2 2 0 0011.123 18h1.754a2 2 0 001.566-.75l2.748-3.435A2 2 0 0118.757 13H21m-9-4v4m0 0l3-3m-3 3l-3-3" /></svg>
  ),
  Risk: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  )
};

export default function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outcomes, setOutcomes] = useState([]);

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
//Api call to backend
      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setOutcomes(data.outcomes);
      alert('Analysis Complete!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading. Is the backend running?');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderIcon = (type) => {
    switch(type) {
      case "Decision": return <Icons.Decision className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />;
      case "Action Item": return <Icons.ActionItem className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />;
      case "Risk": return <Icons.Risk className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />;
      default: return null;
    }
  };

  const getBadgeStyle = (type) => {
    switch(type) {
      case "Decision": return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
      case "Action Item": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "Risk": return "bg-rose-500/10 text-rose-300 border-rose-500/20";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getCardBorder = (type) => {
    switch(type) {
      case "Decision": return "hover:border-indigo-500/50";
      case "Action Item": return "hover:border-emerald-500/50";
      case "Risk": return "hover:border-rose-500/50";
      default: return "hover:border-slate-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Absolute background effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-10 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Meeting Outcome Generator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Export JSON</button>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-xs font-semibold text-slate-300">AD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-10">
        
        {/* Upload Section */}
        <section className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-10 flex flex-col items-center justify-center transition-all duration-500 hover:bg-slate-900/80 hover:shadow-[0_0_40px_rgba(99,102,241,0.05)]">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse-slow"></div>
            <div className="relative w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Icons.Upload className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-3">Upload Meeting Transcript</h2>
          <p className="text-sm text-slate-400 mb-8 text-center max-w-lg leading-relaxed">
            Upload your audio or text file. Our local Llama 3.2 model will intelligently extract key decisions, assign action items, and flag potential risks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer bg-slate-800/50 border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:border-slate-600 transition-all">
              <span>{file ? 'Change File' : 'Choose File'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".txt,.md,.mp3,.wav" />
            </label>
            <button 
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !file || isProcessing 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-500'
              }`}
            >
              {isProcessing ? 'Processing AI...' : 'Analyze Meeting'}
            </button>
          </div>
          {file && (
            <div className="mt-6 flex items-center space-x-2 text-sm text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="font-medium truncate max-w-xs">{file.name}</span>
            </div>
          )}
        </section>

        {/* Dashboard Section */}
        {outcomes.length > 0 && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                Extracted Outcomes
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {outcomes.length} Items
                </span>
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/5 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:bg-slate-900/80 group ${getCardBorder(item.type)} animate-fade-in-up`}
                  style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(item.type)}`}>
                      {item.type}
                    </span>
                    <div className="transform transition-transform duration-500 group-hover:scale-110">
                      {renderIcon(item.type)}
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.owner && (
                    <div className="flex items-center mt-auto pt-5 border-t border-white/5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-bold text-indigo-300 border border-slate-700 mr-3 shadow-inner">
                        {item.owner.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-400">Assigned to <span className="text-slate-200">{item.owner}</span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
