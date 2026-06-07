/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { INITIAL_NGOS_DATABASE } from './ngosData.ts';
import { NGO, HomeworkSubmission } from './types.ts';
import MetricsVisualizer from './components/MetricsVisualizer.tsx';
import NgosGrid from './components/NgosGrid.tsx';
import NgoDetailModal from './components/NgoDetailModal.tsx';
import AiAssistant from './components/AiAssistant.tsx';
import HomeworkTracker from './components/HomeworkTracker.tsx';
import { Building2, Sparkles, Clock, Compass, FileSpreadsheet, Heart, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Load initial NGOs list from localStorage if exists, default to core database
  const [ngos, setNgos] = useState<NGO[]>(() => {
    const saved = localStorage.getItem('india_ngos_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved NGO records", e);
      }
    }
    return INITIAL_NGOS_DATABASE;
  });

  // Load homework status tracker from localStorage
  const [submission, setSubmission] = useState<HomeworkSubmission>(() => {
    const saved = localStorage.getItem('india_ngos_submission');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved submission data", e);
      }
    }
    return {
      driveFolderUrl: '',
      linkedInPostUrl: '',
      driveConfirmed: false,
      linkedInConfirmed: false,
      screenshotConfirmed: false,
    };
  });

  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'directory' | 'ai' | 'portfolio'>('directory');

  // Sync utilities
  const saveNgosList = (newList: NGO[]) => {
    setNgos(newList);
    localStorage.setItem('india_ngos_db', JSON.stringify(newList));
  };

  const handleUpdateSubmissionValue = (updatedFields: Partial<HomeworkSubmission>) => {
    const newSubmission = { ...submission, ...updatedFields };
    setSubmission(newSubmission);
    localStorage.setItem('india_ngos_submission', JSON.stringify(newSubmission));
  };

  // Add / Scout import callback
  const handleAddNgo = (newNgoData: Omit<NGO, 'id' | 'isCustom'>) => {
    const genericId = `ngo-custom-${Date.now()}`;
    const completeNgo: NGO = {
      ...newNgoData,
      id: genericId,
      isCustom: true,
    };
    const updatedList = [completeNgo, ...ngos];
    saveNgosList(updatedList);
  };

  // Save private notes edits
  const handleSaveNotes = (id: string, notes: string) => {
    const updatedList = ngos.map((item) => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    saveNgosList(updatedList);
    // Sync current visual detail if open
    if (selectedNgo && selectedNgo.id === id) {
      setSelectedNgo({ ...selectedNgo, notes });
    }
  };

  // Delete custom collected item
  const handleDeleteNgo = (id: string) => {
    const updatedList = ngos.filter((item) => item.id !== id);
    saveNgosList(updatedList);
  };

  // Reset registry completely to curated 10
  const handleResetRegistry = () => {
    if (confirm("Are you sure you want to reset your NGO index? All custom entries and research annotations will be cleared and reset to the 10 preloaded NGOs.")) {
      saveNgosList(INITIAL_NGOS_DATABASE);
      handleUpdateSubmissionValue({
        driveFolderUrl: '',
        linkedInPostUrl: '',
        driveConfirmed: false,
        linkedInConfirmed: false,
        screenshotConfirmed: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Visual background decor element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-slate-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Primary Header */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur" id="workspace-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full select-none">
                  Analytical Registry
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-1 animate-fade-in">
                <span className="text-emerald-400 font-black">SevaSetu:</span> NGO Research Study & Data Collection
              </h1>
            </div>
          </div>

        </div>
      </header>

      {/* Research Portal Guidance Bar */}
      <section className="bg-slate-900/40 border-b border-slate-900" id="task-directions-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl font-sans">
            <strong>SevaSetu Research Initiative:</strong> Research and compile verified insights on 10 active social sector NGOs in India (including Education, Animal Welfare, Healthcare, Women Empowerment, and Environmental Conservation). Organize profiles and view analytics.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              className="px-2.5 py-1 text-[10px] rounded border border-red-900/30 text-red-450 bg-red-950/10 hover:bg-red-950/20 cursor-pointer flex items-center gap-1 transition-all font-semibold uppercase shrink-0"
              onClick={handleResetRegistry}
              id="reset-workspace-data"
            >
              <RefreshCw className="w-3 h-3 shrink-0" />
              Reset Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
        
        {/* Dynamic Analytics & Gauge Widget */}
        <MetricsVisualizer ngos={ngos} />

        {/* Workspace Central Controller tab bar */}
        <div className="flex bg-slate-900/50 p-1 border border-slate-850 rounded-2xl max-w-md" id="workspace-primary-tabs">
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'directory' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-450 hover:text-white'
            }`}
            onClick={() => setActiveWorkspaceTab('directory')}
          >
            <Layers className="w-3.5 h-3.5" />
            NGO Directory
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'ai' 
                ? 'bg-slate-800 text-amber-300 shadow-lg' 
                : 'text-slate-450 hover:text-amber-100'
            }`}
            onClick={() => setActiveWorkspaceTab('ai')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Research
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-xs font-mono font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeWorkspaceTab === 'portfolio' 
                ? 'bg-slate-800 text-teal-400 shadow-lg' 
                : 'text-slate-450 hover:text-teal-200'
            }`}
            onClick={() => setActiveWorkspaceTab('portfolio')}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            File Exporter
          </button>
        </div>

        {/* CONDITIONAL TAB RENDER */}
        <div className="transition-all duration-300">
          
          {/* TAB 1: REGULAR SPREADSHEET DIRECTORY */}
          {activeWorkspaceTab === 'directory' && (
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-blue-900/10 to-teal-900/10 border border-slate-850 p-5 rounded-2xl mb-2">
                <span className="text-[10px] font-mono uppercase font-black text-blue-400 tracking-widest">Active Database View</span>
                <h3 className="text-base font-bold text-white mt-1">Indian NGO Social Repository</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Filter sectors and click "Inspect Research" to review deep dossiers or add custom hand-collected records you researched on other platforms.
                </p>
              </div>
              <NgosGrid 
                ngos={ngos} 
                onAddNgo={handleAddNgo} 
                onSelectNgo={setSelectedNgo} 
              />
            </div>
          )}

          {/* TAB 2: AI ASSIGNMENT SCOUT & ASSISTANCE */}
          {activeWorkspaceTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-900/10 to-orange-900/10 border border-slate-850 p-5 rounded-2xl">
                <span className="text-[10px] font-mono uppercase font-black text-amber-400 tracking-widest">AI Assisted Scouting Portal</span>
                <h3 className="text-base font-bold text-white mt-1">Deep Social-Impact Scouting</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Don't start query searches from scratch! Enter an Indian developmental goal, region, or keyword, and let the Gemini model retrieve compatible profiles to instantly add to your registry.
                </p>
              </div>
              <AiAssistant 
                onImportNgo={handleAddNgo} 
                existingNgoNames={ngos.map((item) => item.name)} 
              />
            </div>
          )}

          {/* TAB 3: LOCAL STORAGE / FILE EXPORTER WORKSPACE */}
          {activeWorkspaceTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-900/10 to-emerald-900/10 border border-slate-850 p-5 rounded-2xl">
                <span className="text-[10px] font-mono uppercase font-black text-teal-400 tracking-widest">Excel / Sheet Compilation Tool</span>
                <h3 className="text-base font-bold text-white mt-1">Download and Submission Center</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Format collected data for spreadsheet compatibility. Verify steps, complete LinkedIn tags, and upload links to finalize homework submission metrics.
                </p>
              </div>
              <HomeworkTracker 
                ngos={ngos} 
                submission={submission} 
                onUpdateSubmission={handleUpdateSubmissionValue} 
              />
            </div>
          )}

        </div>

      </main>

      {/* NGO Detail Dossier Modal (Floating) */}
      {selectedNgo && (
        <NgoDetailModal
          ngo={selectedNgo}
          onClose={() => setSelectedNgo(null)}
          onSaveNotes={handleSaveNotes}
          onDelete={selectedNgo.isCustom ? handleDeleteNgo : undefined}
        />
      )}

      {/* Subtle Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-8 select-none text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs font-mono tracking-tight">SevaSetu: Structured NGO Analytical Repository Workspace</p>
            <p className="text-[10px] text-slate-600 mt-1">Empowered by server-side Gemini 3.5-flash AI & data collection modules.</p>
          </div>
          <p className="text-[10px] font-mono text-slate-600">
            © 2026 SevaSetu Project. All study records stored locally in browser sandbox.
          </p>
        </div>
      </footer>

    </div>
  );
}
