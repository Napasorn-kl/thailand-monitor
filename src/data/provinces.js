// Province data with hexagon grid positions for the Thailand map
// Positions are normalized (col, row) for a hex grid layout

export const PROVINCE_HEX = [
  // Northern Thailand
  { id:'CRI',  th:'เชียงราย',            en:'Chiang Rai',              col:3,  row:1,  region:'north'     },
  { id:'PYO',  th:'พะเยา',               en:'Phayao',                  col:4,  row:1,  region:'north'     },
  { id:'NAN',  th:'น่าน',                en:'Nan',                     col:5,  row:1,  region:'north'     },
  { id:'CNX',  th:'เชียงใหม่',           en:'Chiang Mai',              col:3,  row:2,  region:'north'     },
  { id:'LPG',  th:'ลำปาง',               en:'Lampang',                 col:4,  row:2,  region:'north'     },
  { id:'PRE',  th:'แพร่',                en:'Phrae',                   col:5,  row:2,  region:'north'     },
  { id:'LPN',  th:'ลำพูน',               en:'Lamphun',                 col:3,  row:3,  region:'north'     },
  { id:'TAK',  th:'ตาก',                 en:'Tak',                     col:2,  row:3,  region:'north'     },
  { id:'SUK',  th:'สุโขทัย',             en:'Sukhothai',               col:4,  row:3,  region:'north'     },

  // North-East Thailand (Isaan)
  { id:'LOI',  th:'เลย',                 en:'Loei',                    col:6,  row:2,  region:'north-east'},
  { id:'UDN',  th:'อุดรธานี',            en:'Udon Thani',              col:7,  row:2,  region:'north-east'},
  { id:'NKP',  th:'นครพนม',              en:'Nakhon Phanom',           col:8,  row:2,  region:'north-east'},
  { id:'KKN',  th:'ขอนแก่น',             en:'Khon Kaen',               col:7,  row:3,  region:'north-east'},
  { id:'UBN',  th:'อุบลราชธานี',         en:'Ubon Ratchathani',        col:8,  row:3,  region:'north-east'},
  { id:'NMA',  th:'นครราชสีมา',          en:'Nakhon Ratchasima',       col:6,  row:4,  region:'north-east'},
  { id:'BRM',  th:'บุรีรัมย์',           en:'Buri Ram',                col:7,  row:4,  region:'north-east'},
  { id:'SSK',  th:'ศรีสะเกษ',            en:'Si Sa Ket',               col:8,  row:4,  region:'north-east'},

  // Central Thailand
  { id:'PHS',  th:'พิษณุโลก',            en:'Phitsanulok',             col:4,  row:4,  region:'central'  },
  { id:'PCK',  th:'เพชรบูรณ์',           en:'Phetchabun',              col:5,  row:4,  region:'central'  },
  { id:'ANG',  th:'อ่างทอง',             en:'Ang Thong',               col:3,  row:5,  region:'central'  },
  { id:'LPB',  th:'ลพบุรี',              en:'Lop Buri',                col:4,  row:5,  region:'central'  },
  { id:'SBR',  th:'สระบุรี',             en:'Saraburi',                col:5,  row:5,  region:'central'  },
  { id:'AYA',  th:'พระนครศรีอยุธยา',    en:'Ayutthaya',               col:3,  row:6,  region:'central'  },
  { id:'NBI',  th:'นนทบุรี',             en:'Nonthaburi',              col:2,  row:6,  region:'central'  },
  { id:'PRI',  th:'ปทุมธานี',            en:'Pathum Thani',            col:3,  row:7,  region:'central'  },
  { id:'BKK',  th:'กรุงเทพมหานคร',       en:'Bangkok',                 col:3,  row:8,  region:'central'  },
  { id:'SMK',  th:'สมุทรปราการ',          en:'Samut Prakan',            col:4,  row:8,  region:'central'  },
  { id:'SKA',  th:'สระแก้ว',             en:'Sa Kaeo',                 col:5,  row:7,  region:'east'     },

  // Eastern Thailand
  { id:'CBI',  th:'ชลบุรี',              en:'Chonburi',                col:5,  row:8,  region:'east'     },
  { id:'RYG',  th:'ระยอง',               en:'Rayong',                  col:6,  row:8,  region:'east'     },

  // Western / Southern Central
  { id:'PCB',  th:'เพชรบุรี',            en:'Phetchaburi',             col:2,  row:9,  region:'central'  },
  { id:'PRK',  th:'ประจวบคีรีขันธ์',     en:'Prachuap Khiri Khan',     col:2,  row:10, region:'central'  },

  // Southern Thailand
  { id:'SNI',  th:'สุราษฎร์ธานี',        en:'Surat Thani',             col:3,  row:11, region:'south'    },
  { id:'NST',  th:'นครศรีธรรมราช',       en:'Nakhon Si Thammarat',     col:4,  row:11, region:'south'    },
  { id:'KBI',  th:'กระบี่',              en:'Krabi',                   col:2,  row:12, region:'south'    },
  { id:'HKT',  th:'ภูเก็ต',              en:'Phuket',                  col:2,  row:13, region:'south'    },
  { id:'HAI',  th:'หาดใหญ่ (สงขลา)',     en:'Hat Yai (Songkhla)',      col:4,  row:12, region:'south'    },
];

// Detailed data for each province from staticData PROVINCES_DATA
export const PROVINCE_DETAILS = {
  BKK: { reg:4820, cap:4200, dens:8200, pop:'10.8M', energy:'high'  },
  CNX: { reg:1420, cap:38,   dens:2800, pop:'1.8M',  energy:'medium'},
  HKT: { reg:986,  cap:52,   dens:3100, pop:'0.4M',  energy:'medium'},
  CBI: { reg:1280, cap:68,   dens:2400, pop:'1.5M',  energy:'high'  },
  KKN: { reg:820,  cap:22,   dens:1200, pop:'1.8M',  energy:'medium'},
  NMA: { reg:750,  cap:19,   dens:950,  pop:'2.7M',  energy:'medium'},
  SNI: { reg:620,  cap:15,   dens:880,  pop:'1.1M',  energy:'low'   },
  AYA: { reg:580,  cap:12,   dens:820,  pop:'0.8M',  energy:'medium'},
  CRI: { reg:480,  cap:8.5,  dens:620,  pop:'1.3M',  energy:'low'   },
  UDN: { reg:540,  cap:11,   dens:750,  pop:'1.6M',  energy:'low'   },
  NBI: { reg:920,  cap:85,   dens:3200, pop:'1.3M',  energy:'high'  },
  SMK: { reg:840,  cap:72,   dens:2800, pop:'1.3M',  energy:'high'  },
  RYG: { reg:680,  cap:92,   dens:1800, pop:'0.7M',  energy:'high'  },
  PRI: { reg:720,  cap:64,   dens:2200, pop:'1.1M',  energy:'high'  },
  SBR: { reg:380,  cap:28,   dens:980,  pop:'0.6M',  energy:'medium'},
  SKA: { reg:220,  cap:8,    dens:420,  pop:'0.6M',  energy:'low'   },
  LOI: { reg:180,  cap:6,    dens:380,  pop:'0.6M',  energy:'low'   },
  PYO: { reg:160,  cap:4.2,  dens:320,  pop:'0.5M',  energy:'low'   },
  NST: { reg:480,  cap:14,   dens:820,  pop:'1.6M',  energy:'medium'},
  HAI: { reg:520,  cap:22,   dens:1100, pop:'1.4M',  energy:'medium'},
};
