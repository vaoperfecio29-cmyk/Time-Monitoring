import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  settings: AppSettings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, settings }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/80 backdrop-blur-sm p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-brand-grey">
        <div className="px-6 py-4 border-b border-brand-grey flex justify-between items-center bg-brand-grey">
          <div className="flex items-center gap-2 font-bold text-brand-black uppercase tracking-wide">
            <Settings className="w-5 h-5 text-brand-blue" />
            Settings
          </div>
          <button onClick={onClose} className="p-1 hover:bg-brand-white/50 rounded-full transition-colors">
            <X className="w-5 h-5 text-brand-textGrey" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">Hourly Rate</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full p-3 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-brand-black bg-brand-white"
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">Currency</label>
             <select 
               name="currency"
               value={formData.currency}
               onChange={handleChange}
               className="w-full p-3 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-brand-white text-brand-black"
             >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PHP">PHP (₱)</option>
                <option value="JPY">JPY (¥)</option>
             </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-2">Expected Start Time</label>
            <div className="text-[10px] text-brand-textGrey mb-2 uppercase">Used to calculate late hours</div>
            <input
              type="time"
              name="expectedStartTime"
              value={formData.expectedStartTime}
              onChange={handleChange}
              className="w-full p-3 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-brand-black bg-brand-white"
            />
          </div>
        </div>

        <div className="p-4 border-t border-brand-grey bg-brand-grey/20">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-brand-blue hover:bg-brand-black text-brand-white rounded-xl font-bold transition-colors uppercase tracking-widest text-sm shadow-md"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;