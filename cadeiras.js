/* ====== Configuração ====== */
const rows = ['A','B','C','D']; // 4 linhas
const cols = 5;                 // 5 colunas => 20 cadeiras
const pricePerTicket = 15.00;

/* pre-reservados de exemplo (strings como 'A3') */
const reservedSeats = ['A3','B5','C2']; // pode ajustar

/* Combos: id, nome, descrição curta, preço (R$) */
const combos = [
  { id: 'c1', name: 'Combo Pequeno', desc: 'Pipoca pequena + refrigerante (300ml)', price: 12.00, emoji: '🥤' },
  { id: 'c2', name: 'Combo Médio',   desc: 'Pipoca média + refrigerante (500ml)', price: 18.00, emoji: '🍿' },
  { id: 'c3', name: 'Combo Família', desc: 'Pipoca grande + 2 refrigerantes', price: 32.00, emoji: '🍿🍿' },
];

/* ====== Estado ====== */
const selectedSeats = new Set();
const comboSelections = {}; // id -> quantidade

/* ====== DOM ====== */
const seatingGrid = document.getElementById('seatingGrid');
const selectedList = document.getElementById('selectedList');
const totalPriceEl = document.getElementById('totalPrice');

const proceedToCombosBtn = document.getElementById('proceedToCombos');
const clearSeatsBtn = document.getElementById('clearSeats');

const seatView = document.getElementById('seatView');
const comboView = document.getElementById('comboView');

const combosGrid = document.getElementById('combosGrid');
const backToSeatsBtn = document.getElementById('backToSeats');
const toPaymentFromCombosBtn = document.getElementById('toPaymentFromCombos');

const stepSeats = document.getElementById('stepSeats');
const stepCombos = document.getElementById('stepCombos');
const stepPay = document.getElementById('stepPay');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalGoto = document.getElementById('modalGoto');

/* ====== Construir grid (com labels) ====== */
function buildSeating() {
  // limpar
  seatingGrid.innerHTML = '';
  // definimos grid-template dinamicamente (cols+1 para labels)
seatingGrid.style.gridTemplateColumns = `repeat(${cols + 1}, auto)`;

  // para cada row:
  rows.forEach(row => {
    for (let c = 0; c <= cols; c++) {
      if (c === 0) {
        // label da linha
        const lbl = document.createElement('div');
        lbl.className = 'row-label';
        lbl.setAttribute('role','gridcell');
        lbl.innerText = row;
        seatingGrid.appendChild(lbl);
      } else {
        const seatId = row + c;
        const btn = document.createElement('button');
        btn.className = 'seat';
        btn.type = 'button';
        btn.setAttribute('data-seat', seatId);
        btn.setAttribute('aria-pressed','false');
        btn.setAttribute('role','gridcell');
        btn.title = 'Assento ' + seatId;
        btn.innerText = c;

        if (reservedSeats.includes(seatId)) {
          btn.classList.add('reserved');
          btn.setAttribute('aria-disabled','true');
        } else {
          btn.addEventListener('click', () => toggleSeat(seatId, btn));
          btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSeat(seatId, btn);
            }
          });
        }

        seatingGrid.appendChild(btn);
      }
    }
  });
}

/* ====== Toggle cadeira ====== */
function toggleSeat(id, btnEl) {
  if (btnEl.classList.contains('reserved')) return;
  if (selectedSeats.has(id)) {
    selectedSeats.delete(id);
    btnEl.classList.remove('selected');
    btnEl.setAttribute('aria-pressed','false');
  } else {
    selectedSeats.add(id);
    btnEl.classList.add('selected');
    btnEl.setAttribute('aria-pressed','true');
  }
  refreshSummary();
}

/* ====== Atualizar resumo lateral ====== */
function refreshSummary() {
  const arr = Array.from(selectedSeats).sort();
  selectedList.innerHTML = '';
  if (arr.length === 0) {
    selectedList.textContent = '— nenhum —';
    selectedList.style.color = '';
  } else {
    arr.forEach(s => {
      const pill = document.createElement('div');
      pill.style.padding = '6px 10px';
      pill.style.borderRadius = '8px';
      pill.style.background = 'rgba(255,255,255,0.02)';
      pill.style.fontWeight = '900';
      pill.style.color = 'var(--accent-2)';
      pill.textContent = s;
      selectedList.appendChild(pill);
    });
  }
  updateTotal();
}

/* ====== Atualizar total estimado ====== */
function updateTotal() {
  const tickets = selectedSeats.size;
  let combosTotal = 0;
  Object.keys(comboSelections).forEach(k => {
    combosTotal += (comboSelections[k] || 0) * (combos.find(c => c.id === k)?.price || 0);
  });
  const total = tickets * pricePerTicket + combosTotal;
  totalPriceEl.innerText = formatCurrency(total);
}

/* ====== Limpar seleção de assentos ====== */
clearSeatsBtn.addEventListener('click', () => {
  selectedSeats.clear();
  document.querySelectorAll('.seat.selected').forEach(el => {
    el.classList.remove('selected');
    el.setAttribute('aria-pressed','false');
  });
  refreshSummary();
});

/* ====== Ir para combos ====== */
proceedToCombosBtn.addEventListener('click', goToCombos);
document.getElementById('proceedToCombos').addEventListener('click', goToCombos); // double-safe

function goToCombos() {
  if (selectedSeats.size === 0) {
    // se quiser forçar, podemos alertar. Mas deixarei permitir ir mesmo sem escolher.
    if (!confirm('Nenhum assento selecionado. Deseja continuar para combos mesmo assim?')) return;
  }
  // trocar views
  seatView.classList.add('hidden');
  comboView.classList.remove('hidden');
  stepSeats.classList.remove('active');
  stepCombos.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ====== Voltar para assentos ====== */
backToSeatsBtn.addEventListener('click', () => {
  comboView.classList.add('hidden');
  seatView.classList.remove('hidden');
  stepCombos.classList.remove('active');
  stepSeats.classList.add('active');
});

/* ====== Construir combos UI ====== */
function buildCombos() {
  combosGrid.innerHTML = '';
  combos.forEach(c => {
    comboSelections[c.id] = comboSelections[c.id] || 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'combo';

    const pic = document.createElement('div');
    pic.className = 'pic';
    pic.innerText = c.emoji;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div'); name.className = 'name'; name.innerText = c.name;
    const desc = document.createElement('div'); desc.className = 'price muted-small'; desc.innerText = c.desc;
    const price = document.createElement('div'); price.className = 'price'; price.innerText = formatCurrency(c.price);

    meta.appendChild(name);
    meta.appendChild(desc);
    meta.appendChild(price);

    const qty = document.createElement('div');
    qty.className = 'qty';
    const minus = document.createElement('button'); minus.type='button'; minus.innerText='−';
    const count = document.createElement('div'); count.className='count'; count.style.fontWeight='900'; count.style.color='#fff'; count.style.width='36px'; count.style.textAlign='center';
    count.innerText = comboSelections[c.id] || 0;
    const plus = document.createElement('button'); plus.type='button'; plus.innerText='+';

    minus.addEventListener('click', () => {
      if ((comboSelections[c.id]||0) > 0) {
        comboSelections[c.id]--;
        count.innerText = comboSelections[c.id];
        updateTotal();
      }
    });
    plus.addEventListener('click', () => {
      comboSelections[c.id] = (comboSelections[c.id]||0) + 1;
      count.innerText = comboSelections[c.id];
      updateTotal();
    });

    qty.appendChild(minus);
    qty.appendChild(count);
    qty.appendChild(plus);

    wrapper.appendChild(pic);
    wrapper.appendChild(meta);
    wrapper.appendChild(qty);

    combosGrid.appendChild(wrapper);
  });
}

/* ====== Ir para pagamento (placeholder) ====== */
toPaymentFromCombosBtn.addEventListener('click', () => {
  // atualiza etapa visual
  stepCombos.classList.remove('active');
  stepPay.classList.add('active');

  // recolher resumo (poderíamos enviar os dados para o backend)
  // mostrar modal placeholder
  openModal();
});

/* modal handlers */
function openModal() {
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}
function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
modalGoto.addEventListener('click', () => {
  // Simula redirecionamento: mostra mensagem e fecha
  modalGoto.disabled = true;
  modalGoto.innerText = 'Redirecionando...';
  setTimeout(()=>{
    modalGoto.innerText = 'Redirecionando...';
    alert('Aqui seu amigo integraria o sistema de pagamento (gateway).');
    closeModal();
    modalGoto.disabled = false;
    modalGoto.innerText = 'Simular redirecionamento';
  }, 800);
});

/* ====== util ====== */
function formatCurrency(v){
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ====== Inicialização ====== */
buildSeating();
refreshSummary();
buildCombos();
updateTotal();

/* Extra: permitir confirmação rápida com tecla "c" para avançar aos combos (dev shortcut) */
document.addEventListener('keydown', (e) => {
  if (e.key === 'c' && !comboView.classList.contains('hidden')) {
    // if already in combos, open modal
    openModal();
  }
});
