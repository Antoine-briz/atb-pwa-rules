import { loadRules, buildForm, matchRule } from './rules.js';

const $ = (id) => document.getElementById(id);
const ui = {
  tabs: document.querySelectorAll('.tabs button'),
  panels: document.querySelectorAll('.panel'),
  status: $('status'),
  search: $('search'),
  probaForm: $('form-proba'),
  probaBtn: $('calculer-proba'),
  probaFav: $('favori-proba'),
  probaRes: $('resultat-proba'),
  dureesForm: $('form-durees'),
  dureeBtn: $('calculer-durees'),
  dureeFav: $('favori-durees'),
  dureeRes: $('resultat-durees'),
  favoris: $('favoris'),
};

// Helpers pour les templates conditionnels
const helpers = {
  add_if: (flag, txt) => (flag === true || flag === "true" ? txt : ""),
  add_if_origin: (flag, origine, txtCommu, txtNoso) =>
    (flag === true || flag === "true") ? (String(origine) === "Nosocomiale" ? txtNoso : txtCommu) : "",
  note_if_origin: (flag, origine, txtCommu, txtNoso) =>
    (flag === true || flag === "true") ? (String(origine) === "Nosocomiale" ? txtNoso : txtCommu) : ""
};

function renderTemplate(str, ctx) {
  return String(str).replace(/\{\{(\w+)\s*\(([^}]*)\)\}\}/g, (_, fn, args) => {
    const list = (args || "").split(",").map(s => s.trim()).map(a => (a in ctx ? ctx[a] : a));
    if (typeof helpers[fn] !== "function") return "";
    try { return String(helpers[fn](...list)); } catch { return ""; }
  });
}



function updateOnlineStatus() {
  ui.status.classList.toggle('offline', !navigator.onLine);
  ui.status.title = navigator.onLine ? 'En ligne' : 'Hors ligne';
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

let RULES;

function switchTab(id) {
  ui.tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  ui.panels.forEach(p => p.classList.toggle('hidden', p.id !== id));
}

ui.tabs.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

function formValues(formEl) {
  const vals = {};
  formEl.querySelectorAll('input,select').forEach(el => {
    let v = el.value;
    if (el.type === 'number' || el.inputMode === 'numeric' || el.inputMode === 'decimal') {
      v = v ? Number(v) : '';
    }
    if (el.id && v !== undefined) vals[el.id] = v === 'true' ? true : v === 'false' ? false : v;
  });
  return vals;
}

function addFavori(kind, params, result) {
  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
  favoris.unshift({ kind, params, result, date: new Date().toISOString() });
  localStorage.setItem('favoris', JSON.stringify(favoris.slice(0, 50)));
  renderFavoris();
}

function renderFavoris() {
  const favoris = JSON.parse(localStorage.getItem('favoris') || '[]');
  ui.favoris.innerHTML = '';
  favoris.forEach((f, i) => {
    const li = document.createElement('li');
    const title = f.kind === 'probabiliste' ? `${f.params.infection || ''}` : `${f.params.infection || ''} × ${f.params.germe || ''}`;
    li.innerHTML = `<span>${title}</span>`;
    const grp = document.createElement('div');
    const use = document.createElement('button'); use.textContent = 'Utiliser';
    use.onclick = () => {
      switchTab(f.kind === 'probabiliste' ? 'probabiliste' : 'durees');
      const form = f.kind === 'probabiliste' ? ui.probaForm : ui.dureesForm;
      form.querySelectorAll('input,select').forEach(el => {
        if (f.params[el.id] !== undefined) el.value = f.params[el.id];
      });
      if (f.kind === 'probabiliste') computeProba();
      else computeDuree();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const del = document.createElement('button'); del.textContent = 'Supprimer';
    del.onclick = () => {
      const arr = JSON.parse(localStorage.getItem('favoris') || '[]');
      arr.splice(i,1); localStorage.setItem('favoris', JSON.stringify(arr)); renderFavoris();
    };
    grp.append(use, del);
    li.appendChild(grp);
    ui.favoris.appendChild(li);
  });
}

function computeProba() {
  const params = formValues(ui.probaForm);
  const rows = RULES.datasets.probabiliste.tables;
  const match = rows.find(r => matchRule(r.match, params));
  const out = match ? match.recommendation : 'Aucune règle correspondante. Compléter la base.';
  const rendered = renderTemplate(out, params);
ui.probaRes.textContent = rendered + '\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.';
  ui.probaRes.classList.remove('hidden');
  localStorage.setItem('last_proba', JSON.stringify(params));
  return out;
}

function computeDuree() {
  const params = formValues(ui.dureesForm);
  const rows = RULES.datasets.durees.matrix;
  const match = rows.find(r => r.infection === params.infection && r.germe === params.germe);
  const out = match ? match.duree : 'Durée non renseignée pour cette combinaison.';
  ui.dureeRes.textContent = out;
  ui.dureeRes.classList.remove('hidden');
  localStorage.setItem('last_duree', JSON.stringify(params));
  return out;
}

function applySearch(q) {
  q = (q||'').toLowerCase().trim();
  // filter select options to help user
  [ui.probaForm, ui.dureesForm].forEach(form => {
    form.querySelectorAll('select').forEach(sel => {
      Array.from(sel.options).forEach(opt => {
        if (!opt.value) return;
        opt.hidden = q && !opt.text.toLowerCase().includes(q);
      });
    });
  });
}

ui.probaBtn.addEventListener('click', computeProba);
ui.probaFav.addEventListener('click', () => addFavori('probabiliste', formValues(ui.probaForm), computeProba()));
ui.dureeBtn.addEventListener('click', computeDuree);
ui.dureeFav.addEventListener('click', () => addFavori('durees', formValues(ui.dureesForm), computeDuree()));
ui.search.addEventListener('input', e => applySearch(e.target.value));

async function init() {
  updateOnlineStatus();
  RULES = await loadRules();
  buildForm(ui.probaForm, RULES.datasets.probabiliste.fields);
  buildForm(ui.dureesForm, RULES.datasets.durees.fields);
  renderFavoris();
  // restore last selections
  const lastP = JSON.parse(localStorage.getItem('last_proba') || '{}');
  Object.entries(lastP).forEach(([k,v]) => { const el = ui.probaForm.querySelector('#'+k); if (el) el.value = v; });
  const lastD = JSON.parse(localStorage.getItem('last_duree') || '{}');
  Object.entries(lastD).forEach(([k,v]) => { const el = ui.dureesForm.querySelector('#'+k); if (el) el.value = v; });
}
init();
