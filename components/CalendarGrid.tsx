import React from 'react';
import { TimeLog, DailyStats, AppSettings } from '../types';
import { calculateDailyStats, formatTimeDisplay } from '../utils/timeUtils';
import { ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  days: Date[];
  logs: Record<string, TimeLog>;
  settings: AppSettings;
  onDayClick: (dateStr: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, logs, settings, onDayClick }) => {
  return (
    <div className="bg-brand-white rounded-3xl shadow-sm border border-brand-grey overflow-hidden">
        <div className="grid grid-cols-7 bg-brand-black text-brand-white py-4 text-xs font-bold uppercase tracking-widest text-center">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
        </div>
        <div className="divide-y divide-brand-grey">
             <div className="flex flex-col">
                {days.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const log = logs[dateStr] || { date: dateStr, timeIn: '', breakStart: '', breakEnd: '', timeOut: '' };
                    const stats: DailyStats = calculateDailyStats(log, settings);
                    // Only Sunday (0) is weekend/rest day now. Mon-Sat are working days.
                    const isRestDay = day.getDay() === 0;
                    
                    return (
                        <div 
                            key={dateStr}
                            onClick={() => onDayClick(dateStr)}
                            className={`
                                group flex items-center justify-between p-4 hover:bg-brand-grey/30 cursor-pointer transition-colors border-l-4
                                ${isRestDay ? 'bg-brand-grey/20 border-l-transparent' : 'border-l-transparent hover:border-l-brand-blue'}
                                ${stats.isComplete ? 'border-l-brand-blue' : ''}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-12 h-12 rounded-xl flex flex-col items-center justify-center border
                                    ${stats.isComplete ? 'bg-brand-blue text-white border-brand-blue' : isRestDay ? 'bg-brand-grey text-brand-darkGrey border-brand-grey' : 'bg-white text-brand-black border-brand-grey'}
                                `}>
                                    <span className="text-[10px] font-bold uppercase leading-none mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-lg font-bold leading-none">{day.getDate()}</span>
                                </div>
                                
                                <div className="flex flex-col">
                                    {stats.totalHours > 0 ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-brand-black text-lg">{stats.totalHours.toFixed(1)}h</span>
                                            {stats.lateHours > 0 && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                                    Late: {stats.lateHours.toFixed(2)}h
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className={`text-sm font-medium ${isRestDay ? 'text-brand-darkGrey' : 'text-brand-black/40'}`}>
                                            {isRestDay ? 'Rest Day' : 'No Entry'}
                                        </span>
                                    )}
                                    <div className="text-xs text-brand-darkGrey flex gap-2 mt-0.5">
                                        <span>In: {formatTimeDisplay(log.timeIn)}</span>
                                        <span className="text-brand-grey">|</span>
                                        <span>Out: {formatTimeDisplay(log.timeOut)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {stats.earnings > 0 && (
                                    <div className="text-right hidden sm:block">
                                        <div className="text-sm font-bold text-brand-blue">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: settings.currency }).format(stats.earnings)}
                                        </div>
                                        <div className="text-xs text-brand-darkGrey">Earned</div>
                                    </div>
                                )}
                                <ChevronRight className="w-5 h-5 text-brand-grey group-hover:text-brand-blue transition-colors" />
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>
    </div>
  );
};

export default CalendarGrid;