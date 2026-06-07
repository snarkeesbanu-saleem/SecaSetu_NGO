/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NGO } from '../types.ts';
import { BarChart, Grid3X3, Award, FileSpreadsheet, PieChart as PieIcon, CheckCircle } from 'lucide-react';

interface MetricsVisualizerProps {
  ngos: NGO[];
}

export default function MetricsVisualizer({ ngos }: MetricsVisualizerProps) {
  const [activeSectorIndex, setActiveSectorIndex] = useState<number | null>(null);

  // Group NGOs by Sector
  const sectorCounts: { [key: string]: number } = {
    'Education': 0,
    'Animal Welfare': 0,
    'Women Empowerment': 0,
    'Healthcare': 0,
    'Environmental Conservation': 0,
    'Other': 0,
  };

  ngos.forEach(ngo => {
    const s = ngo.sector;
    if (sectorCounts[s] !== undefined) {
      sectorCounts[s]++;
    } else {
      sectorCounts['Other']++;
    }
  });

  const total = ngos.length;
  const sectorsArray = Object.keys(sectorCounts).map(sec => ({
    name: sec,
    value: sectorCounts[sec],
    percentage: total > 0 ? Math.round((sectorCounts[sec] / total) * 100) : 0,
    color: getSectorColor(sec),
  })).filter(s => s.value > 0 || s.name !== 'Other'); // show Non-zero or standard

  // Colors for each sector
  function getSectorColor(sector: string): string {
    switch (sector) {
      case 'Education': return '#3b82f6'; // Blue
      case 'Animal Welfare': return '#f59e0b'; // Amber
      case 'Women Empowerment': return '#ec4899'; // Pink
      case 'Healthcare': return '#10b981'; // Emerald
      case 'Environmental Conservation': return '#14b8a6'; // Teal
      default: return '#8b5cf6'; // Violet
    }
  }

  // Calculate donut path parameters
  let accumulatedPercent = 0;
  const donutData = sectorsArray.map(sec => {
    const start = accumulatedPercent;
    accumulatedPercent += sec.percentage;
    const end = accumulatedPercent;
    return {
      ...sec,
      start,
      end,
    };
  });

  // Simple progress tracker
  const taskCount = ngos.length;
  const readinessPercentage = Math.min(100, Math.round((taskCount / 10) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 text-slate-100" id="metrics-panel">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart className="w-5 h-5 text-emerald-400" />
            Social Sector Distribution Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic distribution analytics of preloaded and custom-collected Indian NGO data
          </p>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-emerald-400 uppercase">Interactive Schema</span>
        </div>
      </div>

      {/* Grid of basic stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between" id="stat-total-ngos">
          <span className="text-xs text-slate-400 font-medium">Total Researched</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{total}</span>
            <span className="text-xs text-emerald-400 font-mono">NGOs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Min target: 10 NGOs</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between" id="stat-sectors-represented">
          <span className="text-xs text-slate-400 font-medium">Active Sectors</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {sectorsArray.filter(s => s.value > 0).length}
            </span>
            <span className="text-xs text-blue-400 font-mono">Domains</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Education, Health, Eco, etc.</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between" id="stat-custom-added">
          <span className="text-xs text-slate-400 font-medium">Custom Added</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-orange-400 tracking-tight">
              {ngos.filter(n => n.isCustom).length}
            </span>
            <span className="text-xs text-orange-300 font-mono">Created</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Practice collections</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between" id="stat-readiness">
          <span className="text-xs text-slate-400 font-medium">Data Readiness</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{readinessPercentage}%</span>
            <span className="text-xs text-slate-400">{readinessPercentage >= 100 ? "Ready" : "Ongoing"}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">Criteria: 10+ detailed NGOs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: SVG Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#1e293b"
                strokeWidth="12"
              />
              {donutData.map((sec, idx) => {
                const radius = 40;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(sec.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = `${-(donutData[idx - 1]?.end || 0) / 100 * circumference}`;
                const isHovered = activeSectorIndex === idx;

                return (
                  <circle
                    key={sec.name}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={sec.color}
                    strokeWidth={isHovered ? "14" : "12"}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer origin-center"
                    onMouseEnter={() => setActiveSectorIndex(idx)}
                    onMouseLeave={() => setActiveSectorIndex(null)}
                    style={{
                      opacity: activeSectorIndex !== null && activeSectorIndex !== idx ? 0.4 : 1,
                    }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {activeSectorIndex !== null ? (
                <>
                  <span className="text-2xl font-bold text-white">
                    {donutData[activeSectorIndex].value}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[100px] text-center font-medium uppercase font-mono">
                    {donutData[activeSectorIndex].name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-extrabold text-white tracking-tighter">
                    {total}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold tracking-wider font-mono">
                    TOTAL DATA
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 text-center select-none">
            Hover ring segments to filter sector tallies
          </div>
        </div>

        {/* Right: Legend & Sector Listing */}
        <div className="md:col-span-7 space-y-3.5">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 font-mono mb-2">
            Sector Profiles & Percentages
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sectorsArray.map((sec, idx) => {
              const isHovered = activeSectorIndex === idx;
              return (
                <div
                  key={sec.name}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    isHovered 
                      ? 'bg-slate-800/80 border-slate-600 scale-[1.02]' 
                      : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                  }`}
                  onMouseEnter={() => setActiveSectorIndex(idx)}
                  onMouseLeave={() => setActiveSectorIndex(null)}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold truncate">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: sec.color }}
                      ></span>
                      {sec.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">{sec.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${sec.percentage}%`,
                        backgroundColor: sec.color 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5">
                    <span>Count: {sec.value}</span>
                    <span>{sec.value === 1 ? 'NGO' : 'NGOs'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Dynamic Homework check banner on metrics */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-950/25 p-4 rounded-xl border border-slate-900">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-950/60 border border-emerald-900 rounded-lg text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-white flex items-center gap-1.5">
              Task Guidelines Checklist
            </h5>
            <p className="text-xs text-slate-400 mt-0.5">
              {readinessPercentage >= 100 
                ? "Academic quota accomplished! 10 prominent NGOs are collected and structured in this database workspace. Ready for Excel export." 
                : `You currently have ${taskCount}/10 NGOs collected. Add ${10 - taskCount} more to meet the criteria.`}
            </p>
          </div>
        </div>
        {readinessPercentage >= 100 && (
          <span className="shrink-0 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-semibold text-[10px] rounded px-2.5 py-1 uppercase flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Target Met
          </span>
        )}
      </div>
    </div>
  );
}
