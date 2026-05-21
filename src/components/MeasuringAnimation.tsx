import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Shield, Lock, ArrowRight, Zap, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { CharacterProfile, Realm, LinhCan, Physique } from '../types.ts';
import { REALMS, LINH_CANS, PHYSIQUES, calculateProfile, REALM_QUOTES } from '../data.ts';

interface MeasuringAnimationProps {
  daoHieu: string;
  originId: string;
  gender: string;
  onComplete: (profile: CharacterProfile) => void;
}

// Defining a placeholder for standard/no special physical constitution
const PHAM_THAI_PHYSIQUE: Physique = {
  id: 'pham_thai',
  name: 'Phàm Thai Nhục Thân',
  characteristic: 'Nhục thân thường tục thanh bạch, chưa khai thông huyết mạch thượng cổ.',
  advantage: 'Tu luyện gian nan hơn người khác nhưng tôi luyện Đạo Tâm kiên định tuyệt đối, không dựa dẫm dị năng.',
  rarity: 'F',
  combatBoost: 0
};

// Complete list of physiques including Phàm Thai
const ALL_PHYSIQUES_POOL = [...PHYSIQUES, PHAM_THAI_PHYSIQUE];

// Spin timing list for smooth decelerating machine roll effect (~3.2 seconds total)
const SPIN_DELAYS = [
  35, 35, 35, 35, 35, 35, 35, 35, 40, 40,
  45, 50, 55, 60, 70, 80, 95, 115, 140, 170, 205, 245, 295, 355, 425, 510, 615, 740, 890
];

export default function MeasuringAnimation({ 
  daoHieu, originId, gender, onComplete 
}: MeasuringAnimationProps) {

  // 1. Calculate the final deterministic profile right at the beginning
  const finalProfile = useMemo(() => {
    return calculateProfile(daoHieu, originId, gender);
  }, [daoHieu, originId, gender]);

  // Target values to land on
  const targetRealm = finalProfile.realm;
  const targetLinhCan = finalProfile.linhCan;
  const targetPhysique = finalProfile.physique ? finalProfile.physique : PHAM_THAI_PHYSIQUE;

  // 2. States for Slot Wheel step resolution
  // Slot States:
  // - REALM: 'READY' | 'SPINNING' | 'RESOLVED'
  // - LINH_CAN: 'LOCKED' | 'READY' | 'SPINNING' | 'RESOLVED'
  // - PHYSIQUE: 'LOCKED' | 'READY' | 'SPINNING' | 'RESOLVED'
  const [realmState, setRealmState] = useState<'READY' | 'SPINNING' | 'RESOLVED'>('READY');
  const [linhCanState, setLinhCanState] = useState<'LOCKED' | 'READY' | 'SPINNING' | 'RESOLVED'>('LOCKED');
  const [physiqueState, setPhysiqueState] = useState<'LOCKED' | 'READY' | 'SPINNING' | 'RESOLVED'>('LOCKED');

  // Currently displayed items in the rotating slot machine screens
  const [displayedRealm, setDisplayedRealm] = useState<Realm>(REALMS[0]);
  const [displayedLinhCan, setDisplayedLinhCan] = useState<LinhCan>(LINH_CANS[0]);
  const [displayedPhysique, setDisplayedPhysique] = useState<Physique>(ALL_PHYSIQUES_POOL[0]);

  // Physical lever pull downward state
  const [leverActive, setLeverActive] = useState(false);
  const [leverFeedbackText, setLeverFeedbackText] = useState('Hãy gạt cần Thiên Cơ hoặc bấm nút Khai Mạch bên dưới!');

  // Rotating quote for decorative ambiance
  const [decorQuote, setDecorQuote] = useState(REALM_QUOTES[0]);

  // Timeout reference for cleaning up
  const spinIntervalRef = useRef<any>(null);

  // Derive current active segment to display pool items
  const activeSegment = useMemo<'REALM' | 'LINH_CAN' | 'PHYSIQUE' | 'COMPLETE'>(() => {
    if (realmState !== 'RESOLVED') return 'REALM';
    if (linhCanState !== 'RESOLVED') return 'LINH_CAN';
    if (physiqueState !== 'RESOLVED') return 'PHYSIQUE';
    return 'COMPLETE';
  }, [realmState, linhCanState, physiqueState]);

  // Cycle decorative quotes in the background
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      const randomQuote = REALM_QUOTES[Math.floor(Math.random() * REALM_QUOTES.length)];
      setDecorQuote(randomQuote);
    }, 5000);
    return () => {
      clearInterval(quoteInterval);
      if (spinIntervalRef.current) clearTimeout(spinIntervalRef.current);
    };
  }, []);

  // 3. Recursive Slot Spin Deceleration Engine
  const startSpinning = (
    pool: any[], 
    targetItem: any, 
    setDisplay: (item: any) => void, 
    onSettle: () => void
  ) => {
    if (spinIntervalRef.current) clearTimeout(spinIntervalRef.current);
    
    let step = 0;
    
    const spinTick = () => {
      if (step >= SPIN_DELAYS.length) {
        // Safe landed land target precisely
        setDisplay(targetItem);
        onSettle();
        return;
      }

      // Roll a random item from the pool to simulate reel passing
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setDisplay(randomItem);

      const delay = SPIN_DELAYS[step];
      step++;
      spinIntervalRef.current = setTimeout(spinTick, delay);
    };

    spinTick();
  };

  // 4. Trigger actions when pulling the mechanical lever
  const handleLeverPull = () => {
    // If anything is currently spinning, prevent clicking again
    if (realmState === 'SPINNING' || linhCanState === 'SPINNING' || physiqueState === 'SPINNING') return;
    
    // If all steps resolved, doing nothing (user needs to click Complete button)
    if (realmState === 'RESOLVED' && linhCanState === 'RESOLVED' && physiqueState === 'RESOLVED') return;

    // Pull down mechanical feedback
    setLeverActive(true);

    setTimeout(() => {
      setLeverActive(false);

      // Perform spin matching active step
      if (realmState === 'READY') {
        setRealmState('SPINNING');
        setLeverFeedbackText('Đang ngưng khí hội tụ tinh linh Thần Cấp...');
        startSpinning(REALMS, targetRealm, setDisplayedRealm, () => {
          setRealmState('RESOLVED');
          setLinhCanState('READY');
          setLeverFeedbackText('Thần Mạch Cảnh Giới đã được an bài! Tiếp tục gạt cần để thấu đo Linh Căn...');
        });
      } else if (linhCanState === 'READY') {
        setLinhCanState('SPINNING');
        setLeverFeedbackText('Đang sàng lọc phong ba ngũ hành tịnh cốt...');
        startSpinning(LINH_CANS, targetLinhCan, setDisplayedLinhCan, () => {
          setLinhCanState('RESOLVED');
          setPhysiqueState('READY');
          setLeverFeedbackText('Linh Căn Nguyên Phách đã giác ngộ! Gạt cần lần cuối để dò nghiệm Cổ Thể Chất...');
        });
      } else if (physiqueState === 'READY') {
        setPhysiqueState('SPINNING');
        setLeverFeedbackText('Cửu Thiên lôi lôi lôi kiếm phạt cốt hoán diệt đặc thể...');
        startSpinning(ALL_PHYSIQUES_POOL, targetPhysique, setDisplayedPhysique, () => {
          setPhysiqueState('RESOLVED');
          setLeverFeedbackText('Tam Sinh Thiên Cơ Pháp Trận Viên Mãn Lịch Kiếp! Hãy xem Tiên Bản Lục bản mệnh phía dưới!');
        });
      }
    }, 400); // Spring-back time
  };

  // Badge background helper depending on rank
  const getRankBadgeClasses = (rank: string) => {
    switch (rank) {
      case 'SSS': return 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
      case 'SS': return 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'S': return 'bg-yellow-950 border-yellow-500 text-yellow-300';
      case 'A': return 'bg-purple-950 border-purple-500/80 text-purple-300';
      case 'B': return 'bg-blue-950 border-blue-500/60 text-blue-300';
      case 'C': return 'bg-emerald-950 border-emerald-500/50 text-emerald-300';
      default: return 'bg-neutral-900 border-neutral-700 text-neutral-400';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 z-10 flex flex-col items-center justify-start min-h-[600px] relative">
      
      {/* Decorative Traditional Circular Aura in background */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-dark-gold/10 pointer-events-none animate-spin-slow"></div>

      {/* Intro Header Segment */}
      <div className="text-center mb-8 max-w-2xl">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono text-gold-theme border border-gold-theme/30 px-3 py-1 rounded-full bg-amber-950/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
          ☯ Quỹ Thiên Nghi Thước Trận
        </span>
        <h2 className="font-serif text-2xl md:text-4xl text-paper-theme font-bold tracking-wide mt-3 glow-text text-amber-100">
          Khai Mở Tam Sinh Đạo Quả
        </h2>
        <p className="text-xs text-paper-theme/60 mt-2 font-mono uppercase tracking-widest">
          Đạo Hữu: <span className="text-gold-theme font-serif font-bold not-italic">{daoHieu}</span> ({gender === 'Nam' ? 'Nam Tu' : 'Nữ Tu'})
        </p>
      </div>

      {/* Main interactive compartment grid: Slots on left/center + Lever column on right */}
      <div className="w-full bg-[#0d0f12] border border-dark-gold/30 rounded-2xl p-5 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row gap-6 relative">
        
        {/* Aesthetic Corner Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-theme/30"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-theme/30"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-theme/30"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-theme/30"></div>

        {/* 1. THREE SLOTS PANEL COLUMN */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* SLOT 1: Thần Mạch Cảnh Giới */}
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[200px] md:min-h-[250px] transition-all duration-300 relative ${
            realmState === 'SPINNING' ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' :
            realmState === 'RESOLVED' ? 'border-emerald-500/50 bg-[#0c1410] shadow-[0_0_15px_rgba(16,185,129,0.08)]' :
            'border-dark-gold/20 bg-black/40'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>1. Chiết Định Cảnh Giới</span>
            </div>

            {/* Cylinder Window Screen */}
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              
              {realmState === 'SPINNING' ? (
                <div className="animate-pulse text-amber-300 font-serif text-lg tracking-wide select-none filter blur-[0.4px]">
                  {displayedRealm.name}
                </div>
              ) : (
                <div className="flex flex-col items-center transition-all duration-300">
                  <span className={`text-base md:text-lg font-serif font-bold text-amber-100 ${realmState === 'RESOLVED' ? 'text-gold-theme glow-text font-black scale-105' : 'opacity-60'}`}>
                    {displayedRealm.name}
                  </span>
                  {realmState === 'RESOLVED' && (
                    <span className="text-[10px] text-paper-theme/50 tracking-wider font-mono mt-0.5">
                      {displayedRealm.stageName} • {displayedRealm.worldName}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="w-full text-[11px] text-paper-theme/60 min-h-[44px]">
              {realmState === 'READY' && (
                <span className="text-amber-500 font-mono tracking-wider animate-pulse uppercase">◀ Có Thể Khai Phá ▶</span>
              )}
              {realmState === 'SPINNING' && (
                <span className="text-amber-400 font-mono italic animate-pulse">Linh châu đang xoay...</span>
              )}
              {realmState === 'RESOLVED' && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ĐÃ ĐỊNH
                  </span>
                  <p className="text-[10px] text-paper-theme/40 line-clamp-2 italic leading-relaxed">
                    Thọ nguyên {displayedRealm.baseLifespan.toLocaleString()} năm
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SLOT 2: Bản Khí Linh Căn */}
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[200px] md:min-h-[250px] transition-all duration-300 relative ${
            linhCanState === 'LOCKED' ? 'opacity-35 bg-black/60 border-neutral-800' :
            linhCanState === 'READY' ? 'border-amber-500/80 bg-amber-950/5 shadow-[0_0_18px_rgba(245,158,11,0.12)] animate-pulse-slow scale-[1.01]' :
            linhCanState === 'SPINNING' ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' :
            'border-emerald-500/50 bg-[#0c1410] shadow-[0_0_15px_rgba(16,185,129,0.08)]'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              {linhCanState === 'LOCKED' ? (
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>2. Đoạt Khí Linh Căn</span>
            </div>

            {/* Cylinder Window Screen */}
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

              {linhCanState === 'LOCKED' ? (
                <div className="text-neutral-600 font-serif text-xs px-2 leading-relaxed flex flex-col items-center gap-1 select-none">
                  <Lock className="w-5 h-5 opacity-40" />
                  <span>Xích Trận Phong Ấn</span>
                </div>
              ) : linhCanState === 'SPINNING' ? (
                <div className="animate-pulse text-amber-300 font-serif text-lg tracking-wide select-none filter blur-[0.4px]">
                  {displayedLinhCan.name}
                </div>
              ) : (
                <div className="flex flex-col items-center transition-all duration-300 text-center">
                  <span className={`text-sm md:text-base font-serif font-bold text-amber-100 ${linhCanState === 'RESOLVED' ? 'text-gold-theme glow-text font-black scale-105' : 'opacity-60'}`}>
                    {displayedLinhCan.name}
                  </span>
                  {linhCanState === 'RESOLVED' && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] font-mono px-1.5 rounded border border-current font-bold ${getRankBadgeClasses(displayedLinhCan.rarity)}`}>
                        Phẩm {displayedLinhCan.rarity}
                      </span>
                      <span className="text-[10px] text-paper-theme/50 font-mono">
                        X{displayedLinhCan.cultivationMulti} Tu Đạo
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full text-[11px] text-paper-theme/60 min-h-[44px]">
              {linhCanState === 'LOCKED' && <span className="text-neutral-600 font-mono text-[10px]">Đợi định Cảnh Giới...</span>}
              {linhCanState === 'READY' && (
                <span className="text-amber-500 font-mono tracking-wider animate-pulse uppercase">◀ Sẵn Sàng Gạt Cần ▶</span>
              )}
              {linhCanState === 'SPINNING' && (
                <span className="text-amber-400 font-mono italic animate-pulse">Tinh quang đang luân chuyển...</span>
              )}
              {linhCanState === 'RESOLVED' && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> THÁC KHÍ ĐÃ ĐỊNH
                  </span>
                  <p className="text-[9px] text-paper-theme/40 line-clamp-2 leading-tight">
                    Công hiệu: {displayedLinhCan.advantage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SLOT 3: Thượng Cổ Thể Chất Đặc Biệt */}
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[200px] md:min-h-[250px] transition-all duration-300 relative ${
            physiqueState === 'LOCKED' ? 'opacity-35 bg-black/60 border-neutral-800' :
            physiqueState === 'READY' ? 'border-amber-500/80 bg-amber-950/5 shadow-[0_0_18px_rgba(245,158,11,0.12)] animate-pulse-slow scale-[1.01]' :
            physiqueState === 'SPINNING' ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' :
            'border-emerald-500/50 bg-[#0c1410] shadow-[0_0_15px_rgba(16,185,129,0.08)]'
          }`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              {physiqueState === 'LOCKED' ? (
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>3. Khảo Thể Chất Khung Đơn</span>
            </div>

            {/* Cylinder Window Screen */}
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

              {physiqueState === 'LOCKED' ? (
                <div className="text-neutral-600 font-serif text-xs px-2 leading-relaxed flex flex-col items-center gap-1 select-none">
                  <Lock className="w-5 h-5 opacity-40" />
                  <span>Cửu Thiên Đỉnh Phong Ấn</span>
                </div>
              ) : physiqueState === 'SPINNING' ? (
                <div className="animate-pulse text-amber-300 font-serif text-lg tracking-wide select-none filter blur-[0.4px]">
                  {displayedPhysique.name}
                </div>
              ) : (
                <div className="flex flex-col items-center transition-all duration-300 text-center">
                  <span className={`text-[13px] md:text-sm font-serif font-bold text-amber-100 ${physiqueState === 'RESOLVED' ? 'text-gold-theme glow-text font-black scale-105' : 'opacity-60'}`}>
                    {displayedPhysique.name}
                  </span>
                  {physiqueState === 'RESOLVED' && displayedPhysique.id !== 'pham_thai' && (
                    <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded border border-current font-bold mt-1 ${getRankBadgeClasses(displayedPhysique.rarity)}`}>
                      {displayedPhysique.rarity} CỔ THỂ
                    </span>
                  )}
                  {physiqueState === 'RESOLVED' && displayedPhysique.id === 'pham_thai' && (
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded border border-neutral-700 font-medium mt-1 bg-neutral-900 text-neutral-400">
                      BẢN THỂ TỰ NHIÊN
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="w-full text-[11px] text-paper-theme/60 min-h-[44px]">
              {physiqueState === 'LOCKED' && <span className="text-neutral-600 font-mono text-[10px]">Đợi định Linh Căn...</span>}
              {physiqueState === 'READY' && (
                <span className="text-amber-500 font-mono tracking-wider animate-pulse uppercase">◀ Thân cốt khai quan ▶</span>
              )}
              {physiqueState === 'SPINNING' && (
                <span className="text-amber-400 font-mono italic animate-pulse">Lôi hỏa luyện tủy sấm sét...</span>
              )}
              {physiqueState === 'RESOLVED' && (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> THỂ CHẤT ĐÃ ĐỊNH
                  </span>
                  <p className="text-[9px] text-paper-theme/40 line-clamp-2 leading-tight">
                    Đặc tính: {displayedPhysique.characteristic}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 2. THE MECHANICAL LEVER SIDE COLUMN */}
        <div className="w-full md:w-32 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dark-gold/20 pt-6 md:pt-0 md:pl-6">
          <p className="text-[10px] text-gold-theme uppercase tracking-widest text-center font-serif leading-tight mb-3 opacity-80 hidden md:block">
            Ý NIỆM GẠT CẦN
          </p>

          {/* Lever Box Visual Representation */}
          <div className="relative w-16 h-36 bg-gradient-to-b from-zinc-900 to-black border border-dark-gold/30 rounded-xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Slot bar guide track */}
            <div className="absolute w-2 h-[80%] bg-zinc-950 border border-dark-gold/10 rounded-full"></div>
            
            {/* Lever metal shaft */}
            <div 
              style={{ transformOrigin: 'bottom center' }}
              className={`absolute bottom-6 w-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600 transition-all duration-300 ${
                leverActive ? 'h-8' : 'h-24'
              }`}
            ></div>

            {/* Brass sphere tip handle */}
            <div
              onClick={handleLeverPull}
              className={`absolute select-none cursor-pointer rounded-full bg-red-600 border border-amber-300 shadow-[0_0_12px_rgba(220,38,38,0.8)] flex items-center justify-center hover:bg-red-500 active:scale-95 transition-all duration-300 ${
                leverActive ? 'w-8 h-8 bottom-4 text-[9px] text-white font-serif' : 'w-7 h-7 bottom-[86px] text-[10px] text-white font-serif'
              } ${
                (realmState === 'SPINNING' || linhCanState === 'SPINNING' || physiqueState === 'SPINNING' || activeSegment === 'COMPLETE')
                  ? 'cursor-not-allowed opacity-50 grayscale hover:bg-red-600'
                  : 'animate-pulse'
              }`}
            >
              🚀
            </div>
          </div>

          {/* Small quick tap assistant label */}
          <span className="text-[9px] text-paper-theme/40 font-mono mt-2 text-center text-wrap uppercase tracking-wider hidden md:block">
            Kéo bóng / click ball
          </span>

          {/* Large trigger button for mobile / general easier click */}
          {activeSegment !== 'COMPLETE' ? (
            <button
              onClick={handleLeverPull}
              disabled={realmState === 'SPINNING' || linhCanState === 'SPINNING' || physiqueState === 'SPINNING'}
              className="mt-5 w-full bg-gradient-to-r from-amber-950 via-amber-800 to-yellow-900 border border-gold-theme/50 px-5 py-3 rounded-lg text-xs font-serif font-bold text-gold-theme shadow-[0_0_15px_rgba(197,160,89,0.2)] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:bg-amber-900 duration-200 cursor-pointer disabled:opacity-50 disabled:grayscale tracking-wider uppercase flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${realmState === 'SPINNING' || linhCanState === 'SPINNING' || physiqueState === 'SPINNING' ? 'animate-spin' : ''}`} />
              <span>GẠT THIÊN CƠ</span>
            </button>
          ) : (
            <button
              onClick={() => onComplete(finalProfile)}
              className="mt-5 w-full bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 border border-emerald-400 px-5 py-3 rounded-lg text-xs font-serif font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-900 duration-200 cursor-pointer tracking-wider uppercase flex items-center justify-center gap-2 animate-bounce-subtle"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>XEM BẢN LỤC</span>
            </button>
          )}

        </div>

      </div>

      {/* Decorative prompt instruction feedback bubble */}
      <div className="w-full max-w-xl mx-auto text-center mt-5 mb-8 bg-zinc-950/80 border border-dark-gold/15 py-3 px-6 rounded-lg font-serif italic text-xs text-gold-theme/80 leading-relaxed shadow-[inset_0_1px_5px_rgba(0,0,0,0.8)]">
        ☯ {leverFeedbackText}
      </div>

      {/* 3. DYNAMIC PRIZE POOL DICTIONARY LIST (Ở từng phần hiển thị những gì có thể random được) */}
      <div className="w-full border-t border-dark-gold/20 pt-8 mt-4 z-10 w-full">
        
        {/* Row Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-paper-theme tracking-wide flex items-center gap-2">
              <span className="text-gold-theme">📖 Tiên Bản Căn Cơ Pháp Thể</span>
              <span className="text-xs text-paper-theme/40 italic font-normal">(Kho dữ liệu trắc định tiên mạch)</span>
            </h3>
            <p className="text-[10px] text-paper-theme/40 uppercase tracking-widest mt-1">
              Phàm thọ vạn duyên linh thức đối chứng
            </p>
          </div>

          {/* Quick tab info for context awareness */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#f0ead6]/30">Danh Sách Đang Xem:</span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-amber-950/40 text-gold-theme font-bold border border-gold-theme/20 rounded">
              {activeSegment === 'REALM' && 'Thần Mạch Cảnh Giới (13 bậc)'}
              {activeSegment === 'LINH_CAN' && 'Ngũ Hành Linh Căn (14 thể)'}
              {activeSegment === 'PHYSIQUE' && 'Thượng Cổ Thể Chất (9 dạng)'}
              {activeSegment === 'COMPLETE' && 'Toàn Bộ Chân Nhân Viên Mãn 💮'}
            </span>
          </div>
        </div>

        {/* Dynamic Display Pools */}

        {/* A. REALM POOL LIST */}
        {activeSegment === 'REALM' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 transition-opacity duration-300 animate-fade-in">
            {REALMS.map((r) => {
              const works = r.world === 'NHAN_GIOI' ? 'Nhân' : r.world === 'LINH_GIOI' ? 'Linh' : 'Tiên';
              const isSelected = r.id === displayedRealm.id;
              const isFinalMatched = realmState === 'RESOLVED' && r.id === targetRealm.id;

              return (
                <div
                  key={r.id}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 select-none ${
                    isFinalMatched ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-[1.03] ring-1 ring-emerald-500' :
                    isSelected ? 'bg-amber-950/30 border-amber-500/80 scale-[1.01]' :
                    'bg-zinc-950/60 border-neutral-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 w-full">
                    <span className={`text-[9px] font-bold uppercase tracking-wider font-mono ${
                      r.world === 'TIEN_GIOI' ? 'text-rose-400' : r.world === 'LINH_GIOI' ? 'text-purple-400' : 'text-emerald-400'
                    }`}>
                      {works} giới
                    </span>
                    <span className="text-[9px] text-gold-theme/40 font-mono">
                      Lực: {r.powerRating}
                    </span>
                  </div>
                  <h4 className={`font-serif text-xs font-bold leading-tight mt-1.5 ${isSelected ? 'text-amber-100 glow-text' : 'text-paper-theme/85'}`}>
                    {r.name}
                  </h4>
                  <p className="text-[9px] text-paper-theme/30 font-mono mt-1">
                    Thọ: {r.baseLifespan.toLocaleString()} năm
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* B. LINH_CAN POOL LIST */}
        {activeSegment === 'LINH_CAN' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 transition-opacity duration-300 animate-fade-in">
            {LINH_CANS.map((lc) => {
              const isSelected = lc.id === displayedLinhCan.id;
              const isFinalMatched = linhCanState === 'RESOLVED' && lc.id === targetLinhCan.id;

              return (
                <div
                  key={lc.id}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 select-none ${
                    isFinalMatched ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-[1.03] ring-1 ring-emerald-500' :
                    isSelected ? 'bg-amber-950/30 border-amber-500/80 scale-[1.01]' :
                    'bg-zinc-950/60 border-neutral-800/60 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[8.5px] font-mono font-bold px-1.5 rounded border border-current ${getRankBadgeClasses(lc.rarity)}`}>
                      Phẩm {lc.rarity}
                    </span>
                    <span className="text-[9px] text-gold-theme/40 font-mono">
                      X{lc.cultivationMulti} Tốc
                    </span>
                  </div>
                  <h4 className={`font-serif text-xs font-bold mt-2 ${isSelected ? 'text-amber-100 glow-text' : 'text-paper-theme/85'}`}>
                    {lc.name}
                  </h4>
                  <p className="text-[9px] text-paper-theme/30 leading-snug mt-1.5 line-clamp-1 truncate hover:line-clamp-none">
                    Mô tả: {lc.advantage}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* C. PHYSIQUE POOL LIST */}
        {activeSegment === 'PHYSIQUE' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 transition-opacity duration-300 animate-fade-in">
            {ALL_PHYSIQUES_POOL.map((p) => {
              const isSelected = p.id === displayedPhysique.id;
              const isFinalMatched = physiqueState === 'RESOLVED' && p.id === targetPhysique.id;

              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 select-none ${
                    isFinalMatched ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-[1.03] ring-1 ring-emerald-500' :
                    isSelected ? 'bg-amber-950/30 border-amber-500/80 scale-[1.01]' :
                    'bg-zinc-950/60 border-neutral-800/60 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-mono font-bold px-1 rounded border border-current uppercase ${
                      p.rarity === 'SSS' ? 'text-rose-400 border-rose-500 bg-rose-950/40' :
                      p.rarity === 'SS' ? 'text-amber-400 border-amber-500 bg-amber-950/40' :
                      p.rarity === 'S' ? 'text-yellow-400 border-yellow-500 bg-yellow-950/40' :
                      p.rarity === 'F' ? 'text-neutral-500 border-neutral-700 bg-neutral-900/40' :
                      'text-purple-400 border-purple-500/40 bg-purple-950/40'
                    }`}>
                      {p.rarity} Phẩm
                    </span>
                    <span className="text-[9px] text-gold-theme/40 font-mono">
                      +{p.combatBoost} chiến lực
                    </span>
                  </div>
                  <h4 className={`font-serif text-xs font-bold mt-2 ${isSelected ? 'text-amber-100 glow-text' : 'text-paper-theme/85'}`}>
                    {p.name}
                  </h4>
                  <p className="text-[9.5px] text-paper-theme/40 leading-relaxed mt-1 line-clamp-2">
                    {p.characteristic}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* D. WORK COMPLETE SCREEN STATS PREVIEW */}
        {activeSegment === 'COMPLETE' && (
          <div className="bg-emerald-950/10 border border-emerald-500/30 p-4 rounded-xl text-center flex flex-col items-center justify-center animate-pulse-slow">
            <span className="text-xl">🎉</span>
            <p className="font-serif text-sm font-bold text-emerald-400 mt-1 glow-text">
              TIÊN SƠN QUAY THƯỢNG CÁT VIÊN MÃN
            </p>
            <p className="text-xs text-paper-theme/70 mt-1.5 max-w-xl leading-relaxed">
              Vận mệnh tam quy đã quy tụ nhất thế thiên lôi. Hãy lập tức bấm nút <span className="text-amber-300 font-bold font-serif font-sans inline-block">Xem Bản Lục</span> phía trên bên phải để nhận phê ngữ, bảng số liệu ngũ giác, đánh giá phẩm cấp tổng hợp và ký vào sử sách chân đế các kiếp!
            </p>
          </div>
        )}

      </div>

      {/* Philosophy decor quote at lower boundary */}
      <p className="text-[11px] text-gold-theme/50 italic font-serif text-center mt-12 max-w-xl opacity-60 transition-all duration-700">
        {decorQuote}
      </p>

    </div>
  );
}
