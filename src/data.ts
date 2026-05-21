import { Realm, LinhCan, Physique, CharacterProfile } from './types.ts';

// 1. Realms Definition
export const REALMS: Realm[] = [
  // Nhân Giới
  { id: 'luyen_khi', world: 'NHAN_GIOI', worldName: 'Nhân Giới', name: 'Luyện Khí Kỳ', stageName: 'Tầng Thứ Chín', description: 'Giai đoạn sơ khởi nhập môn, nạp linh khí tinh hoa của trời đất vào cơ thể để tẩy tủy phạt cốt.', baseLifespan: 120, powerRating: 15 },
  { id: 'truc_co', world: 'NHAN_GIOI', worldName: 'Nhân Giới', name: 'Trúc Cơ Kỳ', stageName: 'Trung Kỳ', description: 'Xây dựng linh cơ vững chắc, linh khí hóa dịch lỏng. Chính thức đạp chân vào con đường trường sinh.', baseLifespan: 250, powerRating: 45 },
  { id: 'ket_dan', world: 'NHAN_GIOI', worldName: 'Nhân Giới', name: 'Kết Đan Kỳ (Kim Đan)', stageName: 'Hậu Kỳ', description: 'Tinh khí chi tụ, ngưng tụ Kim đan nguyên hỏa. Thọ nguyên nghìn năm, phong tư trác tuyệt.', baseLifespan: 600, powerRating: 120 },
  { id: 'nguyen_anh', world: 'NHAN_GIOI', worldName: 'Nhân Giới', name: 'Nguyên Anh Kỳ', stageName: 'Sơ Kỳ', description: 'Đan vỡ hóa tế anh, thần hồn thoát xác tự sinh tự tại. Coi như tiên phong một phương.', baseLifespan: 1200, powerRating: 350 },
  { id: 'hoa_than', world: 'NHAN_GIOI', worldName: 'Nhân Giới', name: 'Hóa Thần Kỳ', stageName: 'Đại Viên Mãn', description: 'Nguyên anh trưởng thành, dung hợp ý chí thiên địa. Bắt đầu có thể phá toái hư không dời núi lấp biển.', baseLifespan: 2500, powerRating: 900 },

  // Linh Giới
  { id: 'luyen_hu', world: 'LINH_GIOI', worldName: 'Linh Giới', name: 'Luyện Hư Kỳ', stageName: 'Hậu Kỳ', description: 'Phản phác quy chân, nguyên anh hóa thần hợp làm một với cơ thể. Thần thức khổng lồ khôn lường.', baseLifespan: 5000, powerRating: 2500 },
  { id: 'hop_the', world: 'LINH_GIOI', worldName: 'Linh Giới', name: 'Hợp Thể Kỳ', stageName: 'Trung Kỳ', description: 'Sự kết hợp hoàn hảo giữa nhục thân và linh hồn đạo quả. Pháp lực mênh mông cực kỳ tôn quý.', baseLifespan: 10000, powerRating: 6500 },
  { id: 'dai_thua', world: 'LINH_GIOI', worldName: 'Linh Giới', name: 'Đại Thừa Kỳ', stageName: 'Đại Viên Mãn', description: 'Đến đỉnh giới hạn của một thế giới. Chuẩn bị tiếp thụ Thiên kiếp cửu trọng để hóa linh thành tiên.', baseLifespan: 30000, powerRating: 18000 },
  { id: 'do_kiep', world: 'LINH_GIOI', worldName: 'Linh Giới', name: 'Độ Kiếp Kỳ', stageName: 'Đang Độ Kiếp', description: 'Vượt qua phong ba bão lôi thế giới, luyện hóa chân hình của Tiên giới, dòm ngó bất sinh bất diệt.', baseLifespan: 50000, powerRating: 35000 },

  // Tiên Giới
  { id: 'chan_tien', world: 'TIEN_GIOI', worldName: 'Tiên Giới', name: 'Chân Tiên Cảnh', stageName: 'Sơ Kỳ', description: 'Tẩy phàm cốt hóa Tiên thể. Tiên lực tuần hoàn không bao giờ cạn kiệt. Trường sinh vĩnh kỷ.', baseLifespan: 200000, powerRating: 120000 },
  { id: 'kim_tien', world: 'TIEN_GIOI', worldName: 'Tiên Giới', name: 'Kim Tiên Cảnh', stageName: 'Hậu Kỳ', description: 'Thần thức biến đổi thành Niệm Lực, bắt đầu ngưng tụ và vận hành các Quy Tắc vũ trụ cổ xưa.', baseLifespan: 1000000, powerRating: 450000 },
  { id: 'thai_at', world: 'TIEN_GIOI', worldName: 'Tiên Giới', name: 'Thái Ất Ngọc Tiên', stageName: 'Đại Viên Mãn', description: 'Nắm giữ sức mạnh một vùng quy tắc chân chính, chúa tể vạn linh, chưởng thiên cửu giai.', baseLifespan: 990000000, powerRating: 1800000 },
  { id: 'dai_la', world: 'TIEN_GIOI', worldName: 'Tiên Giới', name: 'Đại La Kim Tiên', stageName: 'Đỉnh Phong', description: 'Tồn tại vĩnh hằng giữa hỗn độn thiên hà. Một ý niệm tái lập tinh thành, trường tồn cùng tuế nguyệt.', baseLifespan: 999999999999, powerRating: 8500000 },
  { id: 'dao_to', world: 'TIEN_GIOI', worldName: 'Tiên Giới', name: 'Đạo Tổ Nguyên Thủy', stageName: 'Hỗn Độn', description: 'Hóa thân của Vạn Pháp đại đạo tối cao. Nắm giữ căn cơ đại đạo duy nhất của cả một thời không thiên hà.', baseLifespan: 999999999999999, powerRating: 99999999 },

  // Phế Phẩm
  { id: 'phe_pham', world: 'PHE_PHAM', worldName: 'Phế Phẩm', name: 'Phế Phẩm', stageName: 'Chưa Nhập Đạo', description: 'Tiên mạch mờ nhạt, khí hải bế tắc, muốn bước vào đạo đồ phải dựa nhiều vào cơ duyên nghịch mệnh.', baseLifespan: 60, powerRating: 1 }
];

// 2. Linh Can Definition
export const LINH_CANS: LinhCan[] = [
  { id: 'loi_linh_can', type: 'DI_LINH_CAN', name: 'Lôi Linh Căn', elements: ['Lôi'], advantage: 'Tốc độ bùng nổ vượt bậc, sát thương sấm sét cuồng bạo khắc chế ma tu quỷ lôi.', rarity: 'S', cultivationMulti: 2.2 },
  { id: 'bang_linh_can', type: 'DI_LINH_CAN', name: 'Băng Linh Căn', elements: ['Băng'], advantage: 'Hàn khí đóng băng vạn dặm, phòng ngự vững chắc cùng khả năng phong tỏa kẻ địch vượt trội.', rarity: 'S', cultivationMulti: 2.0 },
  { id: 'phong_linh_can', type: 'DI_LINH_CAN', name: 'Phong Linh Căn', elements: ['Phong'], advantage: 'Thân pháp phiêu dật, tự do cưỡi gió ngự kiếm vạn dặm chớp mắt biến mất.', rarity: 'S', cultivationMulti: 2.1 },
  { id: 'thien_hoa_can', type: 'THIEN_LINH_CAN', name: 'Thiên Hỏa Linh Căn', elements: ['Hỏa'], advantage: 'Thuần khiết linh căn hệ Hỏa vạn năm có một, trời sinh ngự thiện đỉnh cấp đạo hỏa, tu luyện công pháp hỏa nhanh gấp mười.', rarity: 'A', cultivationMulti: 1.8 },
  { id: 'thien_kim_can', type: 'THIEN_LINH_CAN', name: 'Thiên Kim Linh Căn', elements: ['Kim'], advantage: 'Vô cùng sắc bén, hộ thể chân pháp kim thân khó phá, kiếm khí sắc nhọn trùng thiên.', rarity: 'A', cultivationMulti: 1.8 },
  { id: 'thien_moc_can', type: 'THIEN_LINH_CAN', name: 'Thiên Mộc Linh Căn', elements: ['Mộc'], advantage: 'Sức sống dồi dào, khả năng tự phục hồi thương thế kỳ tích, trời sinh luyện đan thánh sư.', rarity: 'A', cultivationMulti: 1.7 },
  { id: 'thien_thuy_can', type: 'THIEN_LINH_CAN', name: 'Thiên Thủy Linh Căn', elements: ['Thủy'], advantage: 'Nước chảy mềm mại bao dung vạn vật, khí hải mênh mông tinh thuần vô song.', rarity: 'A', cultivationMulti: 1.7 },
  { id: 'thien_tho_can', type: 'THIEN_LINH_CAN', name: 'Thiên Thổ Linh Căn', elements: ['Thổ'], advantage: 'Pháp lực thâm hậu bất động như đại địa núi non, phòng thủ tuyệt đối.', rarity: 'A', cultivationMulti: 1.6 },
  { id: 'u_minh_can', type: 'BIEN_DI_LINH_CAN', name: 'U Minh Ma Căn', elements: ['Ma', 'Hỏa'], advantage: 'Bao phủ cuồng bạo quỷ hỏa, tu điên cuồng dã tính, nghịch thiên phản phác rất bá đạo.', rarity: 'S', cultivationMulti: 2.3 },
  { id: 'chan_kim_hoa', type: 'CHAN_LINH_CAN', name: 'Song Linh Căn (Kim & Hỏa)', elements: ['Kim', 'Hỏa'], advantage: 'Cân bằng đúc kim tinh hỏa, thích hợp luyện khí chế bảo thiên tài.', rarity: 'B', cultivationMulti: 1.3 },
  { id: 'chan_thuy_moc', type: 'CHAN_LINH_CAN', name: 'Song Linh Căn (Thủy & Mộc)', elements: ['Thủy', 'Mộc'], advantage: 'Khí huyết sinh trưởng bình ổn ôn nhu hằng định.', rarity: 'B', cultivationMulti: 1.25 },
  { id: 'tam_can', type: 'NGU_LINH_CAN', name: 'Tam Linh Căn (Hỏa, Thổ, Kim)', elements: ['Hỏa', 'Thổ', 'Kim'], advantage: 'Pháp thuật đa dạng nhưng tinh tủy phân tán, cần nhiều tài nguyên đột phá.', rarity: 'C', cultivationMulti: 0.95 },
  { id: 'hon_nguyen_ngu', type: 'NGU_LINH_CAN', name: 'Hỗn Nguyên Ngũ Linh Căn', elements: ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'], advantage: 'Ngoại trừ cực kỳ tốn thời gian dồi dưỡng ngũ hành tương khắc, một khi bộc phát pháp lực tinh tương ngũ hành đồng chu tuyệt vô thần đạo.', rarity: 'SSS', cultivationMulti: 3.5 },
  { id: 'phe_can_tich', type: 'PHE_TICH_LINH_CAN', name: 'Phế Linh Căn (Tứ Linh khuyết hành)', elements: ['Kim', 'Mộc', 'Thủy', 'Thổ'], advantage: 'Linh khí hấp thu hỗn loạn lùng bùng, khó tìm chánh quả trừ phi có đại kỳ ngộ tinh nguyên phàm nhân dấn thân.', rarity: 'F', cultivationMulti: 0.5 }
];

// 3. Special Physiques
export const PHYSIQUES: Physique[] = [
  { id: 'khong_linh_the', name: 'Không Linh Thể', characteristic: 'Nhạy cảm tuyệt đối với thiên địa linh khí, tâm hồn thuần phác hư vô.', advantage: 'Tốc độ hấp thụ tích lũy linh khí nhanh gấp trăm lần thiên linh căn thông thường.', rarity: 'SS', combatBoost: 40 },
  { id: 'hoang_co_thanh_the', name: 'Hoang Cổ Thánh Thể', characteristic: 'Thể chất cận chiến mạnh nhất thái cổ, huyết khí tràn ngập hóa thành màu vàng thần quang.', advantage: 'Nhục thân thần thánh tuyệt luân lực lấn vạn tôn, miễn dịch vô số loại cấm chế độc chướng pháp trận.', rarity: 'SSS', combatBoost: 95 },
  { id: 'hong_mong_dao_the', name: 'Hồng Mông Đạo Thể', characteristic: 'Hóa thân của hồng mông sơ khởi, sinh ra đã mang theo vết tích quy tắc vũ trụ đại đạo.', advantage: 'Dễ dàng ngộ đạo vạn pháp, thi triển tiên kỹ không tốn tiên lực, vạn pháp bất xâm.', rarity: 'SSS', combatBoost: 100 },
  { id: 'thien_ma_ban_the', name: 'Thiên Ma Vương Thể', characteristic: 'Bản thể tối tăm chứa đựng thiên ma di truyền cốt cách bá đạo.', advantage: 'Khai mở Ma thần chiến hình nâng sức sát thương vật lý lẫn ma khí bạo phát 200%.', rarity: 'S', combatBoost: 75 },
  { id: 'cuu_am_han_the', name: 'Cửu Âm Hàn Thể', characteristic: 'Khí cực âm lưu trữ nơi đan điền, hàn độc thấu xương.', advantage: 'Tuyệt đỉnh ma đạo công pháp hoặc băng kỹ hằng định tăng sát thương hàn tuyệt.', rarity: 'S', combatBoost: 60 },
  { id: 'chan_long_than_the', name: 'Chân Long Chi Thể', characteristic: 'Long cốt thánh tủy sinh ra bên lồng ngực, tiếng gầm trấn áp chư ma.', advantage: 'Nhục thân vô song tráng kiện, long lân hộ thể đao thương bất nhập, vạn lôi chẳng sợ.', rarity: 'SS', combatBoost: 85 },
  { id: 'tien_phong_dao_cot', name: 'Tiên Phong Đạo Cốt', characteristic: 'Cốt cách tiên gia rạng ngời thanh tao thoát tục.', advantage: 'Bậc tiền bối yêu mến bao bọc dâng hiến điển tích linh kỳ, tăng mạnh căn cốt cơ duyên.', rarity: 'A', combatBoost: 30 },
  { id: 'phu_luc_lien_the', name: 'Phù Lục Linh Thể', characteristic: 'Hai mắt nhìn nhận văn tự phù chúc thần tốc linh hoạt.', advantage: 'Luyện phù và giải phá phù pháp cấm chế đạt đỉnh tự động.', rarity: 'B', combatBoost: 15 }
];

// 4. Origins / Background Quotes
export const ORIGINS = [
  {
    id: 'pham_gia',
    name: 'Phàm Nhân Gia Tộc',
    description: 'Sinh ra trong đình điền thường gia không có tiên mạch, trải qua nếm mật nằm gai bất đắc chí bỗng tìm tòi linh dược nghịch cốt nhập môn.',
    bonusStat: { fateLuck: 15, cultivationSpeed: -5 }
  },
  {
    id: 'tong_mon',
    name: 'Tu Tiên Tông Môn',
    description: 'Là gia tộc hậu duệ tiên sư tông tông môn vây quanh, từ nhỏ có trúc cơ linh đan điều tẩm tiên tủy kinh mạch tươm tất.',
    bonusStat: { cultivationSpeed: 15, manaReserve: 10 }
  },
  {
    id: 'tan_tu',
    name: 'Tán Tu Thác Đường',
    description: 'Phiêu bạt hồng trần đói rách, tìm tòi vặt vãnh bảo vật bí tích từ cổ mộ di hài, trải qua sinh tử hiểm nghèo vô số.',
    bonusStat: { combatPower: 20, fateLuck: -5 }
  },
  {
    id: 'di_tich',
    name: 'Thần Bí Di Tích Thổ Cốt',
    description: 'Cơ duyên rơi xuống thần phong hang cổ, dung hòa với tàn hồn tàn phách thượng thế tiên cung, gánh vác sứ mệnh phục hưng cứu thế.',
    bonusStat: { fateLuck: 30, manaReserve: 5 }
  },
  {
    id: 'vuong_tieu',
    name: 'Vương Triều Hầu Phủ',
    description: 'Quận tử triều đình hiển hách thế gian quyền lực ngút ngàn, nắm giữ tàng thư lăng đỉnh quý hiển bậc linh đan.',
    bonusStat: { manaReserve: 20, combatPower: 5 }
  }
];

// High quality Tu Tien quotes for rotating decorative text
export const REALM_QUOTES = [
  "\"Tu tiên chi lộ, gian nan hiểm trở, ngàn vạn người nghịch thiên nhưng mấy ai gặp lại Chân đạo?\"",
  "\"Duy trì tâm đạo bất kể sấm chớp oanh tạc cửu thiên pháp giới phàm môn bách tính...\"",
  "\"Nhất niệm tinh tú sụp đổ, nhất niệm hồng hải mở vạn tiên quang trường thọ linh cung.\"",
  "\"Nhục thân là thuyền tế thế phàm trần, Đạo quả là ngọn đăng đăng vĩnh hằng.\"",
  "\"Phàm nhân muốn hóa long, nghịch thiên tranh đấu vạn pháp thần linh thiên hạ cát bụi.\"",
  "\"Phù thế như sương, trăm năm thoảng qua, dẫu đạt danh phận chân nhân tuyệt thế cũng chỉ là một giấc mộng khói hồng.\"",
  "\"Thiên đạo vô tình, duyên phận tại tâm. Kết quả trắc định chỉ mang tính chất tham khảo cho hành trình tu luyện.\" - Khảo Hạch Thần Mạch"
];

// Philosophical Verdict Generation depending on Realm & Rarity elements
export const VERDICT_TEMPLATES = {
  SSS: [
    "Đạo cốt tuyệt phẩm siêu thoát thời không thiên hà! Thiên cơ khó lường định đoạt chắc chắn sẽ đạp chân lên tận cùng Đạo Tổ thế tông thống ngự vạn linh.",
    "Bản mạng Tiên duyên nghịch thiên hoang dã cực kỳ chói lòa! Hồng mông khí thế cuồn cuộn bao phủ mười phương cực nhọc phàm nhân, một bước hóa long nghìn vạn kiếp tôn sùng.",
    "Nhìn ngắm thần sắc có chí tôn chi ảnh chập chờn chiếu mệnh phi thường hãn hữu! Trăm vạn dặm sơn hà quỳ gối xin làm kiếm phó bản quang thần tiên chủ."
  ],
  SS: [
    "Khí chất vô vi tiên quang tột cùng rực rỡ. Tuy không đạt tối đa thần căn kỳ ảo nhưng bước tiến thanh thoát vô địch thế hệ, hoan hỉ chu du linh giới một phương chí cao.",
    "Đại khí vận hộ thân như rồng vờn mây cuộn sóng, cơ duyên liên miên ngộ thiên pháp quả. Con đường tiên sơn rộng mở thênh thang muôn dặm khôn tả.",
    "Bản lĩnh và căn nguyên sinh ra như tiên kiều chuyển thế thế tôn ngời ngời. Chấn động cửu châu, vang dội danh đức trong tông phái thần đỉnh."
  ],
  S: [
    "Dị thiên linh mạch xuất thần tột bậc hỏa lôi dữ dội. Lực công phạt phá hoại uy lực ngút trời khi đối đầu yêu ma quy tông đạo cốt.",
    "Thúc đẩy tu luyện với hiệu suất phong ấn tinh diệp bất phàm. Gặp tai ách luôn có tiên cung di bảo hóa cát thành tường cứu vớt tinh nguyên.",
    "Trời sinh cơ biến thiên cơ, linh căn biến hóa kì dị có cơ hội mở đường thăng thăng cực kì cao quý dẫu qua độ kiếp lôi hoành."
  ],
  A: [
    "Thiên linh tinh cốt vô biên sạch sẽ ôn dung. Tiến độ hấp thu tu vi hằng ngày nhanh hơn người thường gấp nhiều lần, là cột trụ tông đài vạn tu khao khát.",
    "Dẫn khí tụ thần quang thông thoáng phi thường ổn trọng. Vững bước trải qua năm tháng chắc chắn kết đan đại cát, trường niên ngắm trần phàm tự tại.",
    "Thuần ngũ kim hỏa dồi dào sức mộng, chế bảo hay tụ tinh đan đều đắc địa thong dong thanh liêm hiền hậu."
  ],
  B: [
    "Song hành linh căn sinh khắc linh động tươm tất. Làm việc siêng năng đạo tâm thâm sâu bất hủ thì vạn năm thọ hạn hứa hẹn viên mãn đơm hoa kết đan phái tự nhiên.",
    "Có hoài bão kiên định tu lôi phong hành giả hành trình gian khó dẫu vậy ý chí sắc đá không sợ luân hồi bộc phát uy quang bản linh.",
    "Phúc trạch thế sương tàng trữ trung bình, thích ứng thiên điền linh dực dược vật gia trì phi phái an ổn."
  ],
  C: [
    "Linh căn tam hành rối rắm dồn tụ linh lực chậm phục hồi. Đạo đồ thăng cấp gian nan đòi hỏi nghịch thiên chí bảo tẩy quấn thần kinh mới mong chuyển mình khởi sắc.",
    "Sinh mệnh bình thản an nhàn tu đạo vô ưu. Trải qua mưa gió giang hồ học tập đạo trận phù lục làm cứu sinh an nguy thủ bản chân tông.",
    "Hành trình đạo mạch lúc thịnh lúc suy trắc trở liên tiếp nhưng kiên kiên chí tại sẽ ngộ ra chân nguyên tâm đắc."
  ],
  F: [
    "Phế linh mạch hỗn loạn bất phân tơ hồng đứt gãy. Con đường tiên duyên mờ mịt ngàn vẹn khó khăn, tuy nhiên ngàn dặm tu tiên hành tâm vẫn sinh thành thần dũng, dốc chí phàm linh biến thế kỳ tích!",
    "Khí vận phàm trần mỏng manh bất túc linh dược dãn mạch. Thích hợp thủ thế an nguy nhân gian triều đình phú quý phú đạt vĩnh hằng hoặc dấn thân tìm đoạt bảo di tích cải biến linh thai."
  ]
};

// predictable deterministic calculation based on name string & options
export function calculateProfile(daoHieu: string, originId: string, gender: string, seedSalt = ''): CharacterProfile {
  // Simple deterministic seed generator from Dao Hieu string
  let seed = 0;
  const seedSource = `${daoHieu}${seedSalt}`;
  for (let i = 0; i < seedSource.length; i++) {
    seed += seedSource.charCodeAt(i) * (i + 1);
  }
  
  // Mix in origin index
  const originIndex = ORIGINS.findIndex(o => o.id === originId);
  seed += (originIndex + 1) * 37;

  // Mix in gender index
  seed += (gender === 'Nam' ? 101 : gender === 'Nữ' ? 202 : 303);

  // Pick Realm based on deterministic luck math
  // We want to scale it so lower, middle, higher realms represent normal distribution
  const luckPercentage = (seed % 100); // 0 to 99
  
  let realmIndex = 0;
  if (luckPercentage < 8) {
    // 8% chance of Phế Phẩm, which also weakens later rolls.
    realmIndex = REALMS.findIndex(r => r.id === 'phe_pham');
  } else if (luckPercentage < 40) {
    // 40% chance of Nhan Gioi (Luyện Khí, Trúc Cơ, Kết Đan, Nguyên Anh, Hóa Thần)
    realmIndex = seed % 5;
  } else if (luckPercentage < 85) {
    // 45% chance of Linh Gioi (Luyện Hư, Hợp Thể, Đại Thừa, Độ Kiếp)
    realmIndex = 5 + (seed % 4);
  } else {
    // 15% chance of legendary Tiên Giới (Chân Tiên, Kim Tiên, Thái Ất, Đại La, Đạo Tổ)
    realmIndex = 9 + (seed % 5);
  }
  
  // Bound limit
  realmIndex = Math.min(Math.max(0, realmIndex), REALMS.length - 1);
  const realm = { ...REALMS[realmIndex] };
  const isPhePhamRealm = realm.id === 'phe_pham';

  // Adjust Stage based on seed to add high precision
  const stageOptions = ['Sơ Kỳ', 'Trung Kỳ', 'Hậu Kỳ', 'Đại Viên Mãn'];
  if (realm.id !== 'do_kiep' && !isPhePhamRealm) {
    realm.stageName = stageOptions[seed % stageOptions.length];
  }

  // Pick Linh Can
  let linhCanIndex = 0;
  // If we got high realm, we have higher chance of legendary Linh can
  if (isPhePhamRealm && ((seed * 17) % 100) < 75) {
    linhCanIndex = LINH_CANS.findIndex(lc => lc.id === 'phe_can_tich');
  } else if (luckPercentage > 80) {
    // pick from better ones or Hỗn nguyên ngũ linh căn
    const highTierIndices = [0, 1, 2, 8, 12]; // Lôi, Băng, Phong, U Minh, Hỗn Nguyên
    linhCanIndex = highTierIndices[seed % highTierIndices.length];
  } else {
    linhCanIndex = seed % LINH_CANS.length;
  }
  if (linhCanIndex < 0) linhCanIndex = 0;
  const linhCan = { ...LINH_CANS[linhCanIndex] };

  // Pick Physique (80% chance of having a physical body trait, 30% for rare ones)
  let physique: Physique | null = null;
  const physicsLuckySeed = (seed * 73) % 100;
  const shouldUsePhamThai = isPhePhamRealm && ((seed * 31) % 100) < 80;
  if (!shouldUsePhamThai && physicsLuckySeed < 80) {
    let physIndex = 0;
    if (physicsLuckySeed < 15) {
      // Legendary level (Hoang cổ thánh thể, Hồng mông đạo thể, Chân long)
      const legendaryPhys = [1, 2, 5];
      physIndex = legendaryPhys[seed % legendaryPhys.length];
    } else {
      physIndex = seed % PHYSIQUES.length;
    }
    physique = { ...PHYSIQUES[physIndex] };
  }

  // Calculate Base Stats (1-100)
  const originObj = ORIGINS.find(o => o.id === originId) || ORIGINS[0];
  const oBonus = originObj.bonusStat;

  // Set predictable deterministic baseline metrics
  let bSpeed = 30 + (seed % 50);
  let bMana = 30 + ((seed * 35) % 50);
  let bCombat = 25 + ((seed * 91) % 55);
  let bLife = 20 + ((seed * 19) % 65);
  let bLuck = 15 + ((seed * 144) % 75);

  // Apply Linh Can Multipliers
  bSpeed = Math.round(bSpeed * linhCan.cultivationMulti);
  bMana = Math.round(bMana * Math.max(0.8, linhCan.cultivationMulti * 0.9));
  if (linhCan.id === 'loi_linh_can' || linhCan.id === 'phong_linh_can') bSpeed += 25;
  if (linhCan.id === 'thien_hoa_can' || linhCan.id === 'u_minh_can') bCombat += 20;

  // Apply Physique bonuses
  if (physique) {
    bCombat += physique.combatBoost;
    if (physique.id === 'khong_linh_the') bSpeed += 30;
    if (physique.id === 'hoang_co_thanh_the') { bCombat += 30; bLife += 20; }
    if (physique.id === 'hong_mong_dao_the') { bSpeed += 25; bMana += 35; bLuck += 15; }
  }

  // Apply Origin background adjustments
  if (oBonus.cultivationSpeed) bSpeed += oBonus.cultivationSpeed;
  if (oBonus.manaReserve) bMana += oBonus.manaReserve;
  if (oBonus.combatPower) bCombat += oBonus.combatPower;
  if (oBonus.fateLuck) bLuck += oBonus.fateLuck;

  // Bound stats to (10 - 100) range except for absolute max ones
  const clamp = (val: number, maxVal = 100) => Math.min(Math.max(val, 10), maxVal);
  bSpeed = clamp(bSpeed);
  bMana = clamp(bMana);
  bCombat = clamp(bCombat);
  bLuck = clamp(bLuck);
  
  // Lifespan score scaling based on REALM base lifespan
  bLife = clamp(Math.round(Math.log10(realm.baseLifespan) * 10) + (physique?.id === 'hoang_co_thanh_the' ? 15 : 5), 100);

  const isFullPhePhamCombo = isPhePhamRealm && linhCan.id === 'phe_can_tich' && !physique;
  if (isFullPhePhamCombo) {
    bSpeed = 36;
    bMana = 36;
    bCombat = 36;
    bLuck = 36;
    bLife = 36;
  }

  // Generate Rank overall numerical calculation
  // Base rank logic depends on realm + linh can + physique quality
  let rawScore = (bSpeed + bMana + bCombat + bLuck + bLife) / 5;
  
  // Power boost from higher world
  if (realm.world === 'PHE_PHAM') rawScore -= 25;
  if (realm.world === 'LINH_GIOI') rawScore += 12;
  if (realm.world === 'TIEN_GIOI') rawScore += 25;

  let rank: 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' = 'D';
  if (rawScore >= 95) rank = 'SSS';
  else if (rawScore >= 85) rank = 'SS';
  else if (rawScore >= 75) rank = 'S';
  else if (rawScore >= 62) rank = 'A';
  else if (rawScore >= 48) rank = 'B';
  else if (rawScore >= 32) rank = 'C';
  else if (rawScore >= 18) rank = 'D';
  else rank = 'F';

  // Make sure ranking aligns with Linh can SSS quality too!
  if (linhCan.rarity === 'SSS' && !isPhePhamRealm) {
    rank = 'SSS';
    rawScore = Math.max(96, rawScore);
  }

  if (isPhePhamRealm && (rank === 'SSS' || rank === 'SS' || rank === 'S' || rank === 'A')) {
    rank = 'B';
  }

  // Formulate appraisal verdict
  const verdicts = VERDICT_TEMPLATES[rank === 'SSS' || rank === 'SS' ? rank : (rank === 'S' || rank === 'A' || rank === 'B' || rank === 'C' ? rank : 'F')];
  const verdict = isFullPhePhamCombo
    ? 'Phàm nhân phế phẩm rác rưởi vứt đi'
    : verdicts[seed % verdicts.length];

  return {
    id: `tu_tien_${seed}_${Date.now()}`,
    daoHieu,
    origin: originObj.name,
    originId,
    gender: gender as 'Nam' | 'Nữ' | 'Vô Định',
    realm,
    linhCan,
    physique,
    timestamp: new Date().toISOString(),
    ratingScore: Math.round(rawScore * 10),
    rank,
    philosophicalVerdict: verdict,
    radarStats: {
      cultivationSpeed: bSpeed,
      manaReserve: bMana,
      combatPower: bCombat,
      lifespan: bLife,
      fateLuck: bLuck
    }
  };
}
