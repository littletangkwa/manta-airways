// =======================================
// My Bookings Page Logic
// =======================================

let currentTab = 'upcoming';

document.addEventListener('DOMContentLoaded', () => {
  showBookings('upcoming', document.querySelector('.trip-tab'));
});

function showBookings(status, btn) {
  currentTab = status;
  document.querySelectorAll('.trip-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const bookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
  const filtered = bookings.filter(b => b.status === status);

  const container = document.getElementById('bookingsList');
  container.innerHTML = '';

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-bookings">
        <div class="icon">🎫</div>
        <h3>ยังไม่มีการจอง</h3>
        <p style="margin-bottom:24px;">คุณยังไม่มีการจองในหมวด${statusLabel(status)}นี้</p>
        <a href="index.html" class="btn btn-primary">ค้นหาเที่ยวบิน</a>
      </div>
    `;
    return;
  }

  filtered.forEach(booking => {
    container.appendChild(createTicketCard(booking));
  });
}

function statusLabel(status) {
  return { upcoming: 'ที่จะมาถึง', completed: 'เสร็จสิ้น', cancelled: 'ยกเลิกแล้ว' }[status] || '';
}

function createTicketCard(booking) {
  const { ref, flight, params, totalPrice, status, bookedAt } = booking;
  const fromAirport = AIRPORTS.find(a => a.code === flight.from) || { name: flight.from, emoji: '' };
  const toAirport = AIRPORTS.find(a => a.code === flight.to) || { name: flight.to, emoji: '' };

  const statusLabels = {
    upcoming: '<span class="ticket-status status-upcoming">ที่จะมาถึง</span>',
    completed: '<span class="ticket-status status-completed">เสร็จสิ้น</span>',
    cancelled: '<span class="ticket-status status-cancelled">ยกเลิกแล้ว</span>',
  };

  const bookedDate = new Date(bookedAt).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const el = document.createElement('div');
  el.className = 'booking-ticket';
  el.innerHTML = `
    <div class="ticket-header">
      <div>
        <div class="ticket-ref">หมายเลขการจอง: ${ref}</div>
        <div class="ticket-airline">${flight.airline.emoji} ${flight.airline.name} · ${flight.flightNo}</div>
      </div>
      ${statusLabels[status] || ''}
    </div>
    <div class="ticket-body">
      <div class="ticket-route">
        <div class="ticket-city">
          <div class="code">${flight.from}</div>
          <div class="name">${fromAirport.name}</div>
        </div>
        <div class="ticket-divider">
          <div class="plane">✈️</div>
          <div class="date">${formatDateThai(flight.date)}</div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">${formatDuration(flight.durationMin)}</div>
        </div>
        <div class="ticket-city" style="text-align:right;">
          <div class="code">${flight.to}</div>
          <div class="name">${toAirport.name}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.3rem; font-weight:700; color:var(--primary);">฿${formatPrice(totalPrice)}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">ยอดรวมทั้งหมด</div>
      </div>
    </div>
    <div class="ticket-footer">
      <div class="ticket-info-item">
        <strong>${flight.departTime} - ${flight.arriveTime}</strong>
        เวลาเดินทาง
      </div>
      <div class="ticket-info-item">
        <strong>${(params.adults || 1) + (params.children || 0) + (params.infants || 0)} คน</strong>
        ผู้โดยสาร
      </div>
      <div class="ticket-info-item">
        <strong>${bookedDate}</strong>
        วันที่จอง
      </div>
      ${status === 'upcoming' ? `
        <button class="btn btn-outline btn-sm" onclick="cancelBooking('${ref}')">ยกเลิกการจอง</button>
      ` : ''}
    </div>
  `;

  return el;
}

function cancelBooking(ref) {
  if (!confirm('คุณต้องการยกเลิกการจองนี้หรือไม่?')) return;

  const bookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
  const idx = bookings.findIndex(b => b.ref === ref);
  if (idx !== -1) {
    bookings[idx].status = 'cancelled';
    localStorage.setItem('myBookings', JSON.stringify(bookings));
    showToast('ยกเลิกการจองเรียบร้อยแล้ว');
    showBookings(currentTab, null);
  }
}

function formatDateThai(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
