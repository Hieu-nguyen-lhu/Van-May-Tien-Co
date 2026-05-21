export type RealmType = 'NHAN_GIOI' | 'LINH_GIOI' | 'TIEN_GIOI';

export interface Realm {
  id: string;
  world: RealmType;
  worldName: string;
  name: string;
  stageName: string; // Sơ kỳ, Trung kỳ, Hậu kỳ, Đại viên mãn
  description: string;
  baseLifespan: number; // in years
  powerRating: number; // base point
}

export type LinhCanType = 'THIEN_LINH_CAN' | 'CHAN_LINH_CAN' | 'BIEN_DI_LINH_CAN' | 'DI_LINH_CAN' | 'NGU_LINH_CAN' | 'PHE_TICH_LINH_CAN';

export interface LinhCan {
  id: string;
  type: LinhCanType;
  name: string;
  elements: string[]; // e.g. ["Hỏa"] or ["Kim", "Thủy"]
  advantage: string;
  rarity: string; // S, A, B, C, D, SSS
  cultivationMulti: number; // multiplier for stats
}

export interface Physique {
  id: string;
  name: string;
  characteristic: string;
  advantage: string;
  rarity: string; // SSS, SS, S, A, B
  combatBoost: number;
}

export interface CharacterProfile {
  id: string;
  daoHieu: string;
  origin: string;
  gender: 'Nam' | 'Nữ' | 'Vô Định';
  realm: Realm;
  linhCan: LinhCan;
  physique: Physique | null;
  timestamp: string;
  ratingScore: number; // overall numeric value to rank
  rank: 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  philosophicalVerdict: string; // Thiên Cơ Các Phê Ngữ
  radarStats: {
    cultivationSpeed: number; // 1-100
    manaReserve: number; // 1-100
    combatPower: number; // 1-100
    lifespan: number; // 1-100 (relative)
    fateLuck: number; // 1-100
  };
}
