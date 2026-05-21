import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import IntroStep from './components/IntroStep.tsx';
import MeasuringAnimation from './components/MeasuringAnimation.tsx';
import FinalReport from './components/FinalReport.tsx';
import IncarnationsList from './components/IncarnationsList.tsx';
import TribulationTrial from './components/TribulationTrial.tsx';
import BackgroundMusic from './components/BackgroundMusic.tsx';
import { CharacterProfile } from './types.ts';

const LOCAL_STORAGE_KEY = 'tienduyen_incarnations_history_v2';

export default function App() {
  const [step, setStep] = useState<'INTRO' | 'MEASURING' | 'REPORT' | 'TRIBULATION'>('INTRO');
  const [daoHieu, setDaoHieu] = useState('');
  const [originId, setOriginId] = useState('');
  const [gender, setGender] = useState('');
  const [currentProfile, setCurrentProfile] = useState<CharacterProfile | null>(null);
  const [history, setHistory] = useState<CharacterProfile[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi khi khôi phục sử ký thiên cơ:", e);
    }
  }, []);

  // Save history to localStorage helper
  const saveHistory = (newHistory: CharacterProfile[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Lỗi khi đồng bộ sử ký thiên cơ vào linh thức:", e);
    }
  };

  const handleStartMeasuring = (name: string, origin: string, gen: string) => {
    setDaoHieu(name);
    setOriginId(origin);
    setGender(gen);
    setStep('MEASURING');
  };

  const handleMeasuringComplete = (profile: CharacterProfile) => {
    setCurrentProfile(profile);
    
    // Save to history list
    const updatedHistory = [profile, ...history.filter(p => p.id !== profile.id && p.daoHieu !== profile.daoHieu)].slice(0, 30); // max 30 records
    saveHistory(updatedHistory);
    
    setStep('REPORT');
  };

  const handleSelectProfileFromHistory = (profile: CharacterProfile) => {
    setCurrentProfile(profile);
    setStep('REPORT');
    // Scroll window to top so report is fully visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent selecting the deleted card
    const updated = history.filter(p => p.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm("Đạo hữu có chắc chắn muốn xóa sạch toàn bộ tiên ký tu tiên đã đo lường không? Kiếp cốt trần ai sẽ tan biến hoàn toàn hằng vĩnh!")) {
      saveHistory([]);
    }
  };

  const handleReset = () => {
    setStep('INTRO');
    setCurrentProfile(null);
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f0ead6] flex flex-col font-sans selection:bg-gold-theme selection:text-[#07080a] relative overflow-x-hidden">
      
      {/* Decorative cosmic background vectors */}
      <div className="absolute inset-0 bg-mist pointer-events-none z-0"></div>
      <div className="absolute top-[10%] left-[2%] w-72 h-72 rounded-full bg-amber-950/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[2%] w-96 h-96 rounded-full bg-yellow-950/5 blur-[150px] pointer-events-none"></div>
      <BackgroundMusic />
      {/* Traditional Header Layer */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* Primary Interactive viewport stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-start z-10">
        
        {step === 'INTRO' && (
          <IntroStep onStartMeasuring={handleStartMeasuring} />
        )}

        {step === 'MEASURING' && (
          <MeasuringAnimation 
            daoHieu={daoHieu} 
            originId={originId}
            gender={gender}
            onComplete={handleMeasuringComplete} 
          />
        )}

        {step === 'REPORT' && currentProfile && (
          <FinalReport
            profile={currentProfile}
            onReset={handleReset}
            onStartTribulation={() => setStep('TRIBULATION')}
          />
        )}

        {step === 'TRIBULATION' && currentProfile && (
          <TribulationTrial
            profile={currentProfile}
            onComplete={handleMeasuringComplete}
            onBack={() => setStep('REPORT')}
          />
        )}

        {/* Persistent history index (only visible when not currently calibrating/measuring) */}
        {step !== 'MEASURING' && step !== 'TRIBULATION' && (
          <IncarnationsList 
            history={history}
            onSelectProfile={handleSelectProfileFromHistory}
            onDeleteProfile={handleDeleteProfile}
            onClearHistory={handleClearHistory}
          />
        )}

      </main>

      {/* Traditional Aesthetic Footer credits */}
      <footer className="w-full border-t border-dark-gold/20 py-6 px-4 md:px-8 bg-zinc-950/90 z-20 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-serif text-gold-theme/60 italic">
          <p>
            "Nhất niệm thành tiên, nhất niệm thành ma. Chân Đạo vốn bất diệt."
          </p>
          <p className="font-sans text-[10px] uppercase tracking-widest not-italic">
            © {new Date().getFullYear()} Thiên Cơ Các Linh Quy Pháp Điện • All Rights Reserved
          </p>
        </div>
      </footer>

    </div>
  );
}
