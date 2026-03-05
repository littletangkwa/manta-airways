// =======================================
// Results Page Logic
// =======================================

let allFlights = [];
let filteredFlights = [];
let currentSort = 'price';
let timeFilter = 'all';

const params = new URLSearchParams(window.location.search);
const fromCode = params.get('from') || 'BKK';
const toCode = params.get('to') || 'HKT';
const date = params.get('date') || new Date().toISOString().split('T')[0];
const adults = parseInt(params.get('adults') || 1);
const children = parseInt(params.get('children') || 0);
const infants = parseInt(params.get('infants') || 0);
const cabin = params.get('cabin') || 'economy';
const totalPax = adults + children + infants;

document.addEventListener('DOMContentLoaded', () => {
  populateSummary();
  loadFlights();
  buildAirlineFilters();
});

function populateSummary() {
  const fromAirport = AIRPORTS.find(a => a.code === fromCode) || { name: fromCode, emoji: '✈️' };
  const toAirport = AIRPORTS.find(a => a.code === toCode) || { name: toCode, emoji: '✈️' };

  document.getElementById('summaryFrom').textContent = `${fromAirport.emoji} ${fromCode}`;
  document.getElementById('summaryTo').textContent = `${toAirport.emoji} ${toCode}`;
  document.getElementById('summaryDate').textContent = formatDateThai(date);
  document.getElementById('summaryPax').textContent = `${totalPax} ผู้โดยสาร`;

  const cabinMap = {
    'economy': 'Economy',
    'premium-economy': 'Premium Economy',
    'business': 'Business',
    'first': 'First Class',
  };
  document.getElementById('summaryCabin').textContent = cabinMap[cabin] || cabin;
}

function formatDateThai(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('th-TH', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
}

function loadFlights() {
  document.getElementById('resultsCount').textContent = 'กำลังค้นหาเที่ยวบิน...';

  setTimeout(() => {
    allFlights = generateFlights(fromCode, toCode, date, totalPax);
    filteredFlights = [...allFlights];
    renderFlights();
    updatePriceRangeMax();
  }, 600);
}

function updatePriceRangeMax() {
  if (!allFlights.length) return;
  const maxPrice = Math.max(...allFlights.map(f => f.price));
  const priceRange = document.getElementById('priceRange');
  priceRange.max = maxPrice;
  priceRange.value = maxPrice;
  document.getElementById('priceRangeLabel').textContent = formatPrice(maxPrice);
}

function buildAirlineFilters() {
  setTimeout(() => {
    const container = document.getElementById('airlineFilters');
    if (!container || !allFlights.length) return;
    const used = [...new Set(allFlights.map(f => f.airline.code))];
    container.innerHTML = '';
    used.forEach(code => {
      const airline = AIRLINES.find(a => a.code === code);
      if (!airline) return;
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      label.innerHTML = `
        <input type="checkbox" value="${code}" checked onchange="filterFlights()" />
        ${airline.emoji} ${airline.name}
      `;
      container.appendChild(label);
    });
  }, 700);
}

function filterFlights() {
  const maxPrice = parseInt(document.getElementById('priceRange').value);
  document.getElementById('priceRangeLabel').textContent = formatPrice(maxPrice);

  const selectedAirlines = [...document.querySelectorAll('#airlineFilters input:checked')].map(i => i.value);
  const selectedStops = [...document.querySelectorAll('#stopsFilters input:checked')].map(i => parseInt(i.value));

  filteredFlights = allFlights.filter(f => {
    if (f.price > maxPrice) return false;
    if (!selectedAirlines.includes(f.airline.code)) return false;
    const stopBucket = f.stops >= 2 ? 2 : f.stops;
    if (!selectedStops.includes(stopBucket)) return false;
    if (timeFilter !== 'all') {
      const hour = parseInt(f.departTime.split(':')[0]);
      if (timeFilter === 'morning' && hour >= 12) return false;
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (timeFilter === 'evening' && hour < 18) return false;
    }
    return true;
  });

  sortFlightsArray();
  renderFlights();
}

function clearFilters() {
  document.getElementById('priceRange').value = document.getElementById('priceRange').max;
  document.getElementById('priceRangeLabel').textContent = formatPrice(parseInt(document.getElementById('priceRange').max));
  document.querySelectorAll('#airlineFilters input').forEach(i => i.checked = true);
  document.querySelectorAll('#stopsFilters input').forEach(i => i.checked = true);
  setTimeFilter('all', document.querySelector('.time-filter[data-time="all"]'));
}

function setTimeFilter(type, btn) {
  timeFilter = type;
  document.querySelectorAll('.time-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterFlights();
}

function sortFlights(by, btn) {
  currentSort = by;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  sortFlightsArray();
  renderFlights();
}

function sortFlightsArray() {
  filteredFlights.sort((a, b) => {
    if (currentSort === 'price') return a.price - b.price;
    if (currentSort === 'duration') return a.durationMin - b.durationMin;
    if (currentSort === 'depart') return a.departTime.localeCompare(b.departTime);
    if (currentSort === 'arrive') return a.arriveTime.localeCompare(b.arriveTime);
    return 0;
  });
}

function renderFlights() {
  const list = document.getElementById('flightList');
  const noResults = document.getElementById('noResults');
  const count = document.getElementById('resultsCount');

  list.innerHTML = '';

  if (!filteredFlights.length) {
    noResults.style.display = '';
    count.textContent = 'ไม่พบเที่ยวบิน';
    return;
  }

  noResults.style.display = 'none';
  count.textContent = `พบ ${filteredFlights.length} เที่ยวบิน`;

  filteredFlights.forEach(flight => {
    const card = createFlightCard(flight);
    list.appendChild(card);
  });
}

function createFlightCard(flight) {
  const card = document.createElement('div');
  card.className = 'flight-card';

  const stopsLabel = flight.stops === 0
    ? '<span class="route-stops direct">ตรง</span>'
    : `<span class="route-stops">${flight.stops} จุดแวะ</span>`;

  const tagsHtml = flight.tags.map(t =>
    `<span class="tag tag-${t.type}">${t.label}</span>`
  ).join('');

  const fromAirport = AIRPORTS.find(a => a.code === flight.from) || { name: flight.from };
  const toAirport = AIRPORTS.find(a => a.code === flight.to) || { name: flight.to };

  card.innerHTML = `
    <div class="flight-card-inner">
      <div class="airline-info">
        <div class="airline-logo-circle">${flight.airline.emoji}</div>
        <div>
          <div class="airline-name">${flight.airline.name}</div>
          <div class="airline-flight-no">${flight.flightNo}</div>
        </div>
      </div>

      <div class="flight-route">
        <div class="route-time">
          <div class="time">${flight.departTime}</div>
          <div class="code">${flight.from}</div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">${fromAirport.name}</div>
        </div>
        <div class="route-line">
          <div class="route-line-bar"></div>
          <div class="route-duration">${formatDuration(flight.durationMin)}</div>
          ${stopsLabel}
        </div>
        <div class="route-time">
          <div class="time">${flight.arriveTime}</div>
          <div class="code">${flight.to}</div>
          <div style="font-size:0.78rem; color:var(--text-secondary);">${toAirport.name}</div>
        </div>
      </div>

      <div class="flight-price">
        <div class="price-per-pax">ราคาต่อคน</div>
        <div class="price-amount">฿${formatPrice(flight.price)}</div>
        <div class="price-total-note">รวม ${totalPax} คน: ฿${formatPrice(flight.price * totalPax)}</div>
        <button class="btn btn-primary btn-select-flight btn-sm"
          onclick="selectFlight('${flight.id}')">เลือก</button>
        <div style="font-size:0.78rem; color:var(--warning); margin-top:4px; text-align:center;">
          เหลือ ${flight.available} ที่นั่ง
        </div>
      </div>
    </div>
    ${tagsHtml ? `<div class="flight-tags">${tagsHtml}</div>` : ''}
  `;

  return card;
}

function selectFlight(flightId) {
  const flight = allFlights.find(f => f.id === flightId);
  if (!flight) return;
  sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
  sessionStorage.setItem('searchParams', JSON.stringify({
    from: fromCode, to: toCode, date, adults, children, infants, cabin,
  }));
  window.location.href = 'booking.html';
}
