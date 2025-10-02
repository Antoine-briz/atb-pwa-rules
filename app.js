// app.js — structure en 3 pages + sous-pages, routes hash

const $app = document.getElementById("app");

// --- Router ---
const routes = {
  "#/": renderHome,
  "#/proba": renderProbaMenu,
  "#/proba/pneumonies": renderProbaPneumonieForm,
  "#/proba/iu": renderProbaIUForm,
  "#/proba/abdo": renderProbaAbdoForm,
  "#/adaptee": renderAdapteeMenu,
  "#/durees": renderDureesForm
};

window.addEventListener("hashchange", () => mount());
window.addEventListener("load", () => {
  if (!location.hash) location.hash = "#/"; // défaut accueil
  mount();
});

function mount(){ (routes[location.hash] || renderNotFound)(); }
function h(cls, html){ return `<div class="${cls}">${html}</div>`; }

// ---------- Pages ----------
function renderHome(){
  $app.innerHTML = `
    <div class="hero card">
      <img src="./img/bandeau.png" alt="Protocoles d’antibiothérapie – MIR CHV André Mignot" class="hero-img">
    </div>

    <div class="grid">
      <button class="btn" onclick="location.hash='#/proba'">
        <img src="./img/proba.png" alt="" class="icon-btn">
        Antibiothérapie probabiliste
      </button>
      <button class="btn" onclick="location.hash='#/adaptee'">
        <img src="./img/adaptee.png" alt="" class="icon-btn">
        Antibiothérapie adaptée
      </button>
      <button class="btn" onclick="location.hash='#/durees'">
        <img src="./img/duree.png" alt="" class="icon-btn">
        Durée d’antibiothérapie
      </button>
    </div>
  `;
}


function renderProbaMenu(){
  $app.innerHTML = `
    ${h("card", `<strong>Antibiothérapie probabiliste</strong>`)}
    ${h("grid cols-2", `
      <button class="btn outline" onclick="location.hash='#/proba/pneumonies'">Pneumonies</button>
      <button class="btn outline" onclick="location.hash='#/proba/iu'">Infections urinaires</button>
      <button class="btn outline" onclick="location.hash='#/proba/abdo'">Infections intra-abdominales</button>
      <button class="btn outline" disabled>Infections neuro-méningées</button>
      <button class="btn outline" disabled>Parties molles</button>
      <button class="btn outline" disabled>Endocardites infectieuses</button>
      <button class="btn outline" disabled>Sepsis sans porte d’entrée</button>
    `)}
    ${h("card", `<button class="btn ghost" onclick="history.back()">← Retour</button>`)}
  `;
}

function renderProbaPneumonieForm(){
  $app.innerHTML = `
    <div class="card"><strong>Caractéristiques de la pneumonie</strong></div>

    <div class="hero-pneu card">
      <img src="./img/pneumonie.png" alt="Pneumonie" class="form-hero">
    </div>

    <form id="formPneu" class="form">
      <!-- le reste de ton formulaire inchangé -->
      <fieldset>
        <legend>Lieu de survenue</legend>
        <label><input type="radio" name="origine" value="Communautaire" checked> Communautaire</label>
        <label><input type="radio" name="origine" value="Nosocomiale"> Nosocomiale</label>
      </fieldset>

      <fieldset>
        <legend>Risque de bactérie multirésistante</legend>
        <div class="row">
          <label><input type="checkbox" name="pseudo"> P. aeruginosa</label>
          <label><input type="checkbox" name="blse"> BLSE</label>
          <label><input type="checkbox" name="sarm"> SARM</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Caractéristiques patient</legend>
        <div class="row">
          <label><input type="checkbox" name="immuno"> Immunodépression</label>
          <label><input type="checkbox" name="allergie"> Allergie β-lactamines</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Sévérité</legend>
        <label><input type="checkbox" name="choc"> Choc septique</label>
      </fieldset>

      <fieldset>
        <legend>Pneumonies particulières</legend>
        <div class="row">
          <label><input type="checkbox" name="necro"> Pneumonie nécrosante</label>
          <label><input type="checkbox" name="inhal"> Inhalation</label>
        </div>
      </fieldset>

      <div class="actions">
        <button type="button" class="btn" id="btnReco">Antibiothérapie probabiliste recommandée</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resPneu" class="result"></div>
    </form>
  `;

  document.getElementById("btnReco").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formPneu"));
    const params = {
      origine: fd.get("origine") || "Communautaire",
      pseudo: !!fd.get("pseudo"),
      blse: !!fd.get("blse"),
      sarm: !!fd.get("sarm"),
      immuno: !!fd.get("immuno"),
      allergie: !!fd.get("allergie"),
      choc: !!fd.get("choc"),
      necro: !!fd.get("necro"),
      inhal: !!fd.get("inhal")
    };

    // ——— Logique PROVISOIRE pour démonstration (on branchera tes vraies règles ensuite)
    const reco = decidePneumonie(params);
    document.getElementById("resPneu").textContent = reco +
      "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

function renderProbaIUForm(){
  $app.innerHTML = `
    <div class="card"><strong>Infections urinaires — caractéristiques</strong></div>

    <div class="hero-pneu card">
      <img src="./img/urinaire.png" alt="Infections urinaires" class="form-hero">
    </div>

    <form id="formIU" class="form">
      <fieldset>
        <legend>Lieu de survenue</legend>
        <label><input type="radio" name="origine" value="Communautaire" checked> Communautaire</label>
        <label><input type="radio" name="origine" value="Nosocomiale"> Nosocomiale</label>
      </fieldset>

      <fieldset>
        <legend>Signes de gravité</legend>
        <label><input type="checkbox" name="qsofa2"> Q-SOFA ≥ 2</label>
        <label><input type="checkbox" name="gesteUrg"> Geste urologique urgent</label>
        <label><input type="checkbox" name="choc"> Choc septique</label>
      </fieldset>

      <fieldset>
        <legend>Facteurs de risque</legend>
        <div class="row">
          <label><input type="checkbox" name="blse6m"> BLSE/portage &lt; 6 mois</label>
          <label><input type="checkbox" name="blseFdr"> Autre FdR BLSE</label>
          <label><input type="checkbox" name="immuno"> Immunodépression</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Terrain / Allergies / Examen direct</legend>
        <div class="row">
          <label><input type="checkbox" name="allergie"> Allergie sévère β-lactamines</label>
          <label><input type="checkbox" name="gramPos"> Cocci Gram + (examen direct)</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Cas particulier</legend>
        <label><input type="checkbox" name="pnaEmphy"> Pyélonéphrite emphysémateuse</label>
      </fieldset>

      <div class="actions">
        <button type="button" class="btn" id="btnIU">Antibiothérapie probabiliste recommandée</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resIU" class="result"></div>
    </form>
  `;

  document.getElementById("btnIU").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formIU"));
    const params = {
      origine: fd.get("origine") || "Communautaire",
      qsofa2: !!fd.get("qsofa2"),
      gesteUrg: !!fd.get("gesteUrg"),
      choc: !!fd.get("choc"),
      blse6m: !!fd.get("blse6m"),
      blseFdr: !!fd.get("blseFdr"),
      immuno: !!fd.get("immuno"),
      allergie: !!fd.get("allergie"),
      gramPos: !!fd.get("gramPos"),
      pnaEmphy: !!fd.get("pnaEmphy")
    };
    const out = decideIU(params);
    document.getElementById("resIU").textContent = out +
      "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ——— Transposition stricte de ta macro VBA (IU_GenerateResult) ———
function decideIU(p){
  // Gravité
  let gravite = "Sans signe de gravité";
  if (p.choc) gravite = "Choc septique";
  else if (p.qsofa2 || p.gesteUrg) gravite = "Signes de gravité sans choc (Q-SOFA = 2 et/ou geste urologique urgent)";

  const fdrBLSE = (p.blse6m || p.blseFdr);
  let res = "", notes = "";

  // Cas particuliers prioritaires
  if (p.pnaEmphy){
    res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min + levée de l’obstacle.\n" +
          "PNA emphysémateuse — FdR : diabète, obstacle des voies urinaires ; TDM : gaz intra-rénal ; Germes : entérobactéries (E. coli ~70%).\n" +
          "Remarque : exceptionnellement nosocomiale.";
    return wrapIU(p, gravite, res, notes);
  }

  if (p.allergie){
    if (p.origine === "Communautaire"){
      if (p.choc){
        res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Aztréonam 1 g x4/j IVL OU Amikacine 25–30 mg/kg IVL sur 30 min.\n" +
              "Si choc septique : associer Aztréonam + Amikacine.";
      }
    } else {
      res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
    }
    return wrapIU(p, gravite, res, notes);
  }

  if (p.gramPos){
    if (p.origine === "Communautaire"){
      res = "Amoxicilline-acide clavulanique 1 g x3/j" + (p.choc ? " (+ Gentamicine si choc septique)." : ".");
    } else {
      res = "Pipéracilline-tazobactam 4 g x4/j" + (p.choc ? " (+ Vancomycine si choc) (+ Gentamicine si choc)." : ".");
    }
    return wrapIU(p, gravite, res, notes);
  }

  // Tronc commun
  if (p.origine === "Communautaire"){
    if (gravite === "Sans signe de gravité"){
      res = "Céfotaxime 1 g x4–6/24h IVL.";
      if (fdrBLSE) notes = "Note : pas de couverture BLSE même en cas de facteur de risque.";
    } else if (gravite.startsWith("Signes de gravité")){
      if (p.blse6m){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    } else { // Choc
      if (fdrBLSE){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    }
    if (p.immuno && gravite === "Sans signe de gravité"){
      notes = (notes ? notes + "\n" : "") + 'Remarque : "patient immunodéprimé ou non" ? même schéma.';
    }
  } else {
    // Nosocomiale
    if (gravite === "Sans signe de gravité"){
      if (fdrBLSE){
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
        notes = "Éviter les carbapénèmes en probabiliste.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j.";
      }
    } else if (gravite.startsWith("Signes de gravité")){
      if (p.blse6m){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    } else { // Choc
      if (fdrBLSE){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    }
  }

  return wrapIU(p, gravite, res, notes);
}

function wrapIU(p, gravite, res, notes){
  const lignes = [];
  if (p.immuno)   lignes.push("Critère : immunodépression cochée");
  if (p.blse6m)   lignes.push("Critère : infection/portage BLSE < 6 mois");
  if (p.blseFdr)  lignes.push("Critère : autre facteur de risque de BLSE");
  if (p.gramPos)  lignes.push("Critère : cocci Gram+ à l’examen direct");
  if (p.pnaEmphy) lignes.push("Critère : PNA emphysémateuse");
  if (p.allergie) lignes.push("Critère : allergie sévère aux ß-lactamines");

  return [
    "IU en réanimation — Décision (selon le tableau fourni)",
    "Origine : " + p.origine,
    "Gravité : " + gravite,
    (lignes.length ? lignes.join("\n") : null),
    "",
    "Proposition thérapeutique :",
    res,
    (notes ? "\n" + notes : "")
  ].filter(Boolean).join("\n");
}


function renderAdapteeMenu(){
  $app.innerHTML = `
    ${h("card", `<strong>Antibiothérapie adaptée</strong>`)}
    ${h("grid cols-2", `
      <button class="btn outline" disabled>Germes multisenstibles</button>
      <button class="btn outline" disabled>SARM</button>
      <button class="btn outline" disabled>Entérobactéries AmpC (groupe 3)</button>
      <button class="btn outline" disabled>Entérobactéries BLSE</button>
      <button class="btn outline" disabled><em>Pseudomonas</em> aeruginosa MDR/XDR</button>
      <button class="btn outline" disabled><em>A. baumannii</em> Imipénème-R</button>
      <button class="btn outline" disabled><em>Stenotrophomonas</em> maltophilia</button>
      <button class="btn outline" disabled>Entérobactéries carbapénèmase</button>
      <button class="btn outline" disabled><em>E. faecium</em> Vancomycine-R</button>
    `)}
    ${h("card", `<div class="muted">Tu me donneras les tableaux par bactérie et je remplirai les écrans.</div>`)}
    ${h("card", `<button class="btn ghost" onclick="history.back()">← Retour</button>`)}
  `;
}

function renderDureesForm(){
  $app.innerHTML = `
    ${h("card", `<strong>Durée d’antibiothérapie</strong>`)}
    <form id="formDur" class="form">
      <div class="row">
        <fieldset>
          <legend>Type d’infection</legend>
          <label><input type="radio" name="infection" value="Pneumonies" checked> Pneumonies</label>
          <label><input type="radio" name="infection" value="Infections urinaires"> Infections urinaires</label>
          <label><input type="radio" name="infection" value="Bactériémies"> Bactériémies</label>
          <label><input type="radio" name="infection" value="Infections intra-abdominales"> Infections intra-abdominales</label>
          <label><input type="radio" name="infection" value="Infections neuro-méningées"> Infections neuro-méningées</label>
          <label><input type="radio" name="infection" value="Infections des parties molles"> Infections des parties molles</label>
          <label><input type="radio" name="infection" value="Endocardites infectieuses"> Endocardites infectieuses</label>
        </fieldset>
        <fieldset>
          <legend>Documentation bactériologique</legend>
          <label><input type="radio" name="germe" value="Cocci Gram −"> Cocci Gram −</label>
          <label><input type="radio" name="germe" value="Cocci Gram +"> Cocci Gram +</label>
          <label><input type="radio" name="germe" value="Bacille Gram −"> Bacille Gram −</label>
          <label><input type="radio" name="germe" value="Bacille Gram +"> Bacille Gram +</label>
          <label><input type="radio" name="germe" value="Autres" checked> Autres</label>
        </fieldset>
      </div>
      <div class="actions">
        <button type="button" class="btn" id="btnDuree">Durée d’antibiothérapie</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resDur" class="result"></div>
    </form>
  `;
  document.getElementById("btnDuree").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formDur"));
    const infection = fd.get("infection") || "";
    const germe = fd.get("germe") || "";
    // ——— Logique provisoire : on branchera tes durées exactes ensuite
    document.getElementById("resDur").textContent =
      decideDuree(infection, germe) || "Durée non renseignée (à compléter).";
  });
}

function renderNotFound(){
  $app.innerHTML = h("card", `<strong>Page introuvable</strong>`);
}

// ---------- Démo de logique provisoire (on la remplacera par tes règles) ----------
function decidePneumonie(p){
  // Priorités d’exemple (identiques à ce qu’on a déjà esquissé)
  if (p.allergie) return `Lévofloxacine 500 mg x2/j ± Aztréonam si besoin (${p.origine.toLowerCase()}).`;
  if (p.blse) return `Méropénème 4–6 g/24h IVL${p.origine==="Communautaire"?" + Spiramycine 3 MU x3/j":""}.`;
  if (p.pseudo || p.immuno) return `Céfépime 1 g x4/j ou Pip/Tazo 4 g x4/j${p.origine==="Communautaire"?" + Spiramycine 3 MU x3/j":""}.`;
  if (p.inhal) return `${p.origine==="Communautaire"?"Amox/Clav 1 g x3/j":"Amox/Clav 1 g x3/j ou Pip/Tazo 4 g x4/j"}.`;
  // défaut
  if (p.origine==="Communautaire") return "Céfotaxime 1 g x4–6/24h + Spiramycine 3 MU x3/j.";
  return "Céfépime 1 g x4/j si >5j; sinon Céfotaxime 1 g x4–6/24h.";
}

function decideDuree(infection, germe){
  if (infection==="Pneumonies" && germe==="Autres") return "5–7 jours (à affiner selon documentation).";
  return "";
}
