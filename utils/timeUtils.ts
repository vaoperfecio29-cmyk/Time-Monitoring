import { TimeLog, DailyStats, AppSettings } from '../types';

export const getTodayStr = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const calculateMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const calculateDailyStats = (log: TimeLog, settings: AppSettings): DailyStats => {
  const { timeIn, breakStart, breakEnd, timeOut } = log;
  
  let totalMinutes = 0;
  let lateMinutes = 0;

  // Calculate Late Time
  if (timeIn && settings.expectedStartTime) {
    const actualStart = calculateMinutes(timeIn);
    const expectedStart = calculateMinutes(settings.expectedStartTime);
    if (actualStart > expectedStart) {
      lateMinutes = actualStart - expectedStart;
    }
  }

  // Calculate Work Time
  if (timeIn && timeOut) {
    const start = calculateMinutes(timeIn);
    const end = calculateMinutes(timeOut);
    
    let workDuration = end - start;

    // Deduct break
    if (breakStart && breakEnd) {
      const bStart = calculateMinutes(breakStart);
      const bEnd = calculateMinutes(breakEnd);
      const breakDuration = bEnd - bStart;
      if (breakDuration > 0) {
        workDuration -= breakDuration;
      }
    }

    if (workDuration > 0) {
      totalMinutes = workDuration;
    }
  }

  const totalHours = totalMinutes / 60;
  const lateHours = lateMinutes / 60;
  
  return {
    date: log.date,
    totalHours,
    lateHours,
    earnings: totalHours * settings.hourlyRate,
    isComplete: !!(timeIn && timeOut)
  };
};

export const getMonthDays = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

export const formatTimeDisplay = (timeStr: string): string => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};