

// Closet Organizer App Logic


const CLOSET_KEY = 'closet_items';
const defaultIcons = [
  { type: 'top', icon: '👚' },
  { type: 'bottom', icon: '👖' },
  { type: 'shoe', icon: '👟' }
];


function getCloset() {
  return JSON.parse(localStorage.getItem(CLOSET_KEY) || '[]');
}


function saveCloset(items) {
  localStorage.setItem(CLOSET_KEY, JSON.stringify(items));
}


function renderCloset() {
  const closet = getCloset();
  const grid = document.getElementById('closet-grid');
 
  if (!grid) {
    console.error('Closet grid element not found');
    return;
  }
 
  grid.innerHTML = '';
 
  if (closet.length === 0) {
    grid.innerHTML = '<div class="empty-state">No items yet. Add your first piece!</div>';
    const suggestionEl = document.getElementById('suggestion');
    if (suggestionEl) suggestionEl.textContent = '';
    return;
  }
 
  closet.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-img">${item.icon ? item.icon : '<img src="' + item.img + '" alt="clothing"/>'}</div>
      <div class="item-tags">
        <span class="tag">${item.type}</span>
        <span class="tag">${item.color}</span>
        <span class="tag">${item.vibe}</span>
      </div>
      <button class="remove-btn" title="Remove" data-idx="${idx}">✖</button>
    `;
    grid.appendChild(card);
  });
 
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = +e.target.getAttribute('data-idx');
      const closet = getCloset();
      closet.splice(idx, 1);
      saveCloset(closet);
      renderCloset();
      suggestCombo();
    };
  });
  suggestCombo();
}


function updateIconOptions() {
  const typeSelect = document.getElementById('type');
  const iconSelect = document.getElementById('icon');
 
  if (!typeSelect || !iconSelect) return;
 
  const selectedType = typeSelect.value;
  iconSelect.innerHTML = '<option value="">Choose an icon...</option>';
 
  const relevantIcons = defaultIcons.filter(icon => icon.type === selectedType);
  relevantIcons.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.icon;
    o.textContent = `${opt.icon} (${opt.type})`;
    iconSelect.appendChild(o);
  });
}


function handleAddItem(e) {
  e.preventDefault();
 
  const type = document.getElementById('type').value;
  const color = document.getElementById('color').value.trim();
  const vibe = document.getElementById('vibe').value.trim();
  const icon = document.getElementById('icon').value;
  const imgInput = document.getElementById('img');
 
  if (!type || !color || !vibe) {
    alert('Please fill in all required fields');
    return;
  }
 
  let img = '';
 
  if (imgInput.files && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      img = ev.target.result;
      addItem({ type, color, vibe, icon: '', img });
    };
    reader.readAsDataURL(imgInput.files[0]);
    return;
  }
 
  if (!icon) {
    alert('Please select an icon or upload an image');
    return;
  }
 
  addItem({ type, color, vibe, icon, img: '' });
}


function addItem(item) {
  const closet = getCloset();
  closet.push(item);
  saveCloset(closet);
  renderCloset();
  document.getElementById('add-form').reset();
  updateIconOptions(); // Reset icon options after form reset
}


function suggestCombo() {
  const closet = getCloset();
  const tops = closet.filter(i => i.type === 'top');
  const bottoms = closet.filter(i => i.type === 'bottom');
  const shoes = closet.filter(i => i.type === 'shoe');
  let suggestion = '';
 
  if (tops.length && bottoms.length) {
    const top = tops[Math.floor(Math.random() * tops.length)];
    const bottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    suggestion = `Try pairing your <b>${top.color} ${top.vibe} ${top.type}</b> with your <b>${bottom.color} ${bottom.vibe} ${bottom.type}</b>.`;
   
    if (shoes.length) {
      const shoe = shoes[Math.floor(Math.random() * shoes.length)];
      suggestion += ` Complete the look with <b>${shoe.color} ${shoe.vibe} shoes</b>!`;
    }
  }
 
  const suggestionEl = document.getElementById('suggestion');
  if (suggestionEl) {
    suggestionEl.innerHTML = suggestion;
  }
}


// Swipe Mode Logic
let swipeIndex = 0;


function showSwipeCard() {
  const closet = getCloset();
  const cardContainer = document.getElementById('swipe-card-container');
  const endMsg = document.getElementById('swipe-end-message');
  if (!closet.length) {
    cardContainer.innerHTML = '';
    endMsg.style.display = 'block';
    return;
  }
  if (swipeIndex >= closet.length) {
    cardContainer.innerHTML = '';
    endMsg.style.display = 'block';
    return;
  }
  endMsg.style.display = 'none';
  const item = closet[swipeIndex];
  cardContainer.innerHTML = `
    <div class="item-card" style="margin:0 auto;max-width:320px;">
      <div class="item-img">${item.icon ? item.icon : '<img src="' + item.img + '" alt="clothing"/>'}</div>
      <div class="item-tags">
        <span class="tag">${item.type}</span>
        <span class="tag">${item.color}</span>
        <span class="tag">${item.vibe}</span>
      </div>
    </div>
  `;
}


function enterSwipeMode() {
  document.getElementById('closet-grid').style.display = 'none';
  document.getElementById('suggestion').style.display = 'none';
  document.getElementById('swipe-mode-btn').style.display = 'none';
  document.getElementById('swipe-section').style.display = 'block';
  swipeIndex = 0;
  showSwipeCard();
}


function exitSwipeMode() {
  document.getElementById('closet-grid').style.display = '';
  document.getElementById('suggestion').style.display = '';
  document.getElementById('swipe-mode-btn').style.display = 'block';
  document.getElementById('swipe-section').style.display = 'none';
}


function swipeLeft() {
  const closet = getCloset();
  if (swipeIndex > 0) {
    swipeIndex--;
    showSwipeCard();
    console.log('Swiped left to index', swipeIndex);
  } else {
    console.log('Already at first item');
  }
}


function swipeRight() {
  const closet = getCloset();
  if (swipeIndex < closet.length - 1) {
    swipeIndex++;
    showSwipeCard();
    console.log('Swiped right to index', swipeIndex);
  } else {
    swipeIndex = closet.length;
    showSwipeCard();
    console.log('Reached end of items');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log('Closet Organizer loaded');
 
  // Set up type change listener
  const typeSelect = document.getElementById('type');
  if (typeSelect) {
    typeSelect.addEventListener('change', updateIconOptions);
  }
 
  // Initialize icon options
  updateIconOptions();
 
  // Set up form submission
  const form = document.getElementById('add-form');
  if (form) {
    form.onsubmit = handleAddItem;
  }
 
  // Initial render
  renderCloset();
 
  // Swipe mode event listeners
  document.getElementById('swipe-mode-btn').onclick = enterSwipeMode;
  document.getElementById('exit-swipe').onclick = exitSwipeMode;
  document.getElementById('swipe-left').onclick = swipeLeft;
  document.getElementById('swipe-right').onclick = swipeRight;
});

