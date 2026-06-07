/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NGO, NGOSector } from '../types.ts';
import { Search, Filter, Plus, ChevronDown, ChevronUp, Globe, MapPin, Sparkles, Check, Info } from 'lucide-react';

interface NgosGridProps {
  ngos: NGO[];
  onAddNgo: (ngo: Omit<NGO, 'id' | 'isCustom'>) => void;
  onSelectNgo: (ngo: NGO) => void;
}

export default function NgosGrid({ ngos, onAddNgo, onSelectNgo }: NgosGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSector, setFormSector] = useState<NGOSector>('Education');
  const [formWebsite, setFormWebsite] = useState('');
  const [formHeadquarters, setFormHeadquarters] = useState('');
  const [formInitiatives, setFormInitiatives] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEstYear, setFormEstYear] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Sectors list
  const sectors: string[] = [
    'All',
    'Education',
    'Healthcare',
    'Environmental Conservation',
    'Women Empowerment',
    'Animal Welfare',
  ];

  // Filtering NGOs
  const filteredNgos = ngos.filter((ngo) => {
    const matchesSearch = 
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.headquarters.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.keyInitiatives.some(init => init.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSector = selectedSector === 'All' || ngo.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!formName.trim()) {
      setFormError('NGO Name is required.');
      return;
    }
    if (!formWebsite.trim()) {
      setFormError('Website URL is required.');
      return;
    }
    if (!formHeadquarters.trim()) {
      setFormError('Headquarters is required.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Description is required.');
      return;
    }

    // Process initiatives
    const initiativesArray = formInitiatives
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (initiativesArray.length === 0) {
      initiativesArray.push('General Social Upliftment');
    }

    onAddNgo({
      name: formName,
      sector: formSector,
      website: formWebsite.startsWith('http') ? formWebsite : `https://${formWebsite}`,
      headquarters: formHeadquarters,
      keyInitiatives: initiativesArray,
      description: formDescription,
      establishedYear: formEstYear ? parseInt(formEstYear, 10) || formEstYear : undefined,
      notes: formNotes,
    });

    // Reset Form
    setFormName('');
    setFormSector('Education');
    setFormWebsite('');
    setFormHeadquarters('');
    setFormInitiatives('');
    setFormDescription('');
    setFormEstYear('');
    setFormNotes('');
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsAddFormOpen(false);
    }, 2000);
  };

  // Color mapper for tags & sectors
  const getSectorStyles = (sec: string) => {
    switch (sec) {
      case 'Education':
        return 'bg-blue-950/40 border border-blue-900/50 text-blue-400';
      case 'Animal Welfare':
        return 'bg-amber-950/40 border border-amber-900/50 text-amber-400';
      case 'Women Empowerment':
        return 'bg-pink-950/40 border border-pink-900/50 text-pink-400';
      case 'Healthcare':
        return 'bg-emerald-950/40 border border-emerald-900/50 text-emerald-400';
      case 'Environmental Conservation':
        return 'bg-teal-950/40 border border-teal-900/50 text-teal-400';
      default:
        return 'bg-slate-800 border border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6" id="ngos-grid-container">
      
      {/* Top action row: search, sector filter & Collapsible Add Form button */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              id="ngo-search-input"
              className="w-full bg-slate-900 border border-slate-850 focus:border-slate-700 text-slate-150 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-slate-700 transition-all font-sans"
              placeholder="Search by NGO name, HQ town, initiatives or key terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative shrink-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-900">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <select
              id="sector-filter-select"
              className="bg-slate-900 border border-slate-850 text-slate-200 text-xs rounded-xl pl-8 pr-8 py-3.5 appearance-none focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 font-mono font-medium cursor-pointer"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec === 'All' ? 'All Sectors' : sec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Collapsible Add Button */}
        <button
          type="button"
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-mono font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 text-center shrink-0"
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          id="toggle-add-form-btn"
        >
          {isAddFormOpen ? (
            <>
              Hide Hand-Collection Form
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Add Hand-Collected NGO
              <Plus className="w-4 h-4" />
            </>
          )}
        </button>

      </div>

      {/* Collapsible manually added NGO form */}
      {isAddFormOpen && (
        <form 
          onSubmit={handleFormSubmit}
          className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-353 ease-out"
          id="add-custom-ngo-form"
        >
          <div className="flex items-start gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4.5 h-4.5 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Manual Hand-Collected NGO Data Register
              </h4>
              <p className="text-xs text-slate-400">
                Exercise professional data collection by entering information for a new NGO you researched on the internet.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* NGO Name */}
            <div>
              <label htmlFor="form-ngo-name" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                NGO Name <span className="text-red-400">*</span>
              </label>
              <input
                id="form-ngo-name"
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-705"
                placeholder="e.g. SEWA"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Area of Work / Sector */}
            <div>
              <label htmlFor="form-ngo-sector" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Area of Work / Sector <span className="text-red-400">*</span>
              </label>
              <select
                id="form-ngo-sector"
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
                value={formSector}
                onChange={(e) => setFormSector(e.target.value as NGOSector)}
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Environmental Conservation">Environmental Conservation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="form-ngo-website" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Website URL <span className="text-red-400">*</span>
              </label>
              <input
                id="form-ngo-website"
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
                placeholder="e.g. www.sewa.org"
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
              />
            </div>

            {/* Headquarters */}
            <div>
              <label htmlFor="form-ngo-hq" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Headquarters <span className="text-red-400">*</span>
              </label>
              <input
                id="form-ngo-hq"
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
                placeholder="e.g. New Delhi"
                value={formHeadquarters}
                onChange={(e) => setFormHeadquarters(e.target.value)}
              />
            </div>

            {/* Established Year */}
            <div>
              <label htmlFor="form-ngo-year" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Established Year
              </label>
              <input
                id="form-ngo-year"
                type="text"
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
                placeholder="e.g. 2018"
                value={formEstYear}
                onChange={(e) => setFormEstYear(e.target.value)}
              />
            </div>

            {/* Key Initiatives */}
            <div>
              <label htmlFor="form-ngo-initiatives" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Key Initiatives (Comma Separated)
              </label>
              <input
                id="form-ngo-initiatives"
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
                placeholder="e.g. Blood Donation, Tree Plantation, Teaching"
                value={formInitiatives}
                onChange={(e) => setFormInitiatives(e.target.value)}
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label htmlFor="form-ngo-description" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="form-ngo-description"
              rows={2}
              className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
              placeholder="Describe their primary mission, operational context, and social contribution in 2-3 detailed sentences..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          {/* Private Notes */}
          <div>
            <label htmlFor="form-ngo-notes" className="block text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
              Initial Research Notes & Critique
            </label>
            <textarea
              id="form-ngo-notes"
              rows={2}
              className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none"
              placeholder="Any critical comments, funding analysis, or personal research observations about this entry..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
            />
          </div>

          {/* Feedback & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div>
              {formError && <p className="text-xs text-red-400 font-mono font-medium">⚠️ {formError}</p>}
              {formSuccess && (
                <p className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> SUCCESS: NGO data saved & compiled into visual index!
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-mono font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
              id="save-custom-ngo-submit"
            >
              Commit Entry to Registry
            </button>
          </div>

        </form>
      )}

      {/* Grid listing of active NGOs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="ngo-cards-grid">
        {filteredNgos.length > 0 ? (
          filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-slate-900 border border-slate-850/80 rounded-2xl overflow-hidden hover:border-slate-750/90 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              id={`ngo-card-${ngo.id}`}
            >
              {/* Card top info */}
              <div className="p-5 space-y-4">
                
                {/* Sector and Custom marker */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-sm tracking-wider ${getSectorStyles(ngo.sector)}`}>
                    {ngo.sector}
                  </span>
                  
                  {ngo.isCustom ? (
                    <span className="text-[9px] font-mono font-semibold uppercase bg-orange-500/10 border border-orange-500/25 text-orange-400 px-2 py-0.5 rounded">
                      Custom Data
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-semibold uppercase bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Curated
                    </span>
                  )}
                </div>

                {/* Name */}
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {ngo.name}
                  </h4>
                  {ngo.establishedYear && (
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      Founded {ngo.establishedYear} • {ngo.headquarters}
                    </p>
                  )}
                </div>

                {/* Brief description */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {ngo.description}
                </p>

                {/* Key Initiatives (Max 3 shown) */}
                <div className="space-y-1.5 pt-2">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Key Initiatives:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ngo.keyInitiatives.slice(0, 3).map((init) => (
                      <span
                        key={init}
                        className="text-[10px] font-medium font-sans px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-900 truncate max-w-[150px]"
                        title={init}
                      >
                        {init}
                      </span>
                    ))}
                    {ngo.keyInitiatives.length > 3 && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-900 text-slate-500">
                        +{ngo.keyInitiatives.length - 3} More
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom bar controls */}
              <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex items-center justify-between gap-4">
                
                {/* Website Link */}
                <a
                  href={ngo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-white transition-all font-mono flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400 group-hover:animate-pulse" />
                  Visit Site
                </a>

                {/* Inspect Details button */}
                <button
                  type="button"
                  className="text-xs font-mono font-bold text-white uppercase hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-all active:scale-95 bg-slate-850/80 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700"
                  onClick={() => onSelectNgo(ngo)}
                  id={`inspect-${ngo.id}`}
                >
                  Inspect Research
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                </button>

              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full border border-slate-850 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center text-slate-500">
            <Info className="w-8 h-8 text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-300">No NGOs found matching search variables.</p>
            <p className="text-xs mt-1 text-slate-500 max-w-sm">Try using different keywords or click the Reset filter selector to standard 'All Sectors' option.</p>
          </div>
        )}
      </div>

    </div>
  );
}
