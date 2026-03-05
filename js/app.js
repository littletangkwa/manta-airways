// =======================================
// Homepage App Logic
// =======================================

let passengers = { adult: 1, child: 0, infant: 0 };
let tripType = 'one-way';

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  setupAirportAutocomplete();
  setupDateDefaults();
  renderDestinations();
  renderAirlines();
});

// ---- Airport Autocomplete ----
function setupAirportAutocomplete() {
  const fromList = document.getElementById('airports-from');
  const toList = document.getElementById('airports-to');

  AIRPORTS.forEach(a => {
    const label = `${a.emoji} ${a.name} (${a.code}) - ${a.airport}`;
    [fromList, toList].forEach(list => {
      const opt = document.createElement('option');
      opt.value = label;
      opt.dataset.code = a.code;
      list.appendChild(opt);
    });
  });
}

function setupDateDefaults() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('departDate').value = fmt(tomorrow);
  document.getElementById('departDate').min = fmt(today);

  const weekLater = new Date(tomorrow);
  weekLater.setDate(weekLater.getDate() + 7);
  document.getElementById('returnDate').value = fmt(weekLater);
  document.getElementById('returnDate').min = fmt(tomorrow);
}

// ---- Trip Type ----
function setTripType(type) {
  tripType = type;
  document.querySelectorAll('.trip-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.type === type);
  });
  document.getElementById('returnDateGroup').style.display =
    type === 'round-trip' ? '' : 'none';
}

// ---- Swap Cities ----
function swapCities() {
  const from = document.getElementById('fromCity');
  const to = document.getElementById('toCity');
  [from.value, to.value] = [to.value, from.value];
}

// ---- Passenger Dropdown ----
function togglePassengerDropdown() {
  document.getElementById('passengerDropdown').classList.toggle('show');
}

document.addEventListener('click', e => {
  const selector = document.querySelector('.passenger-selector');
  if (selector && !selector.contains(e.target)) {
    document.getElementById('passengerDropdown')?.classList.remove('show');
  }
});

function updatePassenger(type, delta) {
  const key = type === 'adult' ? 'adult' : type === 'child' ? 'child' : 'infant';
  passengers[key] = Math.max(type === 'adult' ? 1 : 0, (passengers[key] || 0) + delta);
  if (type === 'adult') passengers.adult = Math.min(passengers.adult, 9);
  document.getElementById(`${type}Count`).textContent = passengers[key];
}

function confirmPassengers() {
  const cabin = document.getElementById('cabinClass').value;
  const cabinLabels = {
    'economy': 'Economy',
    'premium-economy': 'Premium Economy',
    'business': 'Business',
    'first': 'First Class',
  };
  const total = passengers.adult + passengers.child + passengers.infant;
  let label = `${passengers.adult} ผู้ใหญ่`;
  if (passengers.child) label += `, ${passengers.child} เด็ก`;
  if (passengers.infant) label += `, ${passengers.infant} ทารก`;
  label += ` · ${cabinLabels[cabin]}`;
  document.getElementById('passengerDisplay').value = label;
  document.getElementById('passengerDropdown').classList.remove('show');
}

// ---- Search ----
function searchFlights(e) {
  e.preventDefault();

  const fromVal = document.getElementById('fromCity').value;
  const toVal = document.getElementById('toCity').value;
  const departDate = document.getElementById('departDate').value;
  const returnDate = document.getElementById('returnDate').value;
  const cabin = document.getElementById('cabinClass').value;

  if (!fromVal || !toVal) {
    showToast('กรุณากรอกเมืองต้นทางและปลายทาง');
    return;
  }

  // Extract airport code from input
  const fromCode = extractCode(fromVal) || fromVal.toUpperCase().slice(0, 3);
  const toCode = extractCode(toVal) || toVal.toUpperCase().slice(0, 3);

  if (fromCode === toCode) {
    showToast('เมืองต้นทางและปลายทางต้องไม่เหมือนกัน');
    return;
  }

  const paxTotal = passengers.adult + passengers.child + passengers.infant;
  const params = new URLSearchParams({
    from: fromCode,
    to: toCode,
    date: departDate,
    returnDate: tripType === 'round-trip' ? returnDate : '',
    adults: passengers.adult,
    children: passengers.child,
    infants: passengers.infant,
    cabin,
    tripType,
  });

  window.location.href = `results.html?${params.toString()}`;
}

function extractCode(val) {
  const match = val.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : null;
}

// ---- Destinations ----
function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;

  POPULAR_DESTINATIONS.forEach(dest => {
    const card = document.createElement('div');
    card.className = 'dest-card';
    card.innerHTML = `
      <div class="dest-img">${dest.emoji}</div>
      <div class="dest-info">
        <div class="dest-city">${dest.city}</div>
        <div class="dest-country">${dest.country}</div>
        <div class="dest-price">฿${formatPrice(dest.price)} <span>/ คน เริ่มต้น</span></div>
      </div>
    `;
    card.addEventListener('click', () => {
      const to = AIRPORTS.find(a => a.code === dest.code);
      if (to) {
        document.getElementById('toCity').value = `${to.emoji} ${to.name} (${to.code}) - ${to.airport}`;
        document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
    grid.appendChild(card);
  });
}

// ---- Airlines ----
function renderAirlines() {
  const logos = document.getElementById('airlinesLogos');
  if (!logos) return;

  AIRLINES.forEach(a => {
    const el = document.createElement('div');
    el.className = 'airline-logo-card';
    el.innerHTML = `<span style="font-size:1.4rem;">${a.emoji}</span> ${a.name}`;
    logos.appendChild(el);
  });
}
