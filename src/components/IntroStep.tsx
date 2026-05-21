import React, { useState } from 'react';
import { Sparkles, Compass, Shield, User, HelpCircle } from 'lucide-react';
import { ORIGINS } from '../data.ts';

interface IntroStepProps {
  onStartMeasuring: (daoHieu: string, originId: string, gender: string) => void;
}

export default function IntroStep({ onStartMeasuring }: IntroStepProps) {
  const [daoHieu, setDaoHieu] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(ORIGINS[0].id);
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Vô Định'>('Nam');
  const [errorMsg, setErrorMsg] = useState('');

  const [randomNickLoading, setRandomNickLoading] = useState(false);

  // Pool of immersive Tu Tien titles
  const prefixes = [
    'Bá Thiên', 'Nghịch Thiên', 'Cực Âm', 'Hỗn Nguyên', 'Lôi Vân', 'Cửu Thiên', 'Hoang Cổ', 
    'Thái Ất', 'Vô Cực', 'Hồng Mông', 'Độc Cô', 'Nhất Diệp', 'Tiêu Dao', 'Tử Tiêu'
  ];
  const suffixes = [
    'Lão Tổ', 'Chân Nhân', 'Đạo Sĩ', 'Kiếm Tiên', 'Điện Chủ', 'Ma Hoàng', 'Tôn Giả', 
    'Thần Quân', 'Cốc Chủ', 'Đạo Tổ', 'Tiên Cô', 'Nữ Đế', 'Thánh Tử', 'Thánh Nữ'
  ];

  const handleGenerateRandomDaoHieu = () => {
    setRandomNickLoading(true);
    setTimeout(() => {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      // Traditional names can append optional small indicator
      const randomSurnimes = ['Hàn', 'Lâm', 'Tiêu', 'Lục', 'Trọng', 'Bạch', 'Sở'];
      const sur = randomSurnimes[Math.floor(Math.random() * randomSurnimes.length)];
      setDaoHieu(`${sur} ${p} ${s}`);
      setRandomNickLoading(false);
      setErrorMsg('');
    }, 280);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!daoHieu.trim()) {
      setErrorMsg('Đạo hữu nhất định phải ghi rõ Đạo Hiệu để khơi thông trận pháp!');
      return;
    }
    setErrorMsg('');
    onStartMeasuring(daoHieu.trim(), selectedOrigin, gender);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 z-10">
      {/* Immersive Welcome Banner */}
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-theme hover:glow-text transition-all">
          Thiên Cơ Bất Khả Lộ • Vạn Pháp Quy Tông
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-light italic text-gold-theme mt-2 tracking-wide glow-text">
          Khai Mở Tiên Duyên Trận
        </h2>
        <div className="w-24 h-[1px] bg-dark-gold/50 mx-auto mt-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold-theme rotate-45 border border-dark-gold"></div>
        </div>
        <p className="font-serif text-sm italic text-paper-theme/60 mt-4 max-w-xl mx-auto">
          "Nhất niệm thành tiên, nhất niệm thành ma. Hãy bước vào tiên trận, cho thấu Linh can hiện hình, Thể chất bừng lên khí thế nguyên khí."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-zinc-950/60 border border-dark-gold/20 p-6 rounded-lg backdrop-blur-md flex flex-col gap-6">
          
          {/* Dao Hieu Input */}
          <div>
            <label className="text-xs text-gold-theme uppercase tracking-widest block mb-2 font-semibold">
              1. Khắc Họa Đạo Hiệu (Tên Tu Sĩ):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={daoHieu}
                  onChange={(e) => {
                    setDaoHieu(e.target.value);
                    if (e.target.value.trim()) setErrorMsg('');
                  }}
                  placeholder="Ví dụ: Hàn Lập, Độc Thần Quân,..."
                  className="w-full bg-black/60 border border-dark-gold/30 text-paper-theme px-4 py-3 rounded-md font-serif text-lg focus:outline-none focus:border-gold-theme transition-all"
                />
                <User className="absolute right-3 top-3.5 w-5 h-5 text-gold-theme/40" />
              </div>
              <button
                type="button"
                onClick={handleGenerateRandomDaoHieu}
                disabled={randomNickLoading}
                className="px-4 py-3 bg-gold-theme/10 hover:bg-gold-theme/20 border border-dark-gold/50 text-gold-theme rounded-md text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Ngẫu Nhiên
              </button>
            </div>
            {errorMsg && (
              <p className="text-red-400 text-xs mt-2 italic font-serif">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          {/* Gender Selector with golden cards */}
          <div>
            <label className="text-xs text-gold-theme uppercase tracking-widest block mb-3 font-semibold">
              2. Bản Nguyên Linh Thể (Giới Tính):
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Nam', 'Nữ', 'Vô Định'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 px-4 border text-center transition-all duration-300 rounded ${
                    gender === g
                      ? 'bg-gold-theme/15 border-gold-theme text-gold-theme glow-text shadow-[0_0_12px_rgba(197,160,89,0.25)]'
                      : 'border-dark-gold/20 bg-black/40 text-paper-theme/60 hover:text-paper-theme hover:border-dark-gold/50'
                  }`}
                >
                  <span className="font-serif text-sm font-medium">{g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Dao Origin selection */}
          <div>
            <label className="text-xs text-gold-theme uppercase tracking-widest block mb-3 font-semibold">
              3. Kinh Mạch Thân Thế (Xuất Thân Khởi Điểm):
            </label>
            <div className="flex flex-col gap-3">
              {ORIGINS.map((origin) => {
                const isSelected = selectedOrigin === origin.id;
                return (
                  <label
                    key={origin.id}
                    onClick={() => setSelectedOrigin(origin.id)}
                    className={`p-3 border rounded transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gold-theme/10 border-gold-theme text-gold-theme shadow-[0_0_10px_rgba(197,160,89,0.15)]'
                        : 'border-dark-gold/20 bg-black/40 text-paper-theme/70 hover:bg-black/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="origin"
                      checked={isSelected}
                      onChange={() => setSelectedOrigin(origin.id)}
                      className="mt-1 h-3.5 w-3.5 accent-gold-theme"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-semibold text-sm text-gold-theme uppercase tracking-wider">
                          {origin.name}
                        </span>
                        <div className="text-[10px] uppercase font-mono tracking-widest scale-90 origin-right opacity-80 font-bold">
                          {origin.id === 'di_tich' && '⚡ Cơ Duyên +30'}
                          {origin.id === 'pham_gia' && '💎 Phúc Khí +15'}
                          {origin.id === 'tong_mon' && '🌌 Tu Lực +15'}
                          {origin.id === 'tan_tu' && '⚔️ Chiến Lực +20'}
                          {origin.id === 'vuong_tieu' && '🏵️ Linh Lực +20'}
                        </div>
                      </div>
                      <p className="text-xs text-paper-theme/60 mt-1 leading-relaxed">
                        {origin.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Trigger measuring button */}
          <div className="mt-2">
            <button
              type="submit"
              className="w-full text-center serif text-xl border border-gold-theme py-4 bg-gold-theme/15 hover:bg-gold-theme/25 text-gold-theme uppercase tracking-[0.2em] transition-all duration-300 glow-text shadow-lg cursor-pointer"
            >
              Khai Mở Tiên Duyên
            </button>
          </div>

        </form>

        {/* Right Information Panel (Lore, tips) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-5 border border-dark-gold/20 bg-black/40 rounded-lg">
            <h3 className="text-xs text-gold-theme uppercase tracking-widest mb-3 border-b border-dark-gold/30 pb-2 flex items-center gap-1.5 font-semibold">
              <Compass className="w-4 h-4 text-gold-theme" />
              THÔNG TIN ĐO TIÊN DUYÊN
            </h3>
            <p className="text-xs leading-relaxed text-paper-theme/80 space-y-2 font-serif italic">
              Nhà thông thái Thiên Cơ Các đo tiễn duyên qua ngàn trùng hỗn độn trận lôi. Quá trình kiểm định sẽ soi chiếu toàn diện:
            </p>
            <ul className="text-xs space-y-2 mt-4 text-paper-theme/70 list-disc list-inside">
              <li><strong className="text-gold-theme font-semibold">Khởi Đầu Cảnh Giới:</strong> Đo đạc hiện thân đang ở Nhân Giới, Linh Giới hay đại năng Tiên Giới tôn túc.</li>
              <li><strong className="text-gold-theme font-semibold">Hiện trạng Linh Căn:</strong> Chiêm nghiệm ra Ngũ Linh Căn, Đột Biến Linh Căn oanh liệt, hay Thiên Linh Căn vạn địch.</li>
              <li><strong className="text-gold-theme font-semibold">Thần Thông Thể Chất:</strong> Khơi gợi hoang cổ dị thế thể chất tột đỉnh hay tiên đạo thâm căn cốt tùy.</li>
              <li><strong className="text-gold-theme font-semibold">Khí Tượng Bản Mệnh:</strong> Hóa sinh những mảnh hồn lưu danh trong truyền kỳ sách sử.</li>
            </ul>
          </div>

          <div className="p-5 border border-dark-gold/20 bg-amber-950/10 rounded-lg flex gap-3 text-gold-theme">
            <Shield className="w-10 h-10 shrink-0 text-gold-theme/80" />
            <div>
              <h4 className="font-serif text-sm font-semibold text-gold-theme tracking-wide">
                THIÊN ĐẠO CHÂN NGÔN
              </h4>
              <p className="text-[11px] leading-relaxed text-paper-theme/70 mt-1 italic">
                "Hữu tâm vô tướng, tướng tự tâm sinh. Tu tiên dẫu lấy lôi kiếp làm gông cùm, bất phá bất thủ mới cốt ở lòng thành." 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
