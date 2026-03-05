// =======================================
// Airport & Airline Data
// =======================================

const AIRPORTS = [
  { code: 'BKK', name: 'กรุงเทพฯ', airport: 'สุวรรณภูมิ', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'DMK', name: 'กรุงเทพฯ', airport: 'ดอนเมือง', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'HKT', name: 'ภูเก็ต', airport: 'ภูเก็ต', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'CNX', name: 'เชียงใหม่', airport: 'เชียงใหม่', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'KBV', name: 'กระบี่', airport: 'กระบี่', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'USM', name: 'เกาะสมุย', airport: 'สมุย', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'HAJ', name: 'หาดใหญ่', airport: 'หาดใหญ่', country: 'ไทย', emoji: '🇹🇭' },
  { code: 'SIN', name: 'สิงคโปร์', airport: 'ชางงี', country: 'สิงคโปร์', emoji: '🇸🇬' },
  { code: 'KUL', name: 'กัวลาลัมเปอร์', airport: 'KLIA', country: 'มาเลเซีย', emoji: '🇲🇾' },
  { code: 'HKG', name: 'ฮ่องกง', airport: 'ฮ่องกง', country: 'ฮ่องกง', emoji: '🇭🇰' },
  { code: 'NRT', name: 'โตเกียว', airport: 'นาริตะ', country: 'ญี่ปุ่น', emoji: '🇯🇵' },
  { code: 'OSA', name: 'โอซาก้า', airport: 'คันไซ', country: 'ญี่ปุ่น', emoji: '🇯🇵' },
  { code: 'ICN', name: 'โซล', airport: 'อินชอน', country: 'เกาหลีใต้', emoji: '🇰🇷' },
  { code: 'PEK', name: 'ปักกิ่ง', airport: 'แคปิทัล', country: 'จีน', emoji: '🇨🇳' },
  { code: 'PVG', name: 'เซี่ยงไฮ้', airport: 'ผู่ตง', country: 'จีน', emoji: '🇨🇳' },
  { code: 'DXB', name: 'ดูไบ', airport: 'อินเตอร์เนชั่นแนล', country: 'UAE', emoji: '🇦🇪' },
  { code: 'LHR', name: 'ลอนดอน', airport: 'ฮีทโธรว์', country: 'อังกฤษ', emoji: '🇬🇧' },
  { code: 'CDG', name: 'ปารีส', airport: 'ชาร์ล เดอ โกล', country: 'ฝรั่งเศส', emoji: '🇫🇷' },
  { code: 'SYD', name: 'ซิดนีย์', airport: 'คิงส์ฟอร์ด สมิธ', country: 'ออสเตรเลีย', emoji: '🇦🇺' },
  { code: 'DEL', name: 'นิวเดลี', airport: 'อินทิรา คานธี', country: 'อินเดีย', emoji: '🇮🇳' },
];

const AIRLINES = [
  { code: 'TG', name: 'Thai Airways', emoji: '✈️', color: '#6B21A8' },
  { code: 'FD', name: 'Thai AirAsia', emoji: '🔴', color: '#DC2626' },
  { code: 'DD', name: 'Nok Air', emoji: '🐦', color: '#F59E0B' },
  { code: 'WE', name: 'Thai Smile', emoji: '😊', color: '#7C3AED' },
  { code: 'PG', name: 'Bangkok Airways', emoji: '🌸', color: '#DB2777' },
  { code: 'SQ', name: 'Singapore Airlines', emoji: '🦅', color: '#1D4ED8' },
  { code: 'MH', name: 'Malaysia Airlines', emoji: '🌙', color: '#DC2626' },
  { code: 'CX', name: 'Cathay Pacific', emoji: '🟢', color: '#065F46' },
  { code: 'EK', name: 'Emirates', emoji: '🏆', color: '#B45309' },
  { code: 'JL', name: 'Japan Airlines', emoji: '🎌', color: '#DC2626' },
  { code: 'NH', name: 'ANA', emoji: '🔵', color: '#1D4ED8' },
  { code: 'KE', name: 'Korean Air', emoji: '🔷', color: '#1E3A5F' },
];

const POPULAR_DESTINATIONS = [
  { code: 'HKT', city: 'ภูเก็ต', country: 'ไทย', emoji: '🏖️', price: 1290 },
  { code: 'CNX', city: 'เชียงใหม่', country: 'ไทย', emoji: '🏔️', price: 990 },
  { code: 'SIN', city: 'สิงคโปร์', country: 'สิงคโปร์', emoji: '🦁', price: 3490 },
  { code: 'NRT', city: 'โตเกียว', country: 'ญี่ปุ่น', emoji: '⛩️', price: 8990 },
  { code: 'HKG', city: 'ฮ่องกง', country: 'ฮ่องกง', emoji: '🌃', price: 5290 },
  { code: 'ICN', city: 'โซล', country: 'เกาหลีใต้', emoji: '🌸', price: 7490 },
  { code: 'DXB', city: 'ดูไบ', country: 'UAE', emoji: '🏙️', price: 12990 },
  { code: 'KBV', city: 'กระบี่', country: 'ไทย', emoji: '🌴', price: 1490 },
];

// =======================================
// Flight Generator
// =======================================

function generateFlights(from, to, date, passengers) {
  const count = Math.floor(Math.random() * 6) + 6;
  const flights = [];

  const routeAirlines = AIRLINES.slice(0, 8);
  const usedAirlines = routeAirlines.sort(() => Math.random() - 0.5).slice(0, count);

  const basePrices = {
    domestic: [990, 1290, 1590, 1890, 2190],
    international: [3990, 5490, 7990, 9990, 12990, 15990],
  };

  const isDomestic = ['BKK','DMK','HKT','CNX','KBV','USM','HAJ'].includes(from) &&
                     ['BKK','DMK','HKT','CNX','KBV','USM','HAJ'].includes(to);

  const priceList = isDomestic ? basePrices.domestic : basePrices.international;

  usedAirlines.forEach((airline, i) => {
    const departHour = 5 + Math.floor(Math.random() * 17);
    const departMin = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 11)];
    const durationMin = isDomestic
      ? 60 + Math.floor(Math.random() * 90)
      : 180 + Math.floor(Math.random() * 480);

    const arriveTime = new Date(2000, 0, 1, departHour, departMin + durationMin);
    const stops = isDomestic ? 0 : (Math.random() < 0.4 ? 0 : 1);

    const basePrice = priceList[Math.floor(Math.random() * priceList.length)];
    const jitter = Math.floor((Math.random() - 0.5) * 400);
    const price = Math.max(500, basePrice + jitter);

    flights.push({
      id: `FL${Date.now()}${i}`,
      airline,
      flightNo: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
      from,
      to,
      date,
      departTime: `${String(departHour).padStart(2,'0')}:${String(departMin).padStart(2,'0')}`,
      arriveTime: `${String(arriveTime.getHours()).padStart(2,'0')}:${String(arriveTime.getMinutes()).padStart(2,'0')}`,
      durationMin,
      stops,
      price,
      pricePerPax: price,
      available: Math.floor(Math.random() * 8) + 1,
      tags: generateTags(price, priceList, stops, i),
    });
  });

  return flights.sort((a, b) => a.price - b.price);
}

function generateTags(price, priceList, stops, idx) {
  const tags = [];
  if (price === Math.min(...priceList)) tags.push({ label: 'ราคาดีที่สุด', type: 'green' });
  if (stops === 0) tags.push({ label: 'ตรง', type: 'blue' });
  if (idx === 0) tags.push({ label: 'แนะนำ', type: 'orange' });
  return tags;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}ชม. ${m > 0 ? m + 'น.' : ''}`.trim();
}

function formatPrice(n) {
  return n.toLocaleString('th-TH');
}

// =======================================
// Shared Utility Functions
// =======================================

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function switchModal(closeId, openId) {
  closeModal(closeId);
  setTimeout(() => openModal(openId), 150);
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function handleLogin(e) {
  e.preventDefault();
  closeModal('loginModal');
  showToast('เข้าสู่ระบบสำเร็จ!');
}

function handleRegister(e) {
  e.preventDefault();
  closeModal('registerModal');
  showToast('สมัครสมาชิกสำเร็จ! ยินดีต้อนรับ');
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});
