import React, { useState } from 'react';
import { X, Save, Settings } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/60 backdrop-blur-sm p-4">
      <div className="bg-brand-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-brand-grey">
        <div className="px-6 py-4 border-b border-brand-grey flex justify-between items-center bg-brand-grey/20">
          <div className="flex items-center gap-2 font-bold text-brand-black">
            <Settings className="w-5 h-5 text-brand-blue" />
            Settings
          </div>
          <button onClick={onClose} className="p-1 hover:bg-brand-grey rounded-full transition-colors">
            <X className="w-5 h-5 text-brand-darkGrey" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-brand-black mb-1">Hourly Rate</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full p-2 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-brand-black"
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-brand-black mb-1">Currency</label>
             <select 
               name="currency"
               value={formData.currency}
               onChange={handleChange}
               className="w-full p-2 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-brand-white text-brand-black"
             >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PHP">PHP (₱)</option>
                <option value="JPY">JPY (¥)</option>
             </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-black mb-1">Expected Start Time</label>
            <div className="text-xs text-brand-darkGrey mb-2">Used to calculate late hours</div>
            <input
              type="time"
              name="expectedStartTime"
              value={formData.expectedStartTime}
              onChange={handleChange}
              className="w-full p-2 border border-brand-grey rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-brand-black"
            />
          </div>
        </div>

        <div className="p-4 border-t border-brand-grey bg-brand-grey/10">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold transition-colors uppercase tracking-wide text-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;