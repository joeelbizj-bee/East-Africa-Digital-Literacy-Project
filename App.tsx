
import React, { useState, useEffect, useCallback } from 'react';
import { Organization, Country } from './types';
import { findOrganizations, getRegionalStats } from './services/geminiService';
import DataTable from './components/DataTable';
import StatsCards from './components/StatsCards';

const App: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [reflection, setReflection] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'research' | 'sheet' | 'reflection'>('research');
  const [sources, setSources] = useState<string[]>([]);
  const [stats, setStats] = useState<{ kenya: any, uganda: any } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const k = await getRegionalStats('Kenya');
        const u = await getRegionalStats('Uganda');
        setStats({ kenya: k, uganda: u });
      } catch (err) {
        console.error("Failed to load initial stats", err);
      }
    };
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchResearch = async (country: Country) => {
    setIsLoading(true);
    try {
      const { organizations: newOrgs, sources: newSources } = await findOrganizations(country);
      setOrganizations(prev => {
        // Simple de-duplication
        const existingNames = new Set(prev.map(o => o.name));
        const filtered = newOrgs.filter(o => !existingNames.has(o.name));
        return [...prev, ...filtered];
      });
      setSources(prev => Array.from(new Set([...prev, ...newSources])));
      setActiveTab('sheet');
    } catch (err) {
      alert("Research query failed. Please check your API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeOrganization = (id: string) => {
    setOrganizations(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 01-2.935 0l-1.168-1.168a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 01-2.935 0l-1.168-1.168a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 01-2.935 0l-1.168-1.168a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">TechForAll</h1>
                <p className="text-xs text-slate-500 font-medium">Remote Research Assistant Workspace</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('research')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'research' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('sheet')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'sheet' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Data Sheet
              </button>
              <button 
                onClick={() => setActiveTab('reflection')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'reflection' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Reflection
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Dashboard View */}
        {activeTab === 'research' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-3">East Africa Digital Literacy Project</h2>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  You are supporting TechForAll's mission to launch a digital literacy program. 
                  Start by gathering data on existing initiatives in Kenya and Uganda to map the landscape 
                  and identify potential partners.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    disabled={isLoading}
                    onClick={() => handleFetchResearch('Kenya')}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Researching...' : 'Scan Kenya Initiatives'}
                  </button>
                  <button 
                    disabled={isLoading}
                    onClick={() => handleFetchResearch('Uganda')}
                    className="bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Researching...' : 'Scan Uganda Initiatives'}
                  </button>
                </div>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                <svg viewBox="0 0 200 200" className="h-full">
                  <path fill="currentColor" d="M45.5,-77.8C59.3,-71.4,71.2,-60.1,79,-46.6C86.7,-33.1,90.3,-17.4,88.4,-2.2C86.5,13.1,79.1,27.8,70.5,41.2C61.8,54.5,51.8,66.6,39.3,74.1C26.8,81.5,11.7,84.4,-3.1,89.7C-17.9,95,-32.3,102.7,-45.5,100.2C-58.7,97.7,-70.6,85,-79.6,71.1C-88.5,57.1,-94.5,42.1,-97.1,26.7C-99.7,11.3,-98.9,-4.5,-95.4,-19.4C-91.8,-34.4,-85.4,-48.5,-74.6,-59.2C-63.7,-69.9,-48.3,-77.2,-33.5,-82.7C-18.7,-88.2,-4.5,-91.8,10.1,-86C24.7,-80.2,45.5,-77.8,45.5,-77.8Z" transform="translate(100 100)" />
                </svg>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {stats ? (
                <>
                  <StatsCards country="Kenya" stats={stats.kenya} />
                  <StatsCards country="Uganda" stats={stats.uganda} />
                </>
              ) : (
                <div className="col-span-2 h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
                  Loading regional analytics...
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Task Instructions</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-3">1</div>
                  <h4 className="font-bold text-slate-800 mb-1 text-sm uppercase tracking-wide">Research</h4>
                  <p className="text-sm text-slate-600">Find 5 organizations per country providing digital literacy or tech training.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-3">2</div>
                  <h4 className="font-bold text-slate-800 mb-1 text-sm uppercase tracking-wide">Organize</h4>
                  <p className="text-sm text-slate-600">Record name, location, CEO, and contact details in the data sheet.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-3">3</div>
                  <h4 className="font-bold text-slate-800 mb-1 text-sm uppercase tracking-wide">Reflect</h4>
                  <p className="text-sm text-slate-600">Submit a reflection on research challenges and skill improvements.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sheet View */}
        {activeTab === 'sheet' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Initiative Database</h2>
                <p className="text-slate-500 text-sm">Consolidated view of East African tech initiatives.</p>
              </div>
              {sources.length > 0 && (
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Source Verification</div>
                  <div className="flex gap-2">
                    {sources.slice(0, 3).map((s, i) => (
                      <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors" title={s}>
                        <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
                      </a>
                    ))}
                    {sources.length > 3 && <div className="text-xs text-slate-400 flex items-center">+{sources.length - 3} more</div>}
                  </div>
                </div>
              )}
            </div>
            <DataTable 
              organizations={organizations} 
              onRemove={removeOrganization}
            />
          </div>
        )}

        {/* Reflection View */}
        {activeTab === 'reflection' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Research Reflection</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Take a moment to evaluate your research process. Reflection is a critical part of developing the 
                soft skill of <span className="text-indigo-600 font-semibold">Critical Thinking</span>.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Challenges & Skill Improvement
                  </label>
                  <textarea 
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write 2-3 sentences about the challenges of finding this data and which research skills you improved..."
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-800"
                  />
                  <div className="mt-2 text-xs text-slate-400 flex justify-between">
                    <span>Word Count: {reflection.split(/\s+/).filter(Boolean).length}</span>
                    <span>Target: 2-3 sentences</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-amber-800 italic">
                    "Critical thinking helps freelancers build structure for logical solutions in decision-making processes."
                  </p>
                </div>

                <button 
                  onClick={() => {
                    alert("Reflection submitted successfully to TechForAll management!");
                  }}
                  disabled={reflection.trim().length < 20}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
                >
                  Submit Final Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Loading Overlay */}
      {isLoading && (activeTab === 'research') && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-indigo-900 font-bold">Scanning Digital Databases...</div>
            <div className="text-slate-500 text-sm mt-1">Collecting initiative data with Grounding Tools</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
