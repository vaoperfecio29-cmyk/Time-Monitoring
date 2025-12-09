import React from 'react';
import { MonthlyStats } from '../types';
import { Clock, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/timeUtils';

interface DashboardProps {
  stats: MonthlyStats;
  currency: string;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  accentColor: string;
}> = ({ title, value, icon, accentColor }) => (
  <div className={`p-6 rounded-2xl shadow-sm border border-brand-grey bg-brand-white flex flex-col items-start space-y-2 relative overflow-hidden`}>
    <div className={`absolute top-0 left-0 w-1 h-full ${accentColor}`}></div>
    <div className="flex items-center justify-between w-full">
      <h3 className="text-brand-darkGrey text-sm font-bold uppercase tracking-wider">{title}</h3>
      <div className="p-2 rounded-full bg-brand-grey/50">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-brand-black">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, currency, onAnalyze, isAnalyzing }) => {
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hours"
          value={stats.totalHours.toFixed(2) + ' h'}
          icon={<Clock className="w-5 h-5 text-brand-blue" />}
          accentColor="bg-brand-blue"
        />
        <StatCard
          title="Total Earnings"
          value={formatCurrency(stats.totalEarnings, currency)}
          icon={<DollarSign className="w-5 h-5 text-brand-blue" />}
          accentColor="bg-brand-black"
        />
        <StatCard
          title="Total Late"
          value={stats.totalLateHours.toFixed(2) + ' h'}
          icon={<AlertCircle className="w-5 h-5 text-red-600" />}
          accentColor="bg-red-600"
        />
         <StatCard
          title="Days Worked"
          value={stats.daysWorked.toString()}
          icon={<Calendar className="w-5 h-5 text-brand-darkGrey" />}
          accentColor="bg-brand-darkGrey"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-800 text-white rounded-xl shadow-md transition-all disabled:opacity-70 text-sm font-bold tracking-wide uppercase"
        >
           {isAnalyzing ? (
              <>
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               Analyzing...
              </>
           ) : (
             <>
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg>
               Analyze with AI
             </>
           )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;