
// v4 single-folder assets: i18n + data render + mobile menu
const state = { lang: localStorage.getItem('lang') || 'en' };
function dirFor(lang){ return lang === 'ar' ? 'rtl' : 'ltr'; }
function toggleLang(){ state.lang = state.lang === 'en' ? 'ar' : 'en'; localStorage.setItem('lang', state.lang); applyLang(); }
function applyLang(){
  document.documentElement.lang = state.lang;
  document.documentElement.dir = dirFor(state.lang);
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n'); const text = i18n[state.lang][key] || el.textContent; el.textContent = text;
  });
}
const i18n = {
  en:{ hero_title:'Crew BLOD', hero_tag:'Ride together. Win together.', cta_join:'Join the Crew', cta_battles:'See Battles', section_news:'Latest Updates' },
  ar:{ hero_title:'كرو بلود', hero_tag:'نقاتل معًا ونفوز معًا.', cta_join:'انضم إلى الكرو', cta_battles:'شاهد المعارك', section_news:'آخر المستجدات' }
};
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  const t = document.querySelector('.nav-toggle');
  const m = document.querySelector('.menu');
  if(t && m){ t.addEventListener('click', ()=> m.classList.toggle('open')); }
  renderMembers(); renderWars(); renderEvents();
});
async function loadJSON(path){ const res = await fetch(path); return res.json(); }
async function renderMembers(){
  const el = document.getElementById('members-list'); if(!el) return;
  const d = await loadJSON('assets/members.json');
  el.innerHTML = d.members.map(m => `
    <div class="card">
      <div class="section-head"><strong>${m.handle}</strong><span class="tag">${m.rank}</span></div>
      <p style="color:#aab0bb">${m.bio || ""}</p>
    </div>`).join('');
}
async function renderWars(){
  const tb = document.querySelector('#wars-table tbody'); if(!tb) return;
  const d = await loadJSON('assets/wars.json');
  tb.innerHTML = d.wars.map(w => `
    <tr><td>${w.opponent}</td><td>${w.started}</td><td>${w.status}</td><td>${w.score}</td><td>${w.notes || ""}</td></tr>`).join('');
}
async function renderEvents(){
  const el = document.getElementById('events-list'); if(!el) return;
  const d = await loadJSON('assets/events.json');
  el.innerHTML = d.events.map(e => `
    <div class="card">
      <div class="section-head"><strong>${e.title}</strong><span class="tag">${e.date}</span></div>
      <p>${e.description || ""}</p>
      <p style="color:#aab0bb"><strong>Game:</strong> ${e.game} • <strong>Mode:</strong> ${e.mode}</p>
    </div>`).join('');
}
