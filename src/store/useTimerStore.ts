import { configureStore, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Timer } from "../types/timer";

// get timers from localStorage
const getLocalStorageTime = (): Timer[] => {
  if (typeof window !== "undefined") {
    const storedTimers = localStorage.getItem("timers");
    return storedTimers ? JSON.parse(storedTimers) : [];
  }
  return [];
};

// save timers to localStorage
const setLocalStorageTime = (timers: Timer[]) => {
  localStorage.setItem("timers", JSON.stringify(timers));
};

const initialState = {
  timers: getLocalStorageTime(),
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    addTimer: (state, action) => {
      const newTimer = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      state.timers.push(newTimer);
      setLocalStorageTime(state.timers);
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter((timer) => timer.id !== action.payload);
      setLocalStorageTime(state.timers);
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
        setLocalStorageTime(state.timers);
      }
    },
    updateTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer && timer.isRunning) {
        timer.remainingTime -= 1;
        timer.isRunning = timer.remainingTime > 0;
        setLocalStorageTime(state.timers);
      }
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
        setLocalStorageTime(state.timers);
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find((timer) => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
        setLocalStorageTime(state.timers);
      }
    },
  },
});

const store = configureStore({
  reducer: timerSlice.reducer,
});

export { store };

export const { addTimer, deleteTimer, toggleTimer, updateTimer, restartTimer, editTimer } = timerSlice.actions;

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  return {
    timers,
    addTimer: (timer: Omit<Timer, "id" | "createdAt">) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    updateTimer: (id: string) => dispatch(updateTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};
