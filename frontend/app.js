const API_BASE_URL = '/api'; // Change this if your backend is hosted elsewhere.

async function loadGoogleMaps() {
  try {
    const res = await fetch(`${API_BASE_URL}/config`);
    const config = await res.json();
    if (config.googleMapsApiKey) {
      if (window.google && window.google.maps) return;
      
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;
        window.initGoogleMaps = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    }
  } catch (e) {
    console.error('Failed to load Google Maps config', e);
  }
}

function isLoggedIn() {
  return localStorage.getItem('userPassword') && localStorage.getItem('userName');
}

function setupLoginForm() {
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    
    if (name && password) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userPassword', password);
      if (loginModal) {
        loginModal.classList.add('hidden');
      }
    }
  });
}

async function fetchNearbyPlaces() {
  const context = document.getElementById('contextSelect').value;
  const budget = document.getElementById('budgetSelect').value;
  const distanceKm = document.getElementById('distanceSelect').value;
  const mood = document.getElementById('moodInput').value.trim();

  let coords;
  try {
    coords = await getCurrentPosition();
  } catch (e) {
    console.warn('Unable to get geolocation, falling back to Hyderabad center.', e);
    // Fallback to Hyderabad city center
    coords = { latitude: 17.3850, longitude: 78.4867 };
  }

  const params = new URLSearchParams();
  params.set('lat', coords.latitude);
  params.set('lng', coords.longitude);
  if (context) params.set('context', context);
  if (budget) params.set('budget', budget);
  if (distanceKm) params.set('distanceKm', distanceKm);
  if (mood) params.set('mood', mood);

  const res = await fetch(`${API_BASE_URL}/places/nearby?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to load nearby places');
  }
  const data = await res.json();
  return data.places || [];
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

function renderPlacesList(places) {
  const listView = document.getElementById('listView');
  listView.innerHTML = '';

  if (!places.length) {
    listView.innerHTML = '<p>No places found. Try adjusting your filters or mood.</p>';
    return;
  }

  for (const place of places) {
    const card = document.createElement('article');
    card.className = 'place-card';
    const mainImage = place.images && place.images.length > 0 ? place.images[0] : null;
    const imageHtml = mainImage 
      ? `<div class="place-image" style="background-image: url('${mainImage}')"></div>`
      : `<div class="place-image-placeholder"></div>`;

    card.innerHTML = `
      ${imageHtml}
      <div class="place-body">
        <div class="place-name">${place.name}</div>
        <div class="place-meta">
          <span>${place.type}</span>
          &nbsp;·&nbsp;
          <span>${place.rating?.toFixed ? place.rating.toFixed(1) : place.rating || 'N/A'} ★</span>
          &nbsp;·&nbsp;
          <span>${place.costRange || place.budget || ''}</span>
          &nbsp;·&nbsp;
          <span>${place.distanceKm ?? '?'} km away</span>
        </div>
        <div class="place-tags">
          ${(place.tags || [])
            .map((tag) => `<span class="badge">${tag}</span>`)
            .join('')}
          ${place.isOpen ? '<span class="badge badge-open">Open now</span>' : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      // Navigate to a dedicated place details page.
      window.location.href = `place.html?id=${encodeURIComponent(place.id)}`;
    });

    listView.appendChild(card);
  }
}

async function loadPlaceDetails(placeId) {
  const detailsEl = document.getElementById('placeDetails');
  if (!detailsEl) return;
  detailsEl.classList.remove('hidden');
  detailsEl.innerHTML = '<p>Loading details…</p>';

  try {
    // Ensure Google Maps is loaded before rendering details (since it contains the map)
    await loadGoogleMaps();

    const [placeRes, reviewsRes, notesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/places/${placeId}`),
      fetch(`${API_BASE_URL}/places/${placeId}/reviews`),
      fetch(`${API_BASE_URL}/places/${placeId}/notes`, {
        headers: {
          'x-user-id': getUserId()
        }
      })
    ]);

    if (!placeRes.ok) throw new Error('Failed to load place');
    if (!reviewsRes.ok) throw new Error('Failed to load reviews');
    if (!notesRes.ok) throw new Error('Failed to load notes');

    const { place } = await placeRes.json();
    const { reviews } = await reviewsRes.json();
    const { note } = await notesRes.json();

    renderPlaceDetails(detailsEl, place, reviews, note);
  } catch (e) {
    console.error(e);
    detailsEl.innerHTML = '<p>Unable to load details right now.</p>';
  }
}

function renderPlaceDetails(container, place, reviews, note) {
  container.innerHTML = '';

  // Header Section
  const header = document.createElement('div');
  header.className = 'place-header-centered';
  header.innerHTML = `
    <h1 class="place-title-new">${place.name}</h1>
    <div class="place-price-new">Average Price: ₹${place.budget_for_two || 1000}</div>
  `;

  // Gallery Section
  const gallery = document.createElement('div');
  gallery.className = 'image-gallery-container';
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  ];
  gallery.innerHTML = images.map(img => `<div class="gallery-image" style="background-image: url('${img}')"></div>`).join('');

  // View Menu Section
  const menuWrapper = document.createElement('div');
  menuWrapper.className = 'view-menu-wrapper';
  menuWrapper.innerHTML = `
    <button class="view-menu-button">
      <span>🍴</span> View Menu
    </button>
  `;

  // Private Notes Section
  const notesContainer = document.createElement('div');
  notesContainer.className = 'private-notes-container';
  notesContainer.innerHTML = '<h3>Your private notes</h3>';

  const textarea = document.createElement('textarea');
  textarea.className = 'notes-textarea-new';
  textarea.placeholder = 'Add your own memory, tip, or reminder about this place. Only you can see this.';
  textarea.value = note?.note || '';

  const saveButton = document.createElement('button');
  saveButton.className = 'primary-button';
  saveButton.style.width = 'auto';
  saveButton.style.padding = '0.75rem 2rem';
  saveButton.textContent = 'Save note';
  saveButton.addEventListener('click', async () => {
    await savePrivateNote(place.id, textarea.value);
  });

  notesContainer.appendChild(textarea);
  notesContainer.appendChild(saveButton);

  // Map Section (At the last)
  const mapSection = document.createElement('div');
  mapSection.style.position = 'relative';
  mapSection.style.marginTop = '2rem';
  
  const mapEl = document.createElement('div');
  mapEl.id = 'placeMap';
  mapEl.className = 'map-container-new';
  
  const locationBarWrapper = document.createElement('div');
  locationBarWrapper.className = 'location-bar-wrapper';
  locationBarWrapper.style.position = 'absolute';
  locationBarWrapper.style.bottom = '20px';
  locationBarWrapper.style.left = '0';
  locationBarWrapper.style.right = '0';
  locationBarWrapper.style.zIndex = '10';
  
  locationBarWrapper.innerHTML = `
    <div class="location-bar">
      <span class="location-bar-icon">📍</span>
      <span>${place.name} - Hyderabad</span>
    </div>
  `;

  mapSection.appendChild(mapEl);
  mapSection.appendChild(locationBarWrapper);

  container.appendChild(header);
  container.appendChild(gallery);
  container.appendChild(menuWrapper);
  container.appendChild(notesContainer);
  container.appendChild(mapSection);

  // Initialize the map if Google Maps is loaded
  if (typeof google !== 'undefined' && google.maps && place.location) {
    const map = new google.maps.Map(document.getElementById('placeMap'), {
      center: place.location,
      zoom: 15,
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1c1e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1c1e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#1c282a' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#2b2d30' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#0f172a' }],
        },
      ],
    });

    const marker = new google.maps.Marker({
      position: place.location,
      map: map,
      title: place.name,
    });

    // Add click listener to the map to open Google Maps in a new window
    map.addListener('click', () => {
      const { lat, lng } = place.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    });

    marker.addListener('click', () => {
      const { lat, lng } = place.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    });
  }
}

async function savePrivateNote(placeId, noteText) {
  if (!noteText.trim()) return;
  try {
    await fetch(`${API_BASE_URL}/places/${placeId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId()
      },
      body: JSON.stringify({ note: noteText })
    });
  } catch (e) {
    console.error('Failed to save note', e);
  }
}

function getUserId() {
  // For now, generate a simple persistent but anonymous ID per browser.
  const key = 'socialPlacesUserId';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `u_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function setupContextButtons() {
  const buttons = document.querySelectorAll('.context-card');
  const contextSelect = document.getElementById('contextSelect');
  if (!buttons.length || !contextSelect) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-context-option');
      if (!value) return;

      // Visually mark the active choice.
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      // Keep the hidden select in sync so fetchNearbyPlaces() continues to work.
      contextSelect.value = value;
    });
  });
}


function setupDiscoverButton() {
  const button = document.getElementById('discoverButton');
  const contextSelect = document.getElementById('contextSelect');
  const budgetSelect = document.getElementById('budgetSelect');
  const distanceSelect = document.getElementById('distanceSelect');
  const moodInput = document.getElementById('moodInput');

  if (!button) return;

  button.addEventListener('click', () => {
    const params = new URLSearchParams();

    if (contextSelect?.value) params.set('context', contextSelect.value);
    if (budgetSelect?.value) params.set('budget', budgetSelect.value);
    if (distanceSelect?.value) params.set('distanceKm', distanceSelect.value);
    if (moodInput?.value.trim()) params.set('mood', moodInput.value.trim());

    // Navigate to the results page with filters in the query string.
    window.location.href = `results.html?${params.toString()}`;
  });
}

function init() {
  loadGoogleMaps();
  // Check login status and show/hide login modal
  const loginModal = document.getElementById('loginModal');
  if (isLoggedIn()) {
    if (loginModal) {
      loginModal.classList.add('hidden');
    }
  } else {
    setupLoginForm();
    if (loginModal) {
      loginModal.classList.remove('hidden');
    }
  }
  
  setupContextButtons();
  const isResultsPage = window.location.pathname.endsWith('results.html');
  const isPlacePage = window.location.pathname.endsWith('place.html');

  if (isPlacePage) {
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('id');
    if (placeId) {
      loadPlaceDetails(placeId);
    }
  } else if (isResultsPage) {
    // On the results page, read filters from the URL and auto-load places.
    const params = new URLSearchParams(window.location.search);
    const context = params.get('context');
    const budget = params.get('budget');
    const distanceKm = params.get('distanceKm');
    const mood = params.get('mood');

    const contextSelect = document.getElementById('contextSelect');
    const budgetSelect = document.getElementById('budgetSelect');
    const distanceSelect = document.getElementById('distanceSelect');
    const moodInput = document.getElementById('moodInput');

    if (context && contextSelect) contextSelect.value = context;
    if (budget && budgetSelect) budgetSelect.value = budget;
    if (distanceKm && distanceSelect) distanceSelect.value = distanceKm;
    if (mood && moodInput) moodInput.value = mood;

    fetchNearbyPlaces()
      .then((places) => {
        renderPlacesList(places);
      })
      .catch((e) => {
        console.error(e);
        alert('Something went wrong while fetching places.');
      });
  } else {
    // On the main page, clicking the button sends you to the results page.
    setupDiscoverButton();
  }
}

window.addEventListener('DOMContentLoaded', init);
