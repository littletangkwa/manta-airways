// =======================================
// Booking Page Logic
// =======================================

let selectedFlight = null;
let searchParams = null;
let totalPrice = 0;

const ADDON_PRICES = {
  'addon-baggage': 800,
  'addon-meal': 350,
  'addon-seat': 250,
  'addon-insurance': 199,
};

document.addEventListener('DOMContentLoaded', () => {
  selectedFlight = JSON.parse(sessionStorage.getItem('selectedFlight') || 'null');
  searchParams = JSON.parse(sessionStorage.getItem('searchParams') || 'null');

  if (!selectedFlight || !searchParams) {
    document.getElementById('selectedFlightSummary').innerHTML = `
      <p style="color:var(--text-secondary);">ไม่พบข้อมูลเที่ยวบิน <a href="index.html">กลับหน้าหลัก</a></p>
    `;
    return;
  }

  renderFlightSummary();
  renderPassengerForms();
  updatePrice();
});

function renderFlightSummary() {
  const f = selectedFlight;
  const fromAirport = AIRPORTS.find(a => a.code === f.from) || { name: f.from, emoji: '' };
  const toAirport = AIRPORTS.find(a => a.code === f.to) || { name: f.to, emoji: '' };

  document.getElementById('selectedFlightSummary').innerHTML = `
    <div class="selected-flight-summary">
      <div style="font-size:2rem;">${f.airline.emoji}</div>
      <div style="flex:1;">
        <div style="font-weight:700;">${f.airline.name} · ${f.flightNo}</div>
        <div style="color:var(--text-secondary); font-size:0.88rem;">
          ${fromAirport.emoji} ${f.from} ${f.departTime} → ${toAirport.emoji} ${f.to} ${f.arriveTime} · ${formatDuration(f.durationMin)}
        </div>
        <div style="font-size:0.85rem; margin-top:4px; color:var(--text-secondary);">
          ${formatDateThai(f.date)} · ${f.stops === 0 ? 'ตรง' : f.stops + ' จุดแวะ'}
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.3rem; font-weight:700; color:var(--primary);">฿${formatPrice(f.price)}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">/ คน</div>
      </div>
    </div>
  `;
}

function renderPassengerForms() {
  const { adults, children, infants } = searchParams;
  const container = document.getElementById('passengerForms');
  container.innerHTML = '';

  const addForm = (type, index, label) => {
    const block = document.createElement('div');
    block.className = 'passenger-form-block';
    block.innerHTML = `
      <h4>${label} ${index}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>คำนำหน้าชื่อ</label>
          <select>
            <option>นาย</option>
            <option>นาง</option>
            <option>นางสาว</option>
            <option>เด็กชาย</option>
            <option>เด็กหญิง</option>
          </select>
        </div>
        <div class="form-group">
          <label>ชื่อ (ภาษาอังกฤษ)</label>
          <input type="text" placeholder="First Name" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>นามสกุล (ภาษาอังกฤษ)</label>
          <input type="text" placeholder="Last Name" required />
        </div>
        <div class="form-group">
          <label>วันเดือนปีเกิด</label>
          <input type="date" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>เลขที่หนังสือเดินทาง / บัตรประชาชน</label>
          <input type="text" placeholder="เลขที่เอกสาร" required />
        </div>
        <div class="form-group">
          <label>สัญชาติ</label>
          <select>
            <option>ไทย</option>
            <option>American</option>
            <option>Japanese</option>
            <option>Korean</option>
            <option>Chinese</option>
            <option>British</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(block);
  };

  for (let i = 1; i <= adults; i++) addForm('adult', i, 'ผู้ใหญ่');
  for (let i = 1; i <= children; i++) addForm('child', i, 'เด็ก');
  for (let i = 1; i <= infants; i++) addForm('infant', i, 'ทารก');
}

function updatePrice() {
  if (!selectedFlight || !searchParams) return;

  const { adults, children, infants } = searchParams;
  const paxTotal = adults + children + infants;
  const basePrice = selectedFlight.price * paxTotal;

  let addonsTotal = 0;
  const addonItems = [];

  Object.entries(ADDON_PRICES).forEach(([id, unitPrice]) => {
    const checked = document.getElementById(id)?.checked;
    if (checked) {
      const cost = unitPrice * paxTotal;
      addonsTotal += cost;
      const names = {
        'addon-baggage': 'สัมภาระเพิ่มเติม',
        'addon-meal': 'อาหารบนเครื่อง',
        'addon-seat': 'เลือกที่นั่ง',
        'addon-insurance': 'ประกันการเดินทาง',
      };
      addonItems.push({ name: names[id], price: cost });
    }
  });

  const tax = Math.round(basePrice * 0.07);
  totalPrice = basePrice + addonsTotal + tax;

  const summaryEl = document.getElementById('priceSummaryItems');
  summaryEl.innerHTML = `
    <div class="price-item">
      <span class="label">ราคาตั๋ว (${paxTotal} คน)</span>
      <span>฿${formatPrice(basePrice)}</span>
    </div>
    ${addonItems.map(a => `
      <div class="price-item">
        <span class="label">${a.name}</span>
        <span>฿${formatPrice(a.price)}</span>
      </div>
    `).join('')}
    <div class="price-item">
      <span class="label">ภาษีและค่าธรรมเนียม</span>
      <span>฿${formatPrice(tax)}</span>
    </div>
  `;

  document.getElementById('totalPrice').textContent = `฿${formatPrice(totalPrice)}`;
}

function proceedToPayment() {
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;

  if (!email || !phone) {
    showToast('กรุณากรอกข้อมูลติดต่อให้ครบถ้วน');
    return;
  }

  document.getElementById('paymentTotalAmount').textContent = `฿${formatPrice(totalPrice)}`;
  document.getElementById('qrAmount').textContent = `฿${formatPrice(totalPrice)}`;
  openModal('paymentModal');
}

function selectPayment(type, btn) {
  document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('cardPaymentForm').style.display = type === 'card' ? '' : 'none';
  document.getElementById('promptpayForm').style.display = type === 'promptpay' ? '' : 'none';
  document.getElementById('bankTransferForm').style.display = type === 'bank' ? '' : 'none';
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
  input.value = val;
}

function confirmPayment() {
  closeModal('paymentModal');

  const ref = 'SKY' + Date.now().toString().slice(-8).toUpperCase();
  document.getElementById('bookingRef').textContent = ref;

  // Save to booking history
  const bookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
  bookings.unshift({
    ref,
    flight: selectedFlight,
    params: searchParams,
    totalPrice,
    status: 'upcoming',
    bookedAt: new Date().toISOString(),
  });
  localStorage.setItem('myBookings', JSON.stringify(bookings));

  openModal('confirmModal');
}

function formatDateThai(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}
