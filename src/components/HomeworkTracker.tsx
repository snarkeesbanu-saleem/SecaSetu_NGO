/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NGO, HomeworkSubmission } from '../types.ts';
import { 
  FileSpreadsheet, FileText, Share2, Clipboard, Globe, 
  CheckSquare, CloudUpload, Square, Sparkles, Award, ExternalLink 
} from 'lucide-react';

interface HomeworkTrackerProps {
  ngos: NGO[];
  submission: HomeworkSubmission;
  onUpdateSubmission: (sub: Partial<HomeworkSubmission>) => void;
}

export default function HomeworkTracker({ ngos, submission, onUpdateSubmission }: HomeworkTrackerProps) {
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'sheet' | 'submit' | 'report'>('sheet');

  const [inputDriveUrl, setInputDriveUrl] = useState(submission.driveFolderUrl || '');
  const [inputLinkedInUrl, setInputLinkedInUrl] = useState(submission.linkedInPostUrl || '');

  // Convert NGO array into compliant CSV string
  const handleExportCSV = () => {
    const headers = ['NGO Name', 'Social Sector', 'Website', 'Headquarters', 'Year Established', 'Key Initiatives', 'Description', 'Research Notes'];
    const rows = ngos.map(ngo => [
      `"${ngo.name.replace(/"/g, '""')}"`,
      `"${ngo.sector.replace(/"/g, '""')}"`,
      `"${ngo.website.replace(/"/g, '""')}"`,
      `"${ngo.headquarters.replace(/"/g, '""')}"`,
      ngo.establishedYear || 'N/A',
      `"${(ngo.keyInitiatives || []).join(', ').replace(/"/g, '""')}"`,
      `"${ngo.description.replace(/"/g, '""')}"`,
      `"${(ngo.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SevaSetu_NGO_Research_India.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Auto check off the first sub step
    onUpdateSubmission({ driveConfirmed: true });
  };

  // Generate copyable text report perfect for Word or Google Docs
  const handleCopyReport = () => {
    let report = `====================================================\n`;
    report += `NGO RESEARCH & SOCIAL SECTOR STUDY (INDIA)\n`;
    report += `====================================================\n`;
    report += `Compiled under SevaSetu NGO Research & Analytics Project\n`;
    report += `Total NGOs Selected: ${ngos.length}\n`;
    report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    ngos.forEach((ngo, idx) => {
      report += `${idx + 1}. NGO NAME: ${ngo.name}\n`;
      report += `   - Website URL: ${ngo.website}\n`;
      report += `   - Sector Focus: ${ngo.sector}\n`;
      report += `   - Headquarters: ${ngo.headquarters}\n`;
      if (ngo.establishedYear) report += `   - Established Year: ${ngo.establishedYear}\n`;
      report += `   - Primary Initiatives: ${(ngo.keyInitiatives || []).join(', ')}\n`;
      report += `   - Foundational Context:\n     ${ngo.description}\n`;
      if (ngo.notes) report += `   - Researcher Observations:\n     ${ngo.notes}\n`;
      report += `----------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Preformed LinkedIn post template
  const linkedInPostText = `Excited to share that I have completed the SevaSetu: NGO Research & Data Collection initiative! 📊🔍

I researched and created a structured, analyzed workspace tracking 10 prominent non-environmental, educational, and healthcare NGOs working across India—including organizations like Goonj, SEWA, and Akshaya Patra Foundation. 

Key details gathered:
🔹 NGO headquarters & official portals
🔹 Specific social sector focus areas
🔹 Core community-level, bottom-up initiatives
🔹 Structured data visualizations & metrics

This exercise helped me understand grassroots operational models and excel/spreadsheet data collection techniques in a customized research suite!

#NGOs #SocialSector #DataScience #DataCollection #SevaSetuProject #IndiaDevelopment #Volunteering #Analytics`;

  const copyLinkedInPost = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setCopiedPost(true);
    setTimeout(() => setCopiedPost(false), 2000);
  };

  const handleSaveUrls = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSubmission({
      driveFolderUrl: inputDriveUrl,
      linkedInPostUrl: inputLinkedInUrl,
      driveConfirmed: inputDriveUrl.length > 5,
      linkedInConfirmed: inputLinkedInUrl.length > 5,
    });
    alert("Submission resources registered successfully!");
  };

  // Toggle checklist boolean states
  const handleToggleCheck = (key: 'driveConfirmed' | 'linkedInConfirmed' | 'screenshotConfirmed') => {
    onUpdateSubmission({
      [key]: !submission[key]
    });
  };

  // Academic readiness calculation
  const isAllDone = ngos.length >= 10 && submission.driveConfirmed && submission.linkedInConfirmed && submission.screenshotConfirmed;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100" id="homework-tracker-workspace">
      
      {/* Tab select bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            SevaSetu: Exporter & Portfolio Controller
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Format researched NGO list, download Excel CSVs, write reports, and register portfolio parameters.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-around">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'sheet' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('sheet')}
          >
            Spreadsheet
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'report' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('report')}
          >
            Word Report
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'submit' 
                ? 'bg-slate-800 text-amber-300' 
                : 'text-slate-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('submit')}
          >
            Submission Panel
          </button>
        </div>
      </div>

      {/* TAB 1: SPREADSHEET DETAIL LIST */}
      {activeTab === 'sheet' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">Format & Data Integrity Checklist</h4>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Prepare your spreadsheet workbook. Down below is a responsive draft containing <strong>{ngos.length} total NGOs</strong>. Exporting produces an Excel-compatible .CSV document.
              </p>
            </div>
            
            <button
              type="button"
              className="bg-emerald-500 hover:bg-emerald-600 font-mono font-bold text-xs text-slate-950 py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-95 shrink-0 flex items-center gap-1.5 shadow-md"
              onClick={handleExportCSV}
              id="export-csv-btn"
            >
              <FileSpreadsheet className="w-4.5 h-4.5" />
              Export to Excel (CSV)
            </button>
          </div>

          {/* Simple HTML Table to show spreadsheet format */}
          <div className="overflow-x-auto border border-slate-850 rounded-xl">
            <table className="w-full text-left text-xs text-slate-350 border-collapse">
              <thead className="bg-slate-950 text-slate-200 uppercase tracking-wider text-[10px] font-mono border-b border-slate-850">
                <tr>
                  <th className="p-3 font-semibold border-r border-slate-850">Index</th>
                  <th className="p-3 font-semibold border-r border-slate-850">NGO Name</th>
                  <th className="p-3 font-semibold border-r border-slate-850">Sector Focus</th>
                  <th className="p-3 font-semibold border-r border-slate-850">Headquarters</th>
                  <th className="p-3 font-semibold border-r border-slate-850">Website URL</th>
                  <th className="p-3 font-semibold">Initiatives Sample</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {ngos.map((ngo, idx) => (
                  <tr key={ngo.id} className="hover:bg-slate-850/50 even:bg-slate-905/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-400 text-center border-r border-slate-850">{idx + 1}</td>
                    <td className="p-3 font-bold text-white border-r border-slate-850">{ngo.name}</td>
                    <td className="p-3 border-r border-slate-850">
                      <span className="bg-slate-800 text-slate-350 px-1.5 py-0.5 rounded font-mono text-[10px]">{ngo.sector}</span>
                    </td>
                    <td className="p-3 border-r border-slate-850 font-medium">{ngo.headquarters}</td>
                    <td className="p-3 border-r border-slate-850">
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {ngo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td className="p-3 truncate max-w-[200px]" title={ngo.keyInitiatives.join(', ')}>
                      {ngo.keyInitiatives.slice(0, 2).join(', ')}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC TEXT REPORT GENERATOR */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">Academic Text Copy Workspace</h4>
              <p className="text-xs text-slate-400 mt-1">
                Need details in a Word or Google Document? Generate a beautifully formatted academic summary text with a single click, ready to paste.
              </p>
            </div>
            
            <button
              type="button"
              className="bg-slate-855 hover:bg-slate-750 text-white font-mono font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 border border-slate-700 font-medium shrink-0"
              onClick={handleCopyReport}
              id="copy-text-report-btn"
            >
              <Clipboard className="w-4 h-4" />
              {copiedReport ? "Report Copied!" : "Copy Report Text"}
            </button>
          </div>

          <div className="relative">
            <pre className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 text-[10px] sm:text-xs text-slate-400 font-mono overflow-x-auto max-h-[350px]">
{`====================================================
NGO RESEARCH & SOCIAL SECTOR STUDY (INDIA)
====================================================
Compiled under SevaSetu NGO Research & Analytics Project

NGOs Curated in Registered Database:`}
{ngos.map((n, i) => `\n- [Sector: ${n.sector}] ${n.name} [HQ: ${n.headquarters}]`).join('')}
{`\n\nFor deep records: Click 'Copy Report Text' to copy detailed profiles complete with website URLs, key initiatives, descriptions, and private annotations to your system clipboard.`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENT SUBMISSION PARAMETERS */}
      {activeTab === 'submit' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Col: Step Guide Checklist */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-850 pb-2">
                Submissions & Sharing Guide
              </h4>
              
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3 border border-slate-850 rounded-xl bg-slate-950/20 flex gap-3 items-start">
                  <button 
                    type="button"
                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-400"
                    onClick={() => handleToggleCheck('driveConfirmed')}
                    aria-label="Toggle drive upload step confirmation"
                    id="checkbox-drive"
                  >
                    {submission.driveConfirmed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                  <div>
                    <span className="block text-xs font-bold text-white font-mono">1. Save workbook & Upload to Drive</span>
                    <span className="block text-xs text-slate-400 mt-1 leading-normal">
                      Export your NGO database to CSV above. Upload the completed sheet record into your Google Drive folder. Keep the file original saved safely!
                    </span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 border border-slate-850 rounded-xl bg-slate-950/20 flex gap-3 items-start">
                  <button 
                    type="button"
                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-400"
                    onClick={() => handleToggleCheck('linkedInConfirmed')}
                    aria-label="Toggle LinkedIn post step confirmation"
                    id="checkbox-linkedin"
                  >
                    {submission.linkedInConfirmed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                  <div>
                    <span className="block text-xs font-bold text-white font-mono">2. Post on LinkedIn (Share SevaSetu Project)</span>
                    <span className="block text-xs text-slate-400 mt-1 leading-normal">
                      Publish a social message detailing your study and share your data collection outcomes.
                    </span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 border border-slate-850 rounded-xl bg-slate-950/20 flex gap-3 items-start">
                  <button 
                    type="button"
                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-400"
                    onClick={() => handleToggleCheck('screenshotConfirmed')}
                    aria-label="Toggle screenshot confirmation tracker"
                    id="checkbox-screenshot"
                  >
                    {submission.screenshotConfirmed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                  <div>
                    <span className="block text-xs font-bold text-white font-mono">3. Social Screenshot Saver</span>
                    <span className="block text-xs text-slate-400 mt-1 leading-normal">
                      Take a snapshot of your published LinkedIn update as record proof. Check here when compiled and saved!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Clip post & Resource URLs registry */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Draft Box */}
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-850 pb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-blue-400" /> Draft LinkedIn post
                  </span>
                  <button
                    type="button"
                    className="text-[10px] text-emerald-400 hover:text-white font-mono font-bold cursor-pointer"
                    onClick={copyLinkedInPost}
                    id="copy-linkedin-post-btn"
                  >
                    {copiedPost ? "Copied Post!" : "Copy Post Text"}
                  </button>
                </div>
                <textarea
                  readOnly
                  className="w-full bg-slate-905 border border-slate-900 border-dashed text-[10px] p-2 rounded text-slate-400 font-sans outline-none select-all"
                  rows={6}
                  value={linkedInPostText}
                />
                <span className="block text-[8px] text-slate-500 font-mono text-center mt-1">
                  Tagging: #SevaSetu Project • Use copy button for easy sharing
                </span>
              </div>
            </div>

          </div>

          {/* Links Registry Form */}
          <div className="border-t border-slate-800 pt-5 mt-4">
            <h5 className="text-xs uppercase font-bold tracking-wider text-slate-350 font-mono mb-3">
              Official Web Link Registry
            </h5>
            
            <form onSubmit={handleSaveUrls} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="drive-link" className="block text-[10px] font-mono text-slate-550 uppercase font-semibold mb-1">
                  G-Drive Folder Link
                </label>
                <input
                  id="drive-link"
                  type="url"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                  placeholder="e.g. https://drive.google.com/drive/folders/..."
                  value={inputDriveUrl}
                  onChange={(e) => setInputDriveUrl(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="linkedin-link" className="block text-[10px] font-mono text-slate-550 uppercase font-semibold mb-1">
                  LinkedIn Post/Screenshot Link
                </label>
                <input
                  id="linkedin-link"
                  type="url"
                  className="w-full bg-slate-950 border border-slate-850 focus:border-slate-700 text-xs text-slate-100 rounded-lg p-2.5 outline-none font-mono"
                  placeholder="e.g. https://www.linkedin.com/posts/..."
                  value={inputLinkedInUrl}
                  onChange={(e) => setInputLinkedInUrl(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-705 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-all hover:border-slate-600 border border-slate-800"
                  id="save-registry-urls-btn"
                >
                  Register Assignment URLs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Certificate of Completion */}
      {isAllDone && (
        <div className="mt-8 border border-emerald-900 bg-emerald-950/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-5 justify-between animate-bounce-short">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 shrink-0">
              <Award className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono font-bold text-[9px] rounded px-2 py-0.5 uppercase tracking-wide">
                Portfolio Ready
              </span>
              <h4 className="text-lg font-bold text-white mt-1">Complete NGO Study Completed!</h4>
              <p className="text-xs text-slate-350 mt-1 leading-normal max-w-xl">
                Congratulations! You met the compliance requirements of the <strong>SevaSetu Project</strong>. You researched 10+ NGOs, saved to Google Drive, and prepared the public post. Everything is logged cleanly in your active workspace portfolio.
              </p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl flex flex-col items-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Portfolio Status</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 uppercase tracking-tight">100% DONE</span>
          </div>
        </div>
      )}

    </div>
  );
}
