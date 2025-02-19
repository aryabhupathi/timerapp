import { toast } from 'sonner';

export interface TimerFormData {
  title: string;
  description: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export const validateTimerForm = (data: TimerFormData): boolean => {
  const { title, hours, minutes, seconds } = data;
  
  if (!title.trim()) {
    {toast.error('Title is required', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    })};
    return false;
  }

  if (title.length > 50) {
    toast.error('Title must be less than 50 characters', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    });
    return false;
  }

  if (hours < 0 || minutes < 0 || seconds < 0) {
    toast.error('Time values cannot be negative', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    });
    return false;
  }

  if (minutes > 59 || seconds > 59) {
    toast.error('Minutes and seconds must be between 0 and 59', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    });
    return false;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (totalSeconds === 0) {
    toast.error('Please set a time greater than 0', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    });
    return false;
  }

  if (totalSeconds > 86400) { // 24 hours
    toast.error('Timer cannot exceed 24 hours', {
      position: window.innerWidth < 768 ? "bottom-center" : "top-right",
    });
    return false;
  }

  return true;
};