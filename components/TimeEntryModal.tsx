import React, { useState, useEffect } from 'react';
import { X, Save, Clock } from 'lucide-react';
import { TimeLog } from '../types';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (log: TimeLog) => void;
  initialData: TimeLog;
}

const TimeEntryModal: React.FC<TimeEntryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<TimeLog>(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const timeInputClass = "w-full p-4 text-xl bg-brand-white border border-brand-grey rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all font-mono text-center text-brand-black shadow-sm";
  const labelClass = "text-xs font-bold text-brand-darkGrey uppercase tracking-wider mb-2 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-brand-grey rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-brand-white/20">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-black/5 flex justify-between items-center bg-brand-white">
          <div className="flex items-center gap-2 text-brand-blue">
            <Clock className="w-5 h-5" />
            <span className="font-bold text-lg text-brand-black">
              {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-grey rounded-full text-brand-darkGrey transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner for Shift */}
        <div className="bg-brand-blue/5 border-b border-brand-blue/10 px-6 py-2">
            <p className="text-[10px] text-brand-blue text-center font-medium">
                Standard Shift: 9:00 AM - 12:00 PM & 1:00 PM - 6:00 PM
            </p>
        </div>

        {/* Scrollable Content Area - The "Window" */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-brand-white/50">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Time In */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Time In</label>
              <input
                type="time"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleChange}
                className={`${timeInputClass}`}
              />
            </div>
             {/* Time Out */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Time Out</label>
              <input
                type="time"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleChange}
                className={`${timeInputClass}`}
              />
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-grey"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-brand-grey/0 px-2 text-brand-darkGrey font-bold backdrop-blur-sm rounded">Break Time</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Break Start */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Break Start</label>
              <input
                type="time"
                name="breakStart"
                value={formData.breakStart}
                onChange={handleChange}
                className={`${timeInputClass}`}
              />
            </div>

            {/* Break End */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Break End</label>
              <input
                type="time"
                name="breakEnd"
                value={formData.breakEnd}
                onChange={handleChange}
                className={`${timeInputClass}`}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-brand-grey bg-brand-white">
          <button
            onClick={handleSave}
            className="w-full flex justify-center items-center gap-2 py-4 bg-brand-blue hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.98] uppercase tracking-wide"
          >
            <Save className="w-5 h-5" />
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeEntryModal;