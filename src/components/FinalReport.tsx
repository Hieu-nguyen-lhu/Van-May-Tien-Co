import React, { useState } from 'react';
import { 
  Sparkles, ShieldAlert, Award, ChevronLeft, Download, Copy, Share2, 
  Flame, Zap, Compass, Heart, Swords, UserCheck, RefreshCw, Feather
} from 'lucide-react';
import { CharacterProfile } from '../types.ts';

interface FinalReportProps {
  profile: CharacterProfile;
  onReset: () => void;
  onStartTribulation: () => void;
}

export default function FinalReport({ profile, onReset, onStartTribulation }: FinalReportProps) {
  const [copied, setCopied] = useState(false);

  const {
    daoHieu, origin, gender, realm, linhCan, physique, rank, ratingScore, philosophicalVerdict, radarStats
  } = profile;

  // Decide colors and glowing halos depending on Rank Grade
  const getRankMeta = (r: typeof rank) => {
    switch(r) {
      case 'SSS': return { bg: 'from-amber-500/30 to-rose-950/40', text: 'text-rose-400', border: 'border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.4)]', badge: 'bg-rose-950 border-rose-500 text-rose-300' };
      case 'SS': return { bg: 'from-amber-500/25 to-amber-950/40', text: 'text-amber-400', border: 'border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.3)]', badge: 'bg-amber-950 border-amber-500 text-amber-300' };
      case 'S': return { bg: 'from-yellow-600/20 to-zinc-950', text: 'text-yellow-400', border: 'border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.25)]', badge: 'bg-yellow-950 border-yellow-500 text-yellow-300' };
      case 'A': return { bg: 'from-purple-900/20 to-zinc-950', text: 'text-purple-400', border: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]', badge: 'bg-purple-950 border-purple-500 text-purple-300' };
      case 'B': return { bg: 'from-blue-900/20 to-zinc-950', text: 'text-blue-400', border: 'border-blue-500/40', badge: 'bg-blue-900/40 border-blue-500 text-blue-300' };
      case 'C': return { bg: 'from-emerald-950/30 to-zinc-950', text: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-950 border-emerald-500 text-emerald-300' };
      case 'D': return { bg: 'from-zinc-900/50 to-zinc-950', text: 'text-zinc-400', border: 'border-zinc-700', badge: 'bg-zinc-800 border-zinc-600 text-zinc-300' };
      default: return { bg: 'from-zinc-900/50 to-zinc-950', text: 'text-red-400/90', border: 'border-red-950', badge: 'bg-red-950 border-red-900 text-red-300' };
    }
  };

  const rankMeta = getRankMeta(rank);

  // Formatting large lifespan cleanly
  const formatLifespan = (years: number) => {
    if (years >= 999999999) return 'Bất Tử (Bằng Tuổi Trời Đất)';
    return `${years.toLocaleString('vi-VN')} năm`;
  };

  // Plain text generator for easy sharing/saving
  const generateExportText = () => {
    return `=== THIÊN CƠ BẢN LỤC - ĐO TIÊN DUYÊN ===
Đạo Hữu: ${daoHieu} (${gender})
Xuất Thân: ${origin}
-------------------------------------
XẾP HẠNG TIÊN DUYÊN: [${rank}] (Điểm: ${ratingScore})
-------------------------------------
1. CẢNH GIỚI HIỆN TẠI:
- Thế Giới: ${realm.worldName}
- Cảnh Giới: ${realm.name} (${realm.stageName})
- Tuổi Thọ Bản Mệnh: ${formatLifespan(realm.baseLifespan)}
- Khí Thần: ${realm.description}

2. LINH CĂN BẢN MỆNH:
- Loại: ${linhCan.name} (Hệ: ${linhCan.elements.join(', ')})
- Phẩm Tự: Cấp ${linhCan.rarity}
- Đặc Kỷ: ${linhCan.advantage}

3. THÊ CHẤT ĐẶC BIỆT:
- Tên: ${physique ? `${physique.name} (Cấp ${physique.rarity})` : 'Phàm Thai Nhục Thân'}
- Mô Tả: ${physique ? physique.characteristic : 'Không thần căn bí ẩn dẫu vậy có mưu trí kiên quyết'}
- Ưu Thế: ${physique ? physique.advantage : 'Tiết kiệm linh khí, không sợ ma tâm vây quanh.'}

4. NGŨ HÀNH LINH TƯỢNG (Chỉ số linh căn):
- Tốc độ tu luyện: ${radarStats.cultivationSpeed}/100
- Dung lượng khí hải: ${radarStats.manaReserve}/100
- Cực sát chiến lực: ${radarStats.combatPower}/100
- Sinh mệnh nguyên cốt: ${radarStats.lifespan}/100
- Linh vụ khí vận (Cơ duyên): ${radarStats.fateLuck}/100

THIÊN CƠ CÁC PHÊ NGỮ:
"${philosophicalVerdict}"
-------------------------------------
Người đo tiên duyên tại Thiên Cơ Các linh trận lúc ${new Date(profile.timestamp).toLocaleString('vi-VN')}.
"Nhất niệm thành tiên, nhất niệm thành ma"`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const textHtml = generateExportText();
    const blob = new Blob([textHtml], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${daoHieu.replace(/\s+/g, '_')}_tienduyen.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-2 md:p-6 z-10 flex flex-col gap-8 animate-fade-in">
      
      {/* Back to creation top bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 border border-dark-gold/30 bg-black/40 text-gold-theme text-xs uppercase tracking-widest rounded-md hover:bg-gold-theme/10 transition-all font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Tiên Trận Khởi Lại
        </button>
        <span className="text-[10px] text-paper-theme/40 uppercase tracking-widest">
          Mã số khảo nghiệm: #{profile.id.split('_')[1]}
        </span>
      </div>

      {/* Grid Layout: Left details, Right Ranking Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Left Dashboard details (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Identity Information Banner */}
          <div className="p-5 border border-dark-gold/25 bg-black/50 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient(ellipse at center, rgba(197, 160, 89, 0.05) 0%, transparent 70%) pointer-events-none"></div>
            
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-theme/70 font-mono">
              BẢN MỆNH TIÊN TƯ
            </p>
            <h3 className="font-serif text-3xl font-bold text-paper-theme mt-1 tracking-wide flex items-center gap-2">
              🕊️ <span className="ink-text">{daoHieu}</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-dark-gold/15 text-xs text-paper-theme/70">
              <div>
                <span className="text-[10px] text-gold-theme/50 block uppercase tracking-widest">Linh Thể</span>
                <span className="font-semibold text-sm">{gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-gold-theme/50 block uppercase tracking-widest">Truyền Kiếp</span>
                <span className="font-semibold text-sm">{origin}</span>
              </div>
              <div>
                <span className="text-[10px] text-gold-theme/50 block uppercase tracking-widest">Huyết Mạch Thọ Căn</span>
                <span className="font-semibold text-sm text-emerald-400">Kiên Định</span>
              </div>
            </div>
          </div>

          {/* Core Modules grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Cảnh giới */}
            <div className="p-5 border border-dark-gold/25 bg-neutral-950/70 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 border-b border-dark-gold/15 pb-2">
                  <h4 className="text-xs text-gold-theme uppercase tracking-widest font-semibold">
                    1. Thần Mạch Cảnh Giới
                  </h4>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-950/60 border border-dark-gold/30 text-gold-theme font-medium">
                    {realm.worldName}
                  </span>
                </div>
                <p className="font-serif text-2xl text-gold-theme font-semibold tracking-wide">
                  {realm.name}
                </p>
                <p className="text-xs text-paper-theme/50 font-mono mt-0.5 italic">
                  Giai đoạn khảo hạch: {realm.stageName}
                </p>
                <p className="text-xs text-paper-theme/75 mt-3 leading-relaxed">
                  {realm.description}
                </p>
              </div>
              <div className="border-t border-dark-gold/15 pt-3 mt-4 flex justify-between items-center text-xs">
                <span className="text-gold-theme/55">Tuổi Thọ Nguyên Bản:</span>
                <span className="font-semibold text-paper-theme font-mono">{formatLifespan(realm.baseLifespan)}</span>
              </div>
            </div>

            {/* Box 2: Linh căn */}
            <div className="p-5 border border-dark-gold/25 bg-neutral-950/70 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 border-b border-dark-gold/15 pb-2">
                  <h4 className="text-xs text-gold-theme uppercase tracking-widest font-semibold">
                    2. Bản Khí Linh Căn
                  </h4>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-400 font-bold">
                    Cấp {linhCan.rarity}
                  </span>
                </div>
                <p className="font-serif text-2xl text-amber-200 font-semibold tracking-wide flex items-center gap-1.5">
                  🛡️ {linhCan.name}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {linhCan.elements.map((el, i) => (
                    <span key={i} className="text-[10px] bg-dark-gold/25 text-gold-theme border border-dark-gold/30 px-2 py-0.5 rounded font-medium">
                      Hệ {el}
                    </span>
                  ))}
                  <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    Hệ số tụ khí: x{linhCan.cultivationMulti}
                  </span>
                </div>
                <p className="text-xs text-paper-theme/75 mt-3 leading-relaxed">
                  {linhCan.advantage}
                </p>
              </div>
              <div className="border-t border-dark-gold/15 pt-3 mt-4 flex justify-between items-center text-xs">
                <span className="text-gold-theme/55">Quỷ Pháp Ngự Thần:</span>
                <span className="font-semibold text-paper-theme/90">Thông Tuệ</span>
              </div>
            </div>

            {/* Box 3: Thể Chất Đặc Biệt */}
            <div className="p-5 border border-dark-gold/25 bg-neutral-950/70 rounded-lg md:col-span-2">
              <div className="flex justify-between items-start mb-3 border-b border-dark-gold/15 pb-2">
                <h4 className="text-xs text-gold-theme uppercase tracking-widest font-semibold">
                  3. Thượng Cổ Thể Chất Đặc Biệt
                </h4>
                {physique ? (
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-400 font-bold">
                    Cấp {physique.rarity}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                    Phổ Thông
                  </span>
                )}
              </div>
              {physique ? (
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-xl text-yellow-500 font-bold">
                      🧬 {physique.name}
                    </p>
                    <span className="text-[10px] bg-rose-950/40 border border-rose-900/40 text-rose-300 px-2 py-0.5 rounded font-mono">
                      Công lực tấn công +{physique.combatBoost}%
                    </span>
                  </div>
                  <p className="text-xs text-paper-theme/60 mt-1 italic">
                    Đặc tính bản thể: {physique.characteristic}
                  </p>
                  <p className="text-xs text-paper-theme/80 mt-2 bg-black/40 p-2.5 rounded border border-dark-gold/10 leading-relaxed font-serif">
                    <strong className="text-gold-theme font-semibold">Ưu lực vượt trội:</strong> {physique.advantage}
                  </p>
                </div>
              ) : (
                <div className="text-left py-2">
                  <p className="font-serif text-lg text-paper-theme/40 font-semibold italic">Phàm Thai Nhục Thân (Trơn tru tĩnh lặng)</p>
                  <p className="text-xs text-paper-theme/60 mt-1">
                    Không thức tỉnh thượng cổ thần cốt bí ẩn nào dẫu vậy sở hữu khí hải thanh liêm bình ổn, không vướng bận dâm ma hỏa niệm vây quanh, dễ dàng tự ngộ ra chân lý tối thượng trong phàm cảnh cực tự nhiên.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Section: Attribute radar status visualization */}
          <div className="p-5 border border-dark-gold/25 bg-neutral-950/60 rounded-lg">
            <h4 className="text-xs text-gold-theme uppercase tracking-widest font-semibold mb-4 border-b border-dark-gold/15 pb-2 flex items-center justify-between">
              <span>📊 Thần Khiếu Chiêu Điểm (Chỉ số Ngũ Hành)</span>
              <span className="text-[10px] font-mono tracking-wider opacity-60">Tinh hoa ngũ tạng</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* Cultivation Speed */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gold-theme/75 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Tốc độ thăng tiến (Ngộ tính):
                  </span>
                  <span className="font-bold text-paper-theme font-mono">{radarStats.cultivationSpeed}/100</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div style={{ width: `${radarStats.cultivationSpeed}%` }} className="h-full bg-amber-500 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.5)]"></div>
                </div>
              </div>

              {/* Mana Reserve */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gold-theme/75 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Bản lượng linh lực (Khí hải):
                  </span>
                  <span className="font-bold text-paper-theme font-mono">{radarStats.manaReserve}/100</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div style={{ width: `${radarStats.manaReserve}%` }} className="h-full bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.5)]"></div>
                </div>
              </div>

              {/* Combat Power */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gold-theme/75 flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-rose-500" />
                    Sát thương pháp thuật (Chiến lực):
                  </span>
                  <span className="font-bold text-paper-theme font-mono">{radarStats.combatPower}/100</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div style={{ width: `${radarStats.combatPower}%` }} className="h-full bg-rose-500 rounded-full shadow-[0_0_6px_rgba(244,63,94,0.5)]"></div>
                </div>
              </div>

              {/* Lifespan */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gold-theme/75 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" />
                    Cơ khí thọ nguyên (Sức sống):
                  </span>
                  <span className="font-bold text-paper-theme font-mono">{radarStats.lifespan}/100</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div style={{ width: `${radarStats.lifespan}%` }} className="h-full bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.5)]"></div>
                </div>
              </div>

              {/* Fate & Luck */}
              <div className="space-y-1 md:col-span-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gold-theme/75 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-gold-theme" />
                    Linh vận hộ thân (Cơ duyên vận khí):
                  </span>
                  <span className="font-bold text-paper-theme font-mono">{radarStats.fateLuck}/100</span>
                </div>
                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                  <div style={{ width: `${radarStats.fateLuck}%` }} className="h-full bg-gold-theme rounded-full shadow-[0_0_6px_rgba(197,160,89,0.5)]"></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Column 2: Right Profile Rating Box (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main big Rank Emblem Box with golden aura of selection */}
          <div className={`p-6 border rounded-lg bg-gradient-to-b ${rankMeta.bg} ${rankMeta.border} text-center flex flex-col items-center justify-center relative min-h-[300px]`}>
            {/* Pulsing glow background decoration */}
            <div className="absolute inset-0 bg-radial-gradient(ellipse at center, rgba(197, 160, 89, 0.08) 0%, transparent 80%) pointer-events-none"></div>

            <p className="text-[10px] uppercase tracking-[0.4em] text-gold-theme bg-zinc-950/80 px-4 py-1.5 border border-dark-gold/25 rounded-md font-sans mb-4 z-10 font-bold">
              XẾP HẠNG TIEN DUYÊN
            </p>

            <span className={`font-serif text-8xl font-black ${rankMeta.text} select-none tracking-tighter drop-shadow-lg scale-110 z-10 glow-text`}>
              {rank}
            </span>

            <p className="text-xs text-paper-theme/60 mt-4 leading-relaxed max-w-xs z-10">
              Tổng số điểm khí vận thần mạch tích lũy được:
            </p>
            <p className="text-2xl font-serif font-black text-gold-theme glow-text z-10 mt-1">
              {ratingScore} <span className="text-xs font-sans font-light opacity-50">đầu điểm khí lực</span>
            </p>

            <div className="mt-6 z-10 flex gap-1.5 items-center">
              <span className="text-[10px] bg-black/60 px-3 py-1 text-gold-theme border border-dark-gold/20 rounded font-mono font-bold">
                {rank === 'SSS' || rank === 'SS' ? '🌟 VÔ SONG CHÂN CĂN' : (rank === 'S' || rank === 'A' ? '⚡ THIÊN TƯ PHI PHÀM' : '📜 BÌNH LĂM AN PHÚ')}
              </span>
            </div>
          </div>

          {/* Divine Appraisal (Thiên Cơ Các Phê Ngữ) with ink paper scrolls style */}
          <div className="paper-scroll dark-scroll p-6 rounded-lg border flex flex-col gap-3 relative min-h-[180px]">
            <div className="absolute -top-3 left-4 bg-[#07080a] text-gold-theme border border-dark-gold/30 text-[9px] uppercase tracking-widest px-3 py-0.5 rounded flex items-center gap-1 font-semibold">
              <Feather className="w-3 h-3" />
              Thiên Cơ Các Phê Ngữ
            </div>
            
            <p className="font-serif italic text-base leading-relaxed text-yellow-100/90 tracking-wide pt-2">
              "{philosophicalVerdict}"
            </p>
            
            <p className="text-[10px] text-right font-sans uppercase tracking-[0.25em] text-gold-theme/70 mt-auto border-t border-dark-gold/10 pt-2 font-bold">
              —— Linh Quy Thần Điện kính phê
            </p>
          </div>

          {/* Copy and Export Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onStartTribulation}
              className="w-full text-center py-3 bg-red-950/20 hover:bg-red-950/35 border border-red-500/45 text-red-200 rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Thử vận may độ kiếp (Random)
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="w-full text-center py-3 bg-gold-theme/10 hover:bg-gold-theme/15 border border-dark-gold/40 text-gold-theme rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Đã Khắc Sao Vào Tâm Thức!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Khắc Sao Thiên Cơ (Copy Text)
                </>
              )}
            </button>
            <button
              onClick={handleDownloadFile}
              className="w-full text-center py-3 bg-amber-950/25 border border-dark-gold/50 text-paper-theme hover:bg-amber-950/40 rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4 text-gold-theme" />
              Tải Thiên Cơ Tự Sự (.TXT File)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
