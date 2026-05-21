import React from 'react';
import { Trash2, Shield, Calendar, Award, Trash } from 'lucide-react';
import { CharacterProfile } from '../types.ts';

interface IncarnationsListProps {
  history: CharacterProfile[];
  onSelectProfile: (profile: CharacterProfile) => void;
  onDeleteProfile: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
}

export default function IncarnationsList({ 
  history, onSelectProfile, onDeleteProfile, onClearHistory 
}: IncarnationsListProps) {

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 z-10 border-t border-dark-gold/20 mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-gold-theme tracking-wide flex items-center gap-2 glow-text">
            <span>📚 Ly Kỳ Nhân Quả Lục ({history.length})</span>
          </h3>
          <p className="text-[11px] text-paper-theme/50 uppercase tracking-widest mt-1">
            Ghi chép những kiếp đã qua trong Tiên Trận
          </p>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-red-400 hover:text-red-300 transition-all font-mono uppercase tracking-widest flex items-center gap-1.5 border border-red-500/20 px-3 py-1.5 bg-red-950/20 rounded cursor-pointer"
        >
          <Trash className="w-3.5 h-3.5" />
          Xóa Toàn Bộ Sử Ký
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((p) => {
          // Color tags for each Rank Grade
          const badgeColors = (r: string) => {
            switch(r) {
              case 'SSS': return 'bg-rose-950 border-rose-500/60 text-rose-300';
              case 'SS': return 'bg-amber-950 border-amber-500/60 text-amber-300';
              case 'S': return 'bg-yellow-950 border-yellow-500/50 text-yellow-300';
              case 'A': return 'bg-purple-950 border-purple-500/40 text-purple-300';
              case 'B': return 'bg-blue-950 border-blue-500/30 text-blue-300';
              case 'C': return 'bg-emerald-950 border-emerald-500/30 text-emerald-300';
              default: return 'bg-zinc-900 border-zinc-700 text-zinc-400';
            }
          };

          return (
            <div
              key={p.id}
              onClick={() => onSelectProfile(p)}
              className="flex items-center justify-between p-4 border border-dark-gold/20 bg-zinc-950/55 rounded-lg cursor-pointer hover:bg-neutral-900/45 hover:border-gold-theme/40 transition-all group scale-100 active:scale-[0.98]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${badgeColors(p.rank)}`}>
                    {p.rank}
                  </span>
                  <p className="font-serif font-bold text-paper-theme group-hover:text-gold-theme transition-all truncate">
                    {p.daoHieu}
                  </p>
                </div>
                
                <div className="text-[11px] text-paper-theme/50 mt-1.5 flex flex-wrap gap-x-2 gap-y-1 items-center">
                  <span className="text-gold-theme">{p.realm.name}</span>
                  <span className="opacity-30">•</span>
                  <span>{p.linhCan.name}</span>
                </div>

                <div className="text-[10px] text-paper-theme/30 mt-1.5 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-gold-theme/30" />
                  {new Date(p.timestamp).toLocaleDateString('vi-VN', { 
                    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
              </div>

              <button
                onClick={(e) => onDeleteProfile(p.id, e)}
                className="p-2 ml-2 text-paper-theme/30 hover:text-red-400 rounded-md transition-all self-center hover:bg-red-950/20"
                title="Xóa ghi chép này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
