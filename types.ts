export interface TimeLog {
  date: string; // YYYY-MM-DD
  timeIn: string; // HH:mm
  breakStart: string; // HH:mm
  breakEnd: string; // HH:mm
  timeOut: string; // HH:mm
}

export interface AppSettings {
  hourlyRate: number;
  currency: string;
  expectedStartTime: string; // HH:mm
}

export interface DailyStats {
  date: string;
  totalHours: number;
  lateHours: number;
  earnings: number;
  isComplete: boolean;
}

export interface MonthlyStats {
  totalHours: number;
  totalLateHours: number;
  totalEarnings: number;
  daysWorked: number;
}