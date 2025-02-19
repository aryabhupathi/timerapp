import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "./components/TimerList";
import { Toaster } from "sonner";
import { AddEditModal } from "./components/AddEditModal";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Timer App</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Timer
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-8">
          <TimerList />

          <AddEditModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTimer(null);
            }}
            timer={selectedTimer}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
