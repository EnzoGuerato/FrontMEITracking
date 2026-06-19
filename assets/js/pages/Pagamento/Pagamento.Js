const planCards = document.querySelectorAll('.plan-card');
const summaryName = document.getElementById('summary-plan-name');
const summaryBenefits = document.getElementById('summary-benefits');
const summaryTotal = document.getElementById('summary-total');
const summaryStamp = document.getElementById('summary-stamp');

function formatBRL(value) {
    return 'R$' + value.toFixed(2).replace('.', ',');
}

function selectPlan(card) {
    planCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    card.querySelector('input').checked = true;

    const price = parseFloat(card.dataset.price);
    const benefits = [...card.querySelectorAll('.plan-card__benefits li')].map(li => li.textContent.trim());

    summaryName.textContent = card.dataset.name;
    summaryTotal.textContent = formatBRL(price);
    summaryBenefits.innerHTML = benefits.map(b => `<li><span>${b}</span><span>incluso</span></li>`).join('');

    summaryStamp.classList.remove('is-visible');
    requestAnimationFrame(() => requestAnimationFrame(() => summaryStamp.classList.add('is-visible')));
}

planCards.forEach(card => card.addEventListener('click', () => selectPlan(card)));
// mostra o selo já na carga inicial
requestAnimationFrame(() => requestAnimationFrame(() => summaryStamp.classList.add('is-visible')));

// Tabs de pagamento
const tabs = document.querySelectorAll('.pay-tab');
const panels = document.querySelectorAll('.pay-panel');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('is-active'));
        panels.forEach(p => p.setAttribute('hidden', ''));
        tab.classList.add('is-active');
        document.querySelector(`.pay-panel[data-panel="${tab.dataset.tab}"]`).removeAttribute('hidden');
    });
});

// Máscaras simples
const cardNumber = document.getElementById('card-number');
cardNumber.addEventListener('input', () => {
    cardNumber.value = cardNumber.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
});

const cardExpiry = document.getElementById('card-expiry');
cardExpiry.addEventListener('input', () => {
    cardExpiry.value = cardExpiry.value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
});

const cardCvv = document.getElementById('card-cvv');
cardCvv.addEventListener('input', () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, '').slice(0, 4);
});

const cardCpf = document.getElementById('card-cpf');
cardCpf.addEventListener('input', () => {
    cardCpf.value = cardCpf.value.replace(/\D/g, '').slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
});

// Copiar código Pix
const pixCopyBtn = document.getElementById('pix-copy-btn');
if (pixCopyBtn) {
    pixCopyBtn.addEventListener('click', () => {
        const input = pixCopyBtn.previousElementSibling;
        navigator.clipboard?.writeText(input.value);
        showToast('Código Pix copiado.');
    });
}

// Toast de feedback
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-shown'), 2600);
}

// Submit: por enquanto só visual, sem integração com API
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Pagamento simulado — conecte aqui a chamada para a sua API de pagamento.');

});