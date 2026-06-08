/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NGO } from '../types.ts';
import { Sparkles, Send, Brain, Compass, Import, Check, RotateCcw, AlertTriangle } from 'lucide-react';

interface AiAssistantProps {
  onImportNgo: (ngo: Omit<NGO, 'id' | 'isCustom'>) => void;
  existingNgoNames: string[];
}

interface ScoutItem {
  name: string;
  website: string;
  sector: string;
  headquarters: string;
  keyInitiatives: string[];
  description: string;
  establishedYear?: string;
  impactSummary?: string;
}

export default function AiAssistant({ onImportNgo, existingNgoNames }: AiAssistantProps) {
  const [activeTab, setActiveTab] = useState<'scout' | 'chat'>('scout');
  const [inputQuery, setInputQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Education');
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Results
  const [scoutResults, setScoutResults] = useState<ScoutItem[]>([]);
  const [importedIndices, setImportedIndices] = useState<number[]>([]);
  const [chatResponse, setChatResponse] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setScoutResults([]);
    setChatResponse('');
    setImportedIndices([]);

    try {
      const response = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          query: inputQuery,
          sector: activeTab === 'scout' ? selectedSector : undefined,
        }),
      });

      if (!response.ok) {
        let errMsg = 'The research assistant failed to respond. Please verify your internet connection or try again later.';
        try {
          const text = await response.text();
          try {
            const errorData = JSON.parse(text);
            errMsg = errorData.error || errMsg;
          } catch {
            if (response.status === 503) {
              errMsg = 'The AI server is starting up or key is not configured. Please supply a valid GEMINI_API_KEY in your settings.';
            } else {
              errMsg = `Server error (${response.status}): ${text.substring(0, 150).replace(/<[^>]*>/g, '')}...`;
            }
          }
        } catch {
          // Fallback
        }
        throw new Error(errMsg);
      }

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Received an invalid non-JSON response from the server.');
      }

      if (activeTab === 'scout') {
        if (data.items && Array.isArray(data.items)) {
          setScoutResults(data.items);
        } else {
          throw new Error('Malformed AI scouting payload. Please refine your query or try other sectors.');
        }
      } else {
        if (data.text) {
          setChatResponse(data.text);
        } else {
          throw new Error('Did not receive textual critique from the AI. Try another question.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected connection issue occurred. Please check your system endpoints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = (item: ScoutItem, index: number) => {
    // Check if already imported
    if (existingNgoNames.some(name => name.toLowerCase() === item.name.toLowerCase())) {
      alert(`The NGO "${item.name}" is already in your database!`);
      return;
    }

    onImportNgo({
      name: item.name,
      website: item.website,
      sector: item.sector,
      headquarters: item.headquarters,
      keyInitiatives: item.keyInitiatives || ['General Program'],
      description: item.description,
      establishedYear: item.establishedYear,
      impactSummary: item.impactSummary,
      notes: `Scouted & collected using Gemini AI Support on query: "${inputQuery}"`,
    });

    setImportedIndices([...importedIndices, index]);
  };

  const setSuggestedQuery = (query: string, sector?: string) => {
    setInputQuery(query);
    if (sector) {
      setSelectedSector(sector);
    }
  };

  return (
    <div className="bg-slate-905 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100" id="ai-researcher-assistant">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
            AI-Assisted NGO Researcher & Scout
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Leverage Gemini 3.5-flash server-side assistance to research organizations or scout detailed records to import.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'scout' 
                ? 'bg-slate-800 text-amber-300' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('scout');
              setErrorMsg('');
              setScoutResults([]);
              setChatResponse('');
            }}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Scout Mode
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'chat' 
                ? 'bg-slate-800 text-emerald-400' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => {
              setActiveTab('chat');
              setErrorMsg('');
              setScoutResults([]);
              setChatResponse('');
            }}
          >
            <Brain className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Chat Critique
          </button>
        </div>
      </div>

      {/* Main search input box */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          <div className="flex-1 relative">
            <input
              type="text"
              id="ai-prompt-input"
              className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-750"
              placeholder={
                activeTab === 'scout'
                  ? "Describe what you seek (e.g. 'Women literacy in Gujarat' or 'Wildlife shelters in Assam')"
                  : "Ask research advice (e.g. 'What challenges do mid-day meal schemes face?' or 'Summarize Smile NGO impact')"
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              id="submit-ai-query-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'scout' && (
            <div className="shrink-0 flex items-center gap-2">
              <label htmlFor="ai-scout-sector" className="text-xs text-slate-400 font-mono">Sector:</label>
              <select
                id="ai-scout-sector"
                className="bg-slate-950 border border-slate-850 text-slate-200 text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-slate-705 cursor-pointer font-mono font-medium"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environmental Conservation">Environmental Conservation</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

        </div>

        {/* Query Suggestions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Suggested Searches:</span>
          {activeTab === 'scout' ? (
            <>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => setSuggestedQuery("Animal welfare shelter networks in Karnataka", "Animal Welfare")}
              >
                Animal Welfare Karnataka
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => setSuggestedQuery("Empowerment cooperatives with banking for rural women", "Women Empowerment")}
              >
                Women Banking Co-ops
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => setSuggestedQuery("Air quality research and anti-plastic movements in Delhi NCR", "Environmental Conservation")}
              >
                Eco Plastics NCR
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => setSuggestedQuery("What is Goonj's 'Cloth for Work' model? Explain the operational layout.")}
              >
                Critique Goonj Model
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-900 text-slate-350 hover:bg-slate-900 transition-colors cursor-pointer"
                onClick={() => setSuggestedQuery("Describe the importance of the ASER report produced by Pratham Education.")}
              >
                Explain ASER Report
              </button>
            </>
          )}
        </div>
      </form>

      {/* Loading Overlay / Progress Indicator */}
      {isLoading && (
        <div className="mt-6 border border-slate-800 bg-slate-950/40 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-sm font-semibold text-white font-mono">Querying Indian NGO Developmental Records...</p>
            <p className="text-xs text-slate-500 mt-1">Applying Gemini deep research protocols to retrieve structured profiles on the social sector.</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className="mt-6 border border-red-900/30 bg-red-950/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-red-300 uppercase tracking-wide font-mono">AI Extraction Failed</h5>
            <p className="text-xs text-red-200 mt-1 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Scout Results Display */}
      {activeTab === 'scout' && scoutResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono">
              Scouted Profiles ({scoutResults.length})
            </h4>
            <button
              type="button"
              className="text-[10px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1 cursor-pointer"
              onClick={() => setScoutResults([])}
            >
              <RotateCcw className="w-3 h-3" /> Clear Results
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoutResults.map((item, idx) => {
              const isAlreadyImported = existingNgoNames.some(
                name => name.toLowerCase() === item.name.toLowerCase()
              );
              const isNewlyImported = importedIndices.includes(idx);

              return (
                <div 
                  key={item.name} 
                  className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col justify-between hover:border-slate-800 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                        {item.sector}
                      </span>
                      {item.establishedYear && (
                        <span className="text-[9px] font-mono text-slate-500">Est. {item.establishedYear}</span>
                      )}
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h5>
                      <span className="text-[10px] text-slate-500 block font-mono">{item.headquarters}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.impactSummary && (
                      <p className="text-[10px] text-slate-500 leading-normal bg-slate-905 p-2 rounded border border-slate-900 font-mono">
                        <strong className="text-slate-400 uppercase text-[9px] block mb-0.5">Reported Impact:</strong>
                        {item.impactSummary}
                      </p>
                    )}

                    <div className="pt-1.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block font-mono">Key Actions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.keyInitiatives?.map(init => (
                          <span key={init} className="text-[9px] bg-slate-900 text-slate-350 border border-slate-850 px-2 py-0.5 rounded">
                            {init}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions bar for scout result */}
                  <div className="mt-4 pt-3 border-t border-slate-900/80 flex items-center justify-between gap-4">
                    <a 
                      href={item.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] text-blue-400 hover:underline truncate max-w-[150px] font-mono"
                    >
                      {item.website.replace(/^https?:\/\//, '')} ↗
                    </a>

                    <button
                      type="button"
                      disabled={isAlreadyImported || isNewlyImported}
                      className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                        isAlreadyImported || isNewlyImported
                          ? 'bg-emerald-950/20 border border-emerald-950 text-emerald-400 cursor-default'
                          : 'bg-amber-400 hover:bg-amber-500 text-slate-950 active:scale-95'
                      }`}
                      onClick={() => handleImport(item, idx)}
                      id={`import-scout-${idx}`}
                    >
                      {isAlreadyImported || isNewlyImported ? (
                        <>
                          <Check className="w-3 h-3" />
                          Imported
                        </>
                      ) : (
                        <>
                          <Import className="w-3 h-3" />
                          Collect & Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Conversational Display */}
      {activeTab === 'chat' && chatResponse && (
        <div className="mt-6 border border-slate-800 bg-slate-950/50 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1">
              <Brain className="w-4 h-4 text-emerald-400" />
              Gemini Research Dialogue
            </span>
            <button
              type="button"
              className="text-[10px] text-slate-500 hover:text-slate-350 font-mono"
              onClick={() => setChatResponse('')}
            >
              Clear
            </button>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed font-sans space-y-3 prose prose-invert overflow-auto">
            {chatResponse.split('\n').map((line, idx) => {
              // Very simple markdown formatting rules for cleaner layout
              if (line.startsWith('###')) {
                return <h5 key={idx} className="text-sm font-bold text-white mt-4 first:mt-0">{line.replace('###', '').trim()}</h5>;
              }
              if (line.startsWith('##')) {
                return <h4 key={idx} className="text-base font-bold text-amber-300 mt-4 first:mt-0">{line.replace('##', '').trim()}</h4>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={idx} className="font-bold text-white">{line.replace(/\*\*/g, '').trim()}</p>;
              }
              if (line.startsWith('-') || line.startsWith('*')) {
                return (
                  <li key={idx} className="ml-4 list-disc text-xs text-slate-300 mt-1">
                    {line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '')}
                  </li>
                );
              }
              return <p key={idx} className="text-xs text-slate-400">{line.replace(/\*\*/g, '')}</p>;
            })}
          </div>
        </div>
      )}

    </div>
  );
}
