import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, Flame, Layers, Lock, Shield, Sparkles, Zap } from 'lucide-react';
import { CharacterProfile, LinhCan, Physique, Realm } from '../types.ts';
import { calculateProfile, LINH_CANS, ORIGINS, PHYSIQUES, REALMS } from '../data.ts';
import { playResultChimeSound, playRollTickSound, playThunderSound, startRollingSound, stopRollingSound } from '../soundEffects.ts';

interface TribulationTrialProps {
  profile: CharacterProfile;
  onComplete: (profile: CharacterProfile) => void;
  onBack: () => void;
}

const PHAM_THAI_PHYSIQUE: Physique = {
  id: 'pham_thai',
  name: 'Phàm Thai Nhục Thân',
  characteristic: 'Nhục thân thường tục thanh bạch, chưa khai thông huyết mạch thượng cổ.',
  advantage: 'Tu luyện gian nan hơn người khác nhưng tôi luyện Đạo Tâm kiên định tuyệt đối, không dựa dẫm dị năng.',
  rarity: 'F',
  combatBoost: 0
};

const ALL_PHYSIQUES_POOL = [...PHYSIQUES, PHAM_THAI_PHYSIQUE];

const rankTribulationBonus: Record<CharacterProfile['rank'], number> = {
  F: -0.12,
  D: -0.06,
  C: 0,
  B: 0.04,
  A: 0.09,
  S: 0.14,
  SS: 0.19,
  SSS: 0.24
};

function resolveOriginId(profile: CharacterProfile) {
  if (profile.originId) return profile.originId;
  return ORIGINS.find(origin => origin.name === profile.origin)?.id || ORIGINS[0].id;
}

function getRankBadgeClasses(rank: string) {
  switch (rank) {
    case 'SSS': return 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
    case 'SS': return 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    case 'S': return 'bg-yellow-950 border-yellow-500 text-yellow-300';
    case 'A': return 'bg-purple-950 border-purple-500/80 text-purple-300';
    case 'B': return 'bg-blue-950 border-blue-500/60 text-blue-300';
    case 'C': return 'bg-emerald-950 border-emerald-500/50 text-emerald-300';
    default: return 'bg-neutral-900 border-neutral-700 text-neutral-400';
  }
}

export default function TribulationTrial({ profile, onComplete, onBack }: TribulationTrialProps) {
  const [trialState, setTrialState] = useState<'JUDGING' | 'FAILED' | 'SPINNING' | 'COMPLETE'>('JUDGING');
  const [displayedRealm, setDisplayedRealm] = useState<Realm>(REALMS[0]);
  const [displayedLinhCan, setDisplayedLinhCan] = useState<LinhCan>(LINH_CANS[0]);
  const [displayedPhysique, setDisplayedPhysique] = useState<Physique>(ALL_PHYSIQUES_POOL[0]);
  const timersRef = useRef<number[]>([]);

  const trialSeed = useMemo(() => `${Date.now()}_${Math.random()}`, []);
  const successChance = useMemo(() => {
    const chance = 0.3 + profile.radarStats.fateLuck / 250 + rankTribulationBonus[profile.rank];
    return Math.min(0.86, Math.max(0.18, chance));
  }, [profile.radarStats.fateLuck, profile.rank]);
  const isSuccess = useMemo(() => Math.random() < successChance, [successChance]);
  const nextProfile = useMemo(() => {
    return calculateProfile(profile.daoHieu, resolveOriginId(profile), profile.gender, `do_kiep_${trialSeed}`);
  }, [profile, trialSeed]);
  const targetPhysique = nextProfile.physique || PHAM_THAI_PHYSIQUE;

  useEffect(() => {
    playThunderSound();

    const judgmentTimer = window.setTimeout(() => {
      if (!isSuccess) {
        setTrialState('FAILED');
        playThunderSound();
        return;
      }

      setTrialState('SPINNING');
      startRollingSound();

      const interval = window.setInterval(() => {
        setDisplayedRealm(REALMS[Math.floor(Math.random() * REALMS.length)]);
        setDisplayedLinhCan(LINH_CANS[Math.floor(Math.random() * LINH_CANS.length)]);
        setDisplayedPhysique(ALL_PHYSIQUES_POOL[Math.floor(Math.random() * ALL_PHYSIQUES_POOL.length)]);
        playRollTickSound(0.7);
      }, 80);

      const realmTimer = window.setTimeout(() => setDisplayedRealm(nextProfile.realm), 1700);
      const linhCanTimer = window.setTimeout(() => setDisplayedLinhCan(nextProfile.linhCan), 2300);
      const physiqueTimer = window.setTimeout(() => {
        setDisplayedPhysique(targetPhysique);
        window.clearInterval(interval);
        setTrialState('COMPLETE');
        playResultChimeSound();
      }, 3000);

      timersRef.current.push(interval, realmTimer, linhCanTimer, physiqueTimer);
    }, 1000);

    timersRef.current.push(judgmentTimer);

    return () => {
      timersRef.current.forEach(timer => window.clearTimeout(timer));
      stopRollingSound();
    };
  }, [isSuccess, nextProfile.linhCan, nextProfile.realm, targetPhysique]);

  if (trialState === 'FAILED') {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 z-10">
        <div className="border border-red-900/70 bg-red-950/10 rounded-lg min-h-[420px] flex flex-col items-center justify-center text-center px-6 shadow-[0_0_60px_rgba(127,29,29,0.25)]">
          <Flame className="w-16 h-16 text-red-400 mb-5 animate-pulse" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-red-300 font-mono mb-3">Thiên kiếp thất bại</p>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-red-300 glow-text">
            Bị sét đánh chết
          </h2>
          <p className="text-sm text-paper-theme/60 mt-5 max-w-xl leading-relaxed">
            Thiên lôi nhập thể, đạo cơ tán diệt. Bản tổng kết cũ vẫn còn, nhưng lần thử vận may độ kiếp này đã tan thành tro bụi.
          </p>
          <button
            onClick={onBack}
            className="mt-8 px-6 py-3 bg-black/50 border border-red-500/50 text-red-200 rounded text-xs uppercase tracking-widest font-bold hover:bg-red-950/30 transition-all"
          >
            Quay lại tổng kết
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 z-10 flex flex-col items-center justify-start min-h-[600px] relative">
      <div className="text-center mb-8 max-w-2xl">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono text-gold-theme border border-gold-theme/30 px-3 py-1 rounded-full bg-amber-950/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
          Thiên Lôi Độ Kiếp Trận
        </span>
        <h2 className="font-serif text-2xl md:text-4xl text-paper-theme font-bold tracking-wide mt-3 glow-text text-amber-100">
          {trialState === 'JUDGING' ? 'Thiên lôi đang xét mệnh' : trialState === 'COMPLETE' ? 'Độ kiếp thành công' : 'Tái định đạo quả sau độ kiếp'}
        </h2>
        <p className="text-xs text-paper-theme/60 mt-2 font-mono uppercase tracking-widest">
          Xác suất vượt kiếp: <span className="text-gold-theme font-bold">{Math.round(successChance * 100)}%</span>
        </p>
      </div>

      <div className="w-full bg-[#0d0f12] border border-dark-gold/30 rounded-2xl p-5 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-theme/30"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-theme/30"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-theme/30"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-theme/30"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[240px] transition-all duration-300 ${trialState === 'JUDGING' ? 'opacity-40 bg-black/60 border-neutral-800' : trialState === 'COMPLETE' ? 'border-emerald-500/50 bg-[#0c1410]' : 'border-amber-500 bg-amber-950/10 scale-[1.02]'}`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>1. Chiết định cảnh giới</span>
            </div>
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <span className={`text-base md:text-lg font-serif font-bold ${trialState === 'SPINNING' ? 'text-amber-300 animate-pulse blur-[0.4px]' : 'text-gold-theme glow-text'}`}>
                {displayedRealm.name}
              </span>
              {trialState === 'COMPLETE' && (
                <span className="text-[10px] text-paper-theme/50 tracking-wider font-mono mt-0.5">
                  {displayedRealm.stageName} • {displayedRealm.worldName}
                </span>
              )}
            </div>
            <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
              {trialState === 'COMPLETE' ? <CheckCircle className="w-3 h-3" /> : <Zap className="w-3 h-3 animate-pulse" />}
              {trialState === 'COMPLETE' ? 'ĐÃ ĐỊNH' : 'ĐANG TỰ QUAY'}
            </span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[240px] transition-all duration-300 ${trialState === 'JUDGING' ? 'opacity-40 bg-black/60 border-neutral-800' : trialState === 'COMPLETE' ? 'border-emerald-500/50 bg-[#0c1410]' : 'border-amber-500 bg-amber-950/10 scale-[1.02]'}`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              {trialState === 'JUDGING' ? <Lock className="w-3.5 h-3.5 text-neutral-500" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
              <span>2. Đoạt khí linh căn</span>
            </div>
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <span className={`text-sm md:text-base font-serif font-bold ${trialState === 'SPINNING' ? 'text-amber-300 animate-pulse blur-[0.4px]' : 'text-gold-theme glow-text'}`}>
                {displayedLinhCan.name}
              </span>
              {trialState === 'COMPLETE' && (
                <span className={`text-[9px] font-mono px-1.5 rounded border border-current font-bold mt-1 ${getRankBadgeClasses(displayedLinhCan.rarity)}`}>
                  Phẩm {displayedLinhCan.rarity}
                </span>
              )}
            </div>
            <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
              {trialState === 'COMPLETE' ? <CheckCircle className="w-3 h-3" /> : <Zap className="w-3 h-3 animate-pulse" />}
              {trialState === 'COMPLETE' ? 'THÁC KHÍ ĐÃ ĐỊNH' : 'ĐANG TỰ QUAY'}
            </span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center min-h-[240px] transition-all duration-300 ${trialState === 'JUDGING' ? 'opacity-40 bg-black/60 border-neutral-800' : trialState === 'COMPLETE' ? 'border-emerald-500/50 bg-[#0c1410]' : 'border-amber-500 bg-amber-950/10 scale-[1.02]'}`}>
            <div className="flex items-center gap-1.5 text-xs font-serif text-gold-theme/80 uppercase tracking-widest border-b border-dark-gold/10 pb-1.5 w-full justify-center">
              {trialState === 'JUDGING' ? <Lock className="w-3.5 h-3.5 text-neutral-500" /> : <Shield className="w-3.5 h-3.5 text-amber-500" />}
              <span>3. Khảo thể chất khung đơn</span>
            </div>
            <div className="w-full my-4 h-24 bg-black border border-dark-gold/20 rounded-lg shadow-[inset_0_0_15px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <span className={`text-[13px] md:text-sm font-serif font-bold ${trialState === 'SPINNING' ? 'text-amber-300 animate-pulse blur-[0.4px]' : 'text-gold-theme glow-text'}`}>
                {displayedPhysique.name}
              </span>
              {trialState === 'COMPLETE' && (
                <span className={`text-[9px] font-mono px-1.5 rounded border border-current font-bold mt-1 ${getRankBadgeClasses(displayedPhysique.rarity)}`}>
                  {displayedPhysique.rarity} THỂ
                </span>
              )}
            </div>
            <span className="text-emerald-400 font-bold font-mono text-[10px] flex items-center gap-1">
              {trialState === 'COMPLETE' ? <CheckCircle className="w-3 h-3" /> : <Zap className="w-3 h-3 animate-pulse" />}
              {trialState === 'COMPLETE' ? 'THỂ CHẤT ĐÃ ĐỊNH' : 'ĐANG TỰ QUAY'}
            </span>
          </div>
        </div>
      </div>

      {trialState === 'COMPLETE' && (
        <button
          onClick={() => onComplete(nextProfile)}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 border border-emerald-400 text-white rounded text-xs uppercase tracking-widest font-bold hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Xem lại tổng kết
        </button>
      )}
    </div>
  );
}
