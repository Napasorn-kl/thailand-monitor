// Static dataset: Thailand business registrations, sectors, provinces

export const SECTORS = [
  { name:'Tourism',        nameTH:'การท่องเที่ยว',   reg:28500,  cap:892,    avg:31.3,  growth:12.4,  share:5.2,  oilSens:'H',  col:'#22d3ee' },
  { name:'Retail',         nameTH:'ค้าปลีก',          reg:125400, cap:962,    avg:7.7,   growth:5.1,   share:22.9, oilSens:'M',  col:'#3b82f6' },
  { name:'Hospitality',    nameTH:'บริการที่พัก',     reg:24200,  cap:1100,   avg:45.5,  growth:8.2,   share:4.4,  oilSens:'H',  col:'#f97316' },
  { name:'Wholesale',      nameTH:'ค้าส่ง',           reg:45800,  cap:780,    avg:17.0,  growth:3.8,   share:8.3,  oilSens:'M',  col:'#f59e0b' },
  { name:'Construction',   nameTH:'ก่อสร้าง',         reg:35600,  cap:720,    avg:20.2,  growth:8.7,   share:6.5,  oilSens:'H',  col:'#22c55e' },
  { name:'Manufacturing',  nameTH:'อุตสาหกรรม',       reg:45200,  cap:1800,   avg:39.8,  growth:3.2,   share:8.2,  oilSens:'H',  col:'#8b5cf6' },
  { name:'Real Estate',    nameTH:'อสังหาริมทรัพย์',  reg:18900,  cap:1200,   avg:63.5,  growth:-1.2,  share:3.4,  oilSens:'L',  col:'#ec4899' },
  { name:'Other Services', nameTH:'บริการอื่นๆ',      reg:38400,  cap:265,    avg:6.9,   growth:2.1,   share:7.0,  oilSens:'L',  col:'#6b7280' },
  { name:'Healthcare',     nameTH:'สุขภาพ',           reg:8200,   cap:145,    avg:17.7,  growth:6.5,   share:1.5,  oilSens:'L',  col:'#ef4444' },
  { name:'Agriculture',    nameTH:'เกษตร',            reg:12800,  cap:320,    avg:25.0,  growth:2.4,   share:2.3,  oilSens:'M',  col:'#65a30d' },
  { name:'Finance',        nameTH:'การเงิน',          reg:15200,  cap:2400,   avg:157.9, growth:4.8,   share:2.8,  oilSens:'L',  col:'#0ea5e9' },
  { name:'Transport',      nameTH:'ขนส่ง',            reg:22400,  cap:380,    avg:17.0,  growth:-2.1,  share:4.1,  oilSens:'H',  col:'#f43f5e' },
  { name:'Technology',     nameTH:'เทคโนโลยี',        reg:18600,  cap:142,    avg:7.6,   growth:15.2,  share:3.4,  oilSens:'L',  col:'#6366f1' },
  { name:'Education',      nameTH:'การศึกษา',         reg:9400,   cap:89,     avg:9.5,   growth:3.1,   share:1.7,  oilSens:'L',  col:'#14b8a6' },
  { name:'Energy',         nameTH:'พลังงาน',          reg:4200,   cap:980,    avg:233.3, growth:6.8,   share:0.8,  oilSens:'+',  col:'#f59e0b' },
  { name:'Media',          nameTH:'สื่อ',             reg:7800,   cap:62,     avg:7.9,   growth:1.4,   share:1.4,  oilSens:'L',  col:'#a855f7' },
];

export const GOLD_EXPOSURE = {
  Tourism:        { score:45, th:'แหล่งท่องเที่ยวผลิตภัณฑ์ทองไทย',     note:'สินค้าของที่ระลึกทองคำ' },
  Finance:        { score:82, th:'สินทรัพย์ป้องกันความเสี่ยง',           note:'ETF ทองคำ, Gold Futures' },
  Wholesale:      { score:38, th:'จิวเวลรี่ ค้าปลีกทองคำ',               note:'ร้านทองในห้าง, Wholesale' },
  Manufacturing:  { score:22, th:'ส่วนประกอบทางอิเล็กทรอนิกส์',         note:'Gold bonding wires' },
  Energy:         { score:65, th:'ทองคำใช้ใน Solar Cell',                note:'Gold contact layers' },
  Retail:         { score:35, th:'เครื่องประดับค้าปลีก',                  note:'Jewelry retail' },
  'Real Estate':  { score:28, th:'สินทรัพย์ทางเลือก',                    note:'REIT vs Gold allocation' },
};

export const PROVINCES_DATA = [
  { id:'BKK',  th:'กรุงเทพมหานคร',        en:'Bangkok',                reg:4820,  cap:4200, dens:8200, pop:'10.8M', region:'central' },
  { id:'CNX',  th:'เชียงใหม่',            en:'Chiang Mai',             reg:1420,  cap:38,   dens:2800, pop:'1.8M',  region:'north'   },
  { id:'HKT',  th:'ภูเก็ต',              en:'Phuket',                 reg:986,   cap:52,   dens:3100, pop:'0.4M',  region:'south'   },
  { id:'CBI',  th:'ชลบุรี',              en:'Chonburi',               reg:1280,  cap:68,   dens:2400, pop:'1.5M',  region:'east'    },
  { id:'KKN',  th:'ขอนแก่น',             en:'Khon Kaen',              reg:820,   cap:22,   dens:1200, pop:'1.8M',  region:'north-east'},
  { id:'NMA',  th:'นครราชสีมา',           en:'Nakhon Ratchasima',      reg:750,   cap:19,   dens:950,  pop:'2.7M',  region:'north-east'},
  { id:'SNI',  th:'สุราษฎร์ธานี',        en:'Surat Thani',            reg:620,   cap:15,   dens:880,  pop:'1.1M',  region:'south'   },
  { id:'AYA',  th:'พระนครศรีอยุธยา',     en:'Phra Nakhon Si Ayutthaya',reg:580,  cap:12,   dens:820,  pop:'0.8M',  region:'central' },
  { id:'CRI',  th:'เชียงราย',            en:'Chiang Rai',             reg:480,   cap:8.5,  dens:620,  pop:'1.3M',  region:'north'   },
  { id:'UDN',  th:'อุดรธานี',            en:'Udon Thani',             reg:540,   cap:11,   dens:750,  pop:'1.6M',  region:'north-east'},
  { id:'NBI',  th:'นนทบุรี',             en:'Nonthaburi',             reg:920,   cap:85,   dens:3200, pop:'1.3M',  region:'central' },
  { id:'SMK',  th:'สมุทรปราการ',          en:'Samut Prakan',           reg:840,   cap:72,   dens:2800, pop:'1.3M',  region:'central' },
  { id:'RYG',  th:'ระยอง',               en:'Rayong',                 reg:680,   cap:92,   dens:1800, pop:'0.7M',  region:'east'    },
  { id:'PRI',  th:'ปทุมธานี',            en:'Pathum Thani',           reg:720,   cap:64,   dens:2200, pop:'1.1M',  region:'central' },
  { id:'SBR',  th:'สระบุรี',             en:'Saraburi',               reg:380,   cap:28,   dens:980,  pop:'0.6M',  region:'central' },
  { id:'SKA',  th:'สระแก้ว',             en:'Sa Kaeo',                reg:220,   cap:8,    dens:420,  pop:'0.6M',  region:'east'    },
  { id:'LOI',  th:'เลย',                 en:'Loei',                   reg:180,   cap:6,    dens:380,  pop:'0.6M',  region:'north-east'},
  { id:'PYO',  th:'พะเยา',               en:'Phayao',                 reg:160,   cap:4.2,  dens:320,  pop:'0.5M',  region:'north'   },
  { id:'NST',  th:'นครศรีธรรมราช',       en:'Nakhon Si Thammarat',    reg:480,   cap:14,   dens:820,  pop:'1.6M',  region:'south'   },
  { id:'HAI',  th:'หาดใหญ่ (สงขลา)',     en:'Hat Yai (Songkhla)',     reg:520,   cap:22,   dens:1100, pop:'1.4M',  region:'south'   },
];

export const OVERVIEW_TREND_DATA = {
  labels: ['ต.ค./67','พ.ย./67','ธ.ค./67','ม.ค./68','ก.พ./68','มี.ค./68','เม.ย./68','พ.ค./68','มิ.ย./68','ก.ค./68','ส.ค./68','ก.ย./68','ต.ค./68','พ.ย./68','ธ.ค./68','ม.ค./69','ก.พ./69'],
  gdpIndex: [255,188,308,292,296,290,252,278,292,286,282,312,290,330,298,290,302],
  exports:  [22100,20400,26800,24200,23500,23800,22900,23400,23900,23200,23500,24800,23400,26200,21900,23300,24100],
};

export const FX_DATA = {
  labels: ['ต.ค.','พ.ย.','ธ.ค.','ม.ค.','ก.พ.','มี.ค.'],
  rates:  [34.1, 33.8, 33.5, 34.2, 34.6, 34.82],
};

export const TOURISM_DATA = {
  labels:   ['ต.ค.','พ.ย.','ธ.ค.','ม.ค.','ก.พ.','มี.ค.'],
  arrivals: [2.8, 3.1, 3.5, 2.1, 2.2, 2.4],
};

export const TRADE_DATA = {
  labels:  ['ต.ค.','พ.ย.','ธ.ค.','ม.ค.','ก.พ.','มี.ค.'],
  exports: [23.4, 22.8, 21.9, 23.3, 24.1, 24.8],
  imports: [22.8, 23.1, 20.4, 22.1, 23.8, 24.2],
};

export const OIL_PRICE_DATA = {
  labels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
  brent:  [88.2, 84.1, 79.5, 78.2, 82.1, 80.5, 85.3, 84.8, 82.1, 78.5, 76.2, 75.1],
  dubai:  [86.7, 82.6, 78.0, 76.7, 80.6, 79.0, 83.8, 83.3, 80.6, 77.0, 74.7, 73.6],
};

export const GOLD_PRICE_DATA = {
  labels:     ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
  barSell:    [61200, 62800, 65400, 67800, 68200, 69100, 70500, 71200, 70800, 71500, 72100, 71800],
};

export const FDI_DATA = {
  labels: ['Q1/67','Q2/67','Q3/67','Q4/67','Q1/68','Q2/68','Q3/68','Q4/68'],
  values: [285, 320, 295, 388, 310, 342, 378, 425],
};

export const FDI_ORIGIN = {
  labels: ['Japan','China','Singapore','USA','EU','Others'],
  values: [24, 18, 16, 12, 10, 20],
  colors: ['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#94a3b8'],
};

export const FDI_SECTOR = {
  labels: ['EV & Auto','Electronics','Petrochemical','Real Estate','Healthcare','Others'],
  values: [38, 22, 14, 12, 8, 6],
  colors: ['#0891b2','#8b5cf6','#d97706','#ec4899','#ef4444','#94a3b8'],
};

export const OIL_ORIGIN = {
  labels: ['Middle East','Asia Pacific','Africa','Americas','Other'],
  values: [62, 18, 10, 6, 4],
  colors: ['#d97706','#22d3ee','#ef4444','#3b82f6','#94a3b8'],
};

export const SIMULATOR_BASE = {
  totalReg:  548600,
  totalCap:  9800,   // ฿B
  monthlyReg: 13500,
  monthlyCap: 815,   // ฿M
  baseBrent:  74,
  baseCPI:    0.64,
};

export const BRIEFING_DATA = {
  opportunities: [
    { badge:'HIGH', pct:'↑ 32%', title:'EV & Clean Energy Investment', desc:'FDI ใน EV เพิ่มขึ้น 32% YoY ผลักดันโดยนักลงทุนจีนและญี่ปุ่น ระยองและชลบุรีเป็นศูนย์กลาง', col:'#22c55e' },
    { badge:'HIGH', pct:'↑ 28%', title:'Medical Tourism Recovery',     desc:'นักท่องเที่ยวเชิงการแพทย์จากตะวันออกกลางเพิ่มขึ้น 28% YoY กรุงเทพฯ ชั้นนำด้าน wellness tourism', col:'#22c55e' },
    { badge:'MED',  pct:'↑ 15%', title:'AgriTech Startups Surge',      desc:'สตาร์ทอัพด้านเกษตรอัจฉริยะในภาคอีสาน เพิ่มขึ้น 15% การทำ precision farming ขยายตัว', col:'#f59e0b' },
  ],
  risks: [
    { badge:'HIGH', pct:'-18%',  title:'Transport Sector Pressure',     desc:'ต้นทุนน้ำมันดีเซลกดดันกำไรขนส่ง ราคา Brent สูงกว่า $74 ส่งผลต้นทุนเพิ่ม 8–12%', col:'#ef4444' },
    { badge:'MED',  pct:'-12%',  title:'Real Estate Slowdown',          desc:'ดัชนีราคาที่อยู่อาศัยลดลง การขึ้นดอกเบี้ยกระทบกำลังซื้อ โดยเฉพาะ Condo เขตกรุงเทพฯ', col:'#f59e0b' },
    { badge:'LOW',  pct:'-5%',   title:'SME Capital Constraints',       desc:'สัดส่วน SME ขอสินเชื่อไม่ผ่านเพิ่มเป็น 34% ทุนจดทะเบียนเฉลี่ยลดลง 5% เทียบปีก่อน', col:'#94a3b8' },
  ],
  trends: [
    { badge:'NEW',  pct:'+24%',  title:'Digital Economy Expansion',     desc:'ธุรกิจ e-Commerce และ Fintech เติบโต 24% YoY จำนวนนิติบุคคลด้านเทคโนโลยีเพิ่ม 15K ราย', col:'#6366f1' },
    { badge:'HOT',  pct:'+19%',  title:'Green & Sustainable Business',  desc:'บริษัท ESG เพิ่ม 19% YoY กองทุน Green Bond ระดมทุน ฿85B พลังงานแสงอาทิตย์เติบโตเร็วสุด', col:'#22c55e' },
    { badge:'NEW',  pct:'+11%',  title:'Healthcare & Wellness Boom',    desc:'โรงพยาบาลเอกชน คลินิกสุขภาพ Spa Wellness เติบโต 11% YoY จากเทรนด์ Post-COVID', col:'#0891b2' },
  ],
};

export const GRAPH_NODES_DATA = [
  { id:'Tourism',       type:'sector', col:'#22d3ee', size:28, x:0.30, y:0.20 },
  { id:'Retail',        type:'sector', col:'#3b82f6', size:42, x:0.60, y:0.35 },
  { id:'Hospitality',   type:'sector', col:'#f97316', size:26, x:0.20, y:0.38 },
  { id:'Manufacturing', type:'sector', col:'#8b5cf6', size:34, x:0.75, y:0.25 },
  { id:'Construction',  type:'sector', col:'#22c55e', size:30, x:0.48, y:0.55 },
  { id:'Wholesale',     type:'sector', col:'#f59e0b', size:32, x:0.68, y:0.58 },
  { id:'Real Estate',   type:'sector', col:'#ec4899', size:24, x:0.30, y:0.65 },
  { id:'Finance',       type:'sector', col:'#0ea5e9', size:28, x:0.82, y:0.45 },
  { id:'Bangkok',       type:'province', col:'#22c55e', size:44, x:0.50, y:0.15 },
  { id:'Chiang Mai',    type:'province', col:'#22c55e', size:28, x:0.18, y:0.22 },
  { id:'Phuket',        type:'province', col:'#22c55e', size:26, x:0.12, y:0.52 },
  { id:'Chonburi',      type:'province', col:'#22c55e', size:30, x:0.85, y:0.68 },
];

export const GRAPH_EDGES = [
  [0,8],[0,9],[0,10],[1,8],[1,11],[2,8],[2,9],[2,10],[3,11],[4,8],[4,11],[5,8],[5,11],[6,8],[7,8],
];

export const DBD_MONTHLY_DATA = {
  labels: ['ต.ค./67','พ.ย./67','ธ.ค./67','ม.ค./68','ก.พ./68','มี.ค./68'],
  new:    [13420, 12180, 9850, 13900, 13100, 12847],
  cap:    [38.2, 29.4, 22.1, 42.8, 39.1, 35.6],
  sectors:[
    { name:'Retail & Commerce', pct:28 },
    { name:'Construction',      pct:14 },
    { name:'Services',          pct:18 },
    { name:'Food & Beverage',   pct:12 },
    { name:'Real Estate',       pct:9  },
    { name:'Manufacturing',     pct:11 },
    { name:'Other',             pct:8  },
  ],
};

export const CUSTOMS_TRADE_DATA = {
  labels:  ['ต.ค./67','พ.ย./67','ธ.ค./67','ม.ค./68','ก.พ./68','มี.ค./68'],
  exports: [23400, 22800, 21900, 23300, 24100, 24800],
  imports: [22800, 23100, 20400, 22100, 23800, 24200],
  topExports: [
    { name:'อิเล็กทรอนิกส์',   pct:28, value:'$6.9B' },
    { name:'รถยนต์ชิ้นส่วน',   pct:18, value:'$4.5B' },
    { name:'เม็ดพลาสติก',      pct:12, value:'$3.0B' },
    { name:'ยาง',              pct:9,  value:'$2.2B' },
    { name:'อาหารกระป๋อง',    pct:8,  value:'$2.0B' },
  ],
};

export const OPEN_DATASETS = [
  { title:'ข้อมูลนิติบุคคลจดทะเบียน 2567', org:'DBD', date:'2024-Q4', format:'csv',  category:'dbd',     url:'https://data.go.th/dataset/juristic-2567' },
  { title:'มูลค่าการค้าระหว่างประเทศไทย',  org:'Customs', date:'2025-Q1', format:'xlsx', category:'customs', url:'https://data.go.th/dataset/trade-2025' },
  { title:'ดัชนีราคาผู้บริโภค (CPI)',       org:'MOC',     date:'Mar 2025', format:'json', category:'econ',    url:'https://data.go.th/dataset/cpi-2025' },
  { title:'อัตราการจ้างงานรายอุตสาหกรรม',   org:'NSO',     date:'Q4 2024',  format:'xlsx', category:'econ',    url:'https://data.go.th/dataset/employment' },
  { title:'สถิตินำเข้าส่งออกแยกสินค้า',    org:'Customs', date:'Mar 2025', format:'csv',  category:'customs', url:'https://data.go.th/dataset/customs-hs' },
  { title:'ทะเบียนนิติบุคคล API',           org:'DBD',     date:'Live',     format:'api',  category:'dbd',     url:'https://data.go.th/dataset/juristic-api' },
  { title:'ดัชนีผลผลิตภาคอุตสาหกรรม MPI',  org:'OIE',     date:'Feb 2025', format:'xlsx', category:'econ',    url:'https://data.go.th/dataset/mpi' },
  { title:'ข้อมูลนักท่องเที่ยวรายเดือน',   org:'MOTS',    date:'Feb 2025', format:'csv',  category:'econ',    url:'https://data.go.th/dataset/tourism-monthly' },
];
