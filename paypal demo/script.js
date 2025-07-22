
let currentStep = 0;
const steps = document.querySelectorAll('.step');
const bookingList = document.getElementById('bookingList');

function showStep(index) {
  steps.forEach((s, i) => s.classList.toggle('active', i === index));
}

function nextStep() {
  const inputs = steps[currentStep].querySelectorAll("input, select");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
  }
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

document.getElementById("themeSwitcher").onchange = (e) => {
  document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
};

paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: { value: '20.00' }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Оплата прошла успешно: ' + details.payer.name.given_name);

      const booking = {
        airport: document.getElementById('airport').value,
        date: document.getElementById('date').value,
        flight: document.getElementById('flight').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        people: document.getElementById('people').value,
        option: document.getElementById('option').value,
      };

      saveBooking(booking);
      updateCabinet();
    });
  }
}).render('#paypal-button-container');

function saveBooking(data) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(data);
  localStorage.setItem('bookings', JSON.stringify(bookings));
}

function updateCabinet() {
  bookingList.innerHTML = '';
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.forEach(b => {
    const li = document.createElement('li');
    li.textContent = `Бронь: ${b.option} в ${b.airport} на ${b.date}, пассажиров: ${b.people}`;
    bookingList.appendChild(li);
  });
}

updateCabinet();
showStep(currentStep);
