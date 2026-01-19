
import React from 'react';
import { Organization } from '../types';

interface DataTableProps {
  organizations: Organization[];
  onRemove: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ organizations, onRemove }) => {
  if (organizations.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border-2 border-dashed border-slate-200">
        <div className="text-slate-400 mb-2">No data collected yet.</div>
        <p className="text-sm text-slate-500">Use the Search Assistant to find initiatives in Kenya and Uganda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Organization Name</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Country & City</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Program Type</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">CEO / Director</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Contact / Website</th>
              <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-4 py-3 text-sm font-medium text-slate-900 border-r border-slate-100">{org.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600 border-r border-slate-100">{org.country}, {org.city}</td>
                <td className="px-4 py-3 text-sm text-slate-600 border-r border-slate-100">{org.programType}</td>
                <td className="px-4 py-3 text-sm text-slate-600 border-r border-slate-100">{org.ceo}</td>
                <td className="px-4 py-3 text-sm text-blue-600 border-r border-slate-100">
                  <a href={org.contact.startsWith('http') ? org.contact : `https://${org.contact}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {org.contact}
                  </a>
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => onRemove(org.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>Showing {organizations.length} entries</span>
        <div className="flex gap-2">
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Kenya: {organizations.filter(o => o.country === 'Kenya').length}</span>
           <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Uganda: {organizations.filter(o => o.country === 'Uganda').length}</span>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
