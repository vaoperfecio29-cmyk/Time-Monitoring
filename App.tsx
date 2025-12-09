import React, { useState, useEffect, useMemo } from 'react';
import { Settings, ChevronLeft, ChevronRight, Calculator } from 'lucide-react';
import { TimeLog, AppSettings, MonthlyStats, DailyStats } from './types';
import { getMonthDays, calculateDailyStats, getTodayStr } from './utils/timeUtils';
import Dashboard from './components/Dashboard';
import CalendarGrid from './components/CalendarGrid';
import TimeEntryModal from './components/TimeEntryModal';
import SettingsModal from './components/SettingsModal';
import AiAnalysisModal from './components/AiAnalysisModal';
import { analyzeWorkMonth } from './services/geminiService';

const DEFAULT_SETTINGS: AppSettings = {
  hourlyRate: 25,
  currency: 'USD',
  expectedStartTime: '09:00',
};

const App: React.FC = () => {
  // --- State ---
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [logs, setLogs] = useState<Record<string, TimeLog>>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // UI State
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    // Load data from localStorage
    const savedLogs = localStorage.getItem('workflow_logs');
    const savedSettings = localStorage.getItem('workflow_settings');
    
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('workflow_logs', JSON.stringify(logs));
    localStorage.setItem('workflow_settings', JSON.stringify(settings));
  }, [logs, settings]);

  // --- Calculations ---
  const daysInMonth = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const monthlyStats = useMemo<MonthlyStats>(() => {
    let totalHours = 0;
    let totalLateHours = 0;
    let totalEarnings = 0;
    let daysWorked = 0;

    daysInMonth.forEach(day => {
      const dateStr = day.toISOString().split('T')[0];
      const log = logs[dateStr];
      if (log) {
        const stats = calculateDailyStats(log, settings);
        totalHours += stats.totalHours;
        totalLateHours += stats.lateHours;
        totalEarnings += stats.earnings;
        if (stats.totalHours > 0) daysWorked++;
      }
    });

    return { totalHours, totalLateHours, totalEarnings, daysWorked };
  }, [daysInMonth, logs, settings]);

  // --- Handlers ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDay(dateStr);
  };

  const handleSaveLog = (log: TimeLog) => {
    setLogs(prev => ({ ...prev, [log.date]: log }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const monthLogs = daysInMonth
      .map(d => d.toISOString().split('T')[0])
      .map(dateStr => logs[dateStr])
      .filter(Boolean); // Only send actual logs
    
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const result = await analyzeWorkMonth(monthLogs, settings, monthName);
    setAiResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-brand-grey text-brand-black pb-20 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-brand-blue text-brand-white shadow-lg shadow-brand-blue/20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-brand-white p-2 rounded-lg shadow-inner">
                    <Calculator className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-2xl tracking-tight leading-none text-brand-white">WorkFlow</h1>
                  <span className="text-[10px] uppercase tracking-widest text-brand-white/80">Time Monitor</span>
                </div>
            </div>
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-white"
            >
                <Settings className="w-6 h-6" />
            </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Month Selector */}
        <div className="flex items-center justify-between bg-brand-white p-4 rounded-2xl shadow-sm border border-brand-white">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-brand-grey rounded-full transition-all text-brand-blue">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-brand-black uppercase tracking-tight">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
             <button onClick={handleNextMonth} className="p-2 hover:bg-brand-grey rounded-full transition-all text-brand-blue">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>

        {/* Dashboard Stats */}
        <Dashboard 
            stats={monthlyStats} 
            currency={settings.currency} 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
        />

        {/* Calendar / List View */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-brand-black uppercase tracking-wide">Daily Logs</h3>
                <span className="text-xs font-medium text-brand-textGrey uppercase tracking-wider">Tap to edit</span>
            </div>
            <CalendarGrid 
                days={daysInMonth} 
                logs={logs} 
                settings={settings}
                onDayClick={handleDayClick} 
            />
        </div>
      </main>

      {/* Modals */}
      <TimeEntryModal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveLog}
        initialData={selectedDay ? (logs[selectedDay] || { 
            date: selectedDay, 
            timeIn: '', 
            breakStart: '', 
            breakEnd: '', 
            timeOut: '' 
        }) : { date: '', timeIn: '', breakStart: '', breakEnd: '', timeOut: '' }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setSettings}
        settings={settings}
      />

      <AiAnalysisModal
        isOpen={!!aiResult}
        onClose={() => setAiResult(null)}
        analysis={aiResult || ''}
      />
    </div>
  );
};

export default App;