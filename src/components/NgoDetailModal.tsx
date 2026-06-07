/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NGO } from '../types.ts';
import { X, Globe, MapPin, Calendar, Award, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

interface NgoDetailModalProps {
  ngo: NGO;
  onClose: () => void;
  onSaveNotes: (id: string, notes: string) => void;
  onDelete?: (id: string) => void; // Optional if it's custom
}

export default function NgoDetailModal({ ngo, onClose, onSaveNotes, onDelete }: NgoDetailModalProps) {
  const [notes, setNotes] = useState(ngo.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveNotes(ngo.id, notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
      id="ngo-detail-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full text-slate-100 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
        id={`ngo-detail-modal-${ngo.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color stripe code based on sector */}
        <div 
          className="h-1.5 w-full"
          style={{
            backgroundColor: 
              ngo.sector === 'Education' ? '#3b82f6' : 
              ngo.sector === 'Animal Welfare' ? '#f59e0b' : 
              ngo.sector === 'Women Empowerment' ? '#ec4899' : 
              ngo.sector === 'Healthcare' ? '#10b981' : 
              ngo.sector === 'Environmental Conservation' ? '#14b8a6' : '#8b5cf6'
          }}
        />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div>
            <span className="inline-block text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {ngo.sector}
            </span>
            <h3 className="text-2xl font-bold mt-2 text-white">{ngo.name}</h3>
            {ngo.establishedYear && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Est. {ngo.establishedYear}
              </p>
            )}
          </div>
          <button 
            type="button"
            className="p-1 px-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-400 transition-all cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
            id="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* Quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">Headquarters</span>
                <span className="text-sm font-medium text-slate-200">{ngo.headquarters}</span>
              </div>
            </div>

            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">Official Website</span>
                <a 
                  href={ngo.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {ngo.website.replace(/^https?:\/\//, '')}
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Core Mandate / Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 border border-slate-900 rounded-xl">
              {ngo.description}
            </p>
          </div>

          {/* Key Initiatives */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">Key Initiatives & Programs</h4>
            <div className="flex flex-wrap gap-2">
              {ngo.keyInitiatives.map((init) => (
                <span 
                  key={init} 
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-800 bg-slate-950/60 text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {init}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Statement */}
          {ngo.impactSummary && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Proven Impact Statement
              </h4>
              <p className="text-sm font-medium text-slate-200 bg-slate-950/60 p-4 border border-slate-800/70 rounded-xl">
                {ngo.impactSummary}
              </p>
            </div>
          )}

          {/* Interactive Notes Section */}
          <div className="border-t border-slate-800/80 pt-5">
            <label htmlFor="notes-area" className="block text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              My Research Notes & Annotations
            </label>
            <p className="text-[10px] text-slate-500 mb-3 leading-tight">
              Type down custom observations, details gathered during your web query, or critical assessments. Saved automatically in local workspace state.
            </p>
            <div className="relative">
              <textarea
                id="notes-area"
                rows={4}
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:border-slate-700 focus:ring-1 focus:ring-slate-700 rounded-xl p-3 text-sm font-sans focus:outline-none transition-all"
                placeholder="Enter custom insights about this NGO's operation model, challenges, or contact details..."
                value={notes}
                onChange={handleNotesChange}
              />
              <div className="flex items-center justify-between gap-4 mt-2">
                <div>
                  {ngo.isCustom && onDelete && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-red-900/40 text-red-400 bg-red-950/10 hover:bg-red-950/30 text-xs font-medium cursor-pointer flex items-center gap-1 transition-all"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete this custom collected NGO "${ngo.name}"?`)) {
                          onDelete(ngo.id);
                          onClose();
                        }
                      }}
                      id={`delete-custom-ngo-${ngo.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete This Entry
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="px-4 py-1.5 font-mono font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
                  onClick={handleSave}
                  id="save-notes-btn"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Notes Saved!
                    </>
                  ) : (
                    "Save Annotations"
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer banner */}
        <div className="bg-slate-950/60 p-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Structured Data Integrity — Verified Sector Mapping for Academic Homework Use
          </p>
        </div>
      </div>
    </div>
  );
}
