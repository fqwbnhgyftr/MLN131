import {
  UsersIcon,
  ScaleIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  BuildingLibraryIcon,
  MegaphoneIcon,
  ShieldExclamationIcon,
  NewspaperIcon
} from '@heroicons/react/24/solid';

// KEY MAP (để tránh nhầm lẫn):
// people  = Hòa hợp tôn giáo
// class   = Lòng tin tín đồ
// idea    = Giáo lý & Đối thoại
// intl    = Ổn định cộng đồng

// =====================
// REGULAR CARDS (60)
// =====================
const regularCards = [
  {
    faction: "Cộng đồng Công giáo",
    text: "Giáo dân muốn tổ chức lễ lớn ngoài trời, có thể ảnh hưởng khu dân cư khác. Cho phép?",
    yes: { people: +8, class: +5, idea: -6, intl: -5 },
    no: { people: -7, class: -6, idea: +5, intl: +6 }
  },
  {
    faction: "Phật giáo",
    text: "Chùa tổ chức từ thiện quy mô lớn nhưng chưa đủ giấy phép. Bỏ qua?",
    yes: { people: +7, class: +5, idea: -7, intl: -4 },
    no: { people: -6, class: -5, idea: +6, intl: +5 }
  },
  {
    faction: "Chính quyền",
    text: "Đề xuất siết hoạt động tôn giáo để tránh xung đột. Đồng ý?",
    yes: { people: -6, class: -7, idea: +9, intl: +6 },
    no: { people: +6, class: +6, idea: -6, intl: -6 }
  },
  {
    faction: "Mạng xã hội",
    text: "Tin đồn xúc phạm tôn giáo lan rộng. Kiểm duyệt mạnh tay?",
    yes: { people: +5, class: -6, idea: +8, intl: +6 },
    no: { people: -7, class: +5, idea: -6, intl: -7 }
  },
  {
    faction: "Giao lưu liên tôn",
    text: "Đề xuất tổ chức sự kiện giao lưu giữa các tôn giáo. Ủng hộ?",
    yes: { people: +10, class: +5, idea: -4, intl: +3 },
    no: { people: -8, class: -6, idea: +3, intl: -4 }
  },
  {
    faction: "Tranh chấp đất",
    text: "Hai tôn giáo tranh chấp đất xây cơ sở. Bạn đứng về một bên?",
    yes: { people: -10, class: -5, idea: +6, intl: -6 },
    no: { people: +4, class: -6, idea: -5, intl: +4 }
  },
  {
    faction: "Truyền đạo",
    text: "Nhóm truyền đạo hoạt động mạnh ở khu nhạy cảm. Hạn chế?",
    yes: { people: +4, class: -6, idea: +8, intl: +6 },
    no: { people: -7, class: +5, idea: -6, intl: -6 }
  },
  {
    faction: "Biểu tình",
    text: "Người dân biểu tình phản đối tôn giáo khác. Giải tán?",
    yes: { people: +5, class: -7, idea: +9, intl: +7 },
    no: { people: -9, class: +4, idea: -6, intl: -9 }
  },
  {
    faction: "Quốc tế",
    text: "Bị chỉ trích về tự do tôn giáo. Nới lỏng chính sách?",
    yes: { people: +6, class: +5, idea: -7, intl: +4 },
    no: { people: -6, class: -5, idea: +7, intl: -5 }
  },
  {
    faction: "Giáo dục",
    text: "Đưa giáo dục đa tôn giáo vào trường học. Áp dụng?",
    yes: { people: +8, class: +5, idea: +5, intl: +5 },
    no: { people: -6, class: -5, idea: -5, intl: -5 }
  },

  // ===== ANTI-SPAM CARDS =====

  {
    faction: "Thiên vị",
    text: "Bạn bị cho là thiên vị một tôn giáo. Tiếp tục ủng hộ họ?",
    yes: { people: -8, class: -7, idea: +6, intl: -6 },
    no: { people: +5, class: +6, idea: -5, intl: +4 }
  },
  {
    faction: "Kiểm soát",
    text: "Bạn tăng kiểm soát để giữ ổn định. Tiếp tục siết chặt?",
    yes: { people: -6, class: -7, idea: +9, intl: +8 },
    no: { people: +6, class: +5, idea: -6, intl: -6 }
  },
  {
    faction: "Tự do",
    text: "Cho phép tự do tôn giáo tối đa, bất chấp rủi ro. Đồng ý?",
    yes: { people: +7, class: +6, idea: -8, intl: -9 },
    no: { people: -5, class: -5, idea: +7, intl: +6 }
  },

  // ===== RANDOMIZED (40 cards) =====

  ...Array.from({ length: 40 }).map((_, i) => ({
    faction: "Tình huống xã hội",
    text: `Tình huống #${i + 1}: Một tranh chấp tôn giáo nhỏ đang leo thang. Bạn can thiệp theo hướng mềm mỏng?`,
    yes: { people: +6, class: +5, idea: -6, intl: +4 },
    no: { people: -6, class: -5, idea: +6, intl: -4 }
  }))
];

// =====================
// TURN EVENTS (5 sự kiện tại các mốc lượt quan trọng)
// =====================
const turnBasedEvents = [
  {
    turn: 5,
    faction: "Khủng hoảng truyền thông",
    icon: NewspaperIcon,
    text: "Video giả mạo về 'xung đột tôn giáo đẫm máu' lan truyền chóng mặt. Họp báo phủ nhận ngay?",
    yes: { people: +5, class: +6, idea: -4, intl: +8 },
    no: { people: -8, class: -5, idea: +4, intl: -9 }
  },
  {
    turn: 10,
    faction: "Lễ hội lớn",
    icon: UsersIcon,
    text: "Ba tôn giáo lớn cùng có lễ hội quan trọng trong một tuần. Tổ chức không gian chung?",
    yes: { people: +10, class: +7, idea: +6, intl: +8 },
    no: { people: -6, class: -5, idea: -5, intl: -7 }
  },
  {
    turn: 15,
    faction: "Xung đột vùng",
    icon: ExclamationTriangleIcon,
    text: "Căng thẳng tôn giáo bùng phát tại 3 tỉnh cùng lúc. Điều phối viên liên tôn khẩn cấp?",
    yes: { people: +6, class: +5, idea: +5, intl: +10 },
    no: { people: -7, class: -6, idea: -5, intl: -11 }
  },
  {
    turn: 20,
    faction: "Áp lực quốc tế",
    icon: GlobeAltIcon,
    text: "Báo cáo quốc tế xếp Việt Nam vào danh sách 'cần theo dõi' về tự do tôn giáo. Phản hồi chính thức?",
    yes: { people: +6, class: +5, idea: -6, intl: +9 },
    no: { people: -5, class: -5, idea: +5, intl: -8 }
  },
  {
    turn: 25,
    faction: "Thập niên hòa hợp",
    icon: HandRaisedIcon,
    text: "Kỷ niệm 10 năm chính sách hòa hợp tôn giáo. Tổ chức lễ kỷ niệm liên tôn quy mô lớn?",
    yes: { people: +12, class: +8, idea: +8, intl: +10 },
    no: { people: -8, class: -7, idea: -7, intl: -8 }
  }
];

// =====================
// THRESHOLD EVENTS (kích hoạt khi chỉ số xuống thấp)
// =====================
const thresholdEvents = [
  {
    id: "low_harmony",
    condition: (s) => s.people <= 25,
    faction: "Khủng hoảng hòa hợp",
    icon: ExclamationTriangleIcon,
    text: "Hòa hợp tôn giáo chạm đáy — xung đột nhỏ bùng phát khắp nơi. Tổ chức hòa giải khẩn cấp toàn thành phố?",
    yes: { people: +12, class: -5, idea: -3, intl: +5 },
    no: { people: -8, class: +2, idea: +3, intl: -11 }
  },
  {
    id: "low_trust",
    condition: (s) => s.class <= 25,
    faction: "Khủng hoảng niềm tin",
    icon: UsersIcon,
    text: "Tín đồ mất niềm tin vào lãnh đạo và chính quyền. Công khai xin lỗi và cam kết cải cách?",
    yes: { people: +5, class: +13, idea: -4, intl: +4 },
    no: { people: -6, class: -9, idea: +5, intl: -6 }
  },
  {
    id: "low_idea",
    condition: (s) => s.idea <= 25,
    faction: "Khủng hoảng đối thoại",
    icon: ScaleIcon,
    text: "Các tôn giáo ngừng đối thoại, mỗi bên co cụm lại. Triệu tập Hội nghị Đối thoại Khẩn cấp?",
    yes: { people: +4, class: +4, idea: +14, intl: +4 },
    no: { people: -4, class: -4, idea: -9, intl: -6 }
  },
  {
    id: "low_stability",
    condition: (s) => s.intl <= 25,
    faction: "Khủng hoảng ổn định",
    icon: ShieldExclamationIcon,
    text: "Xã hội trên bờ vực hỗn loạn tôn giáo. Áp dụng lệnh giới nghiêm tạm thời tại điểm nóng?",
    yes: { people: -5, class: -5, idea: +7, intl: +14 },
    no: { people: +5, class: +4, idea: -5, intl: -11 }
  }
];

export { regularCards, turnBasedEvents, thresholdEvents };