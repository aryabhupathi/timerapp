import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useTimerStore } from "../store/useTimerStore";
import { validateTimerForm } from "../utils/validation";
import { toast } from "sonner";

interface AddEditProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: {
    id: string;
    title: string;
    description?: string;
    duration: number;
  } | null;
}

export const AddEditModal: React.FC<AddEditProps> = ({
  isOpen,
  onClose,
  timer,
}) => {
  const isEditing = !!timer;
  //states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const parts = ["Hours", "Minutes", "Seconds"];

  const { addTimer, editTimer } = useTimerStore();
  //get data for editing
  useEffect(() => {
    if (isEditing && timer) {
      setTitle(timer.title);
      setDescription(timer.description || "");
      setHours(Math.floor(timer.duration / 3600));
      setMinutes(Math.floor((timer.duration % 3600) / 60));
      setSeconds(timer.duration % 60);
    } else {
      setTitle("");
      setDescription("");
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  }, [isEditing, isOpen, timer]);

  if (!isOpen) return null;
  //form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    //validation on submit
    if (
      !validateTimerForm({ title, description, hours, minutes, seconds })
    ) {
      toast.error("Failed to save timer. Please fix the errors.");
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (isEditing && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
      toast.success("Timer updated successfully!", {
        duration: 3000,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
      });
      toast.success("Timer added successfully!", {
        duration: 3000,
      });
    }
    onClose();
    setFormSubmitted(false);
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        {/* modal landing page */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Timer" : "Add New Timer"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* title field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter timer title"
            />
          </div>
          {/* description fielg */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter timer description (optional)"
            />
          </div>
          {/* time field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {parts.map((label, index) => (
                <div key={label}>
                  <label className="block text-sm text-gray-600 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={index === 0 ? 23 : 59}
                    value={[hours, minutes, seconds][index]}
                    onChange={(e) => {
                      const value = Math.min(
                        index === 0 ? 23 : 59,
                        parseInt(e.target.value) || 0
                      );
                      if (index === 0) setHours(value);
                      else if (index === 1) setMinutes(value);
                      else setSeconds(value);
                    }}
                    onBlur={() => setTouched({ ...touched, hours: true })}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* buttons according to save or edit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors "bg-blue-600 hover:bg-blue-700" ${
                isTitleValid && isTimeValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
            >
              {isEditing ? "Save Changes" : "Add Timer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
