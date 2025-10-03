
// app.js — structure en 3 pages + sous-pages, routes hash

const $app = document.getElementById("app");

// --- Router ---
const routes = {
  "#/": renderHome,
  "#/proba": renderProbaMenu,
  "#/proba/pneumonies": renderProbaPneumonieForm,
  "#/proba/iu": renderProbaIUForm,
  "#/proba/abdo": renderProbaAbdoForm,
  "#/proba/neuro": renderProbaNeuroForm,
  "#/proba/dermohypo": renderProbaDermohypodermiteForm,
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
      <button class="btn outline" onclick="location.hash='#/proba/neuro'">Infections neuro-méningées</button>
      <button class="btn outline" onclick="location.hash='#/proba/dermohypo'">Infections des parties molles</button>
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

    <!-- Facteurs de risque microbiologique -->
    <fieldset>
      <legend>Facteurs de risque microbiologique</legend>
      <label><input type="checkbox" name="blse" value="BLSE/portage"> BLSE/Portage</label>
      <label><input type="checkbox" name="autreFdrBlse" value="Autre FdR BLSE"> Autre FdR BLSE</label>
      <label><input type="checkbox" name="cocciGramPlus" value="Cocci Gram +"> Cocci Gram +</label>
    </fieldset>

    <!-- Facteurs liés au patient -->
    <fieldset>
      <legend>Facteurs liés au patient</legend>
      <label><input type="checkbox" name="allergieBL" value="Allergie aux béta-lactamines"> Allergie aux béta-lactamines</label>
      <label><input type="checkbox" name="immunodep" value="Immunodépression"> Immunodépression</label>
    </fieldset>

    <!-- Cas particulier -->
    <fieldset>
      <legend>Cas particulier</legend>
      <label><input type="checkbox" name="pnaEmphy"> Pyélonéphrite emphysémateuse</label>
    </fieldset>
  </div>

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
  blse: fd.get("blse") || "",
  autreFdrBlse: fd.get("autreFdrBlse") || "",
  cocciGramPlus: fd.get("cocciGramPlus") || "",
  allergieBL: fd.get("allergieBL") || "",
  immunodep: fd.get("immunodep") || "",
  pnaEmphy: !!fd.get("pnaEmphy")
};
const out = decideIU(params);
document.getElementById("resIU").textContent = out + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ——— Transposition stricte de ta macro VBA (IU_GenerateResult) ———
function decideIU(p){
  // Gravité
  let gravite = "Sans signe de gravité";
  if (p.choc) gravite = "Choc septique";
  else if (p.qsofa2 || p.gesteUrg) gravite = "Signes de gravité sans choc (Q-SOFA = 2 et/ou geste urologique urgent)";

  const fdrBLSE = (p.blse || p.autreFdrBlse); // Vérification des facteurs de risque BLSE
  let res = "", notes = "";

  // Cas particuliers prioritaires
 if (p.pnaEmphy) {
  if (p.allergieBL) {
    // Si PNA emphysémateuse et allergie aux béta-lactamines
    res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min + levée de l’obstacle.\n" +
          "PNA emphysémateuse — FdR : diabète, obstacle des voies urinaires ; TDM : gaz intra-rénal ; Germes : entérobactéries (E. coli ~70%).\n" +
          "Remarque : exceptionnellement nosocomiale.";
  } else {
    // Si uniquement PNA emphysémateuse sans allergie
    res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min + levée de l’obstacle.\n" +
          "PNA emphysémateuse — FdR : diabète, obstacle des voies urinaires ; TDM : gaz intra-rénal ; Germes : entérobactéries (E. coli ~70%).\n" +
          "Remarque : exceptionnellement nosocomiale.";
  }
  return wrapIU(p, gravite, res, notes);
}

  if (p.allergieBL){
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

  if (p.cocciGramPlus){
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
      if (p.blse){
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
      if (p.blse){
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
  if (p.blse)   lignes.push("Critère : infection/portage BLSE < 6 mois");
  if (p.autreFdrBlse)  lignes.push("Critère : autre facteur de risque de BLSE");
  if (p.gramPos)  lignes.push("Critère : cocci Gram+ à l’examen direct");
  if (p.pnaEmphy) lignes.push("Critère : PNA emphysémateuse");
  if (p.allergie) lignes.push("Critère : allergie sévère aux ß-lactamines");

  return [
    "IU en réanimation — Antibiothérapie probabiliste recommandée (selon le tableau fourni)",
    "Origine : " + p.origine,
    "Gravité : " + gravite,
    (lignes.length ? lignes.join("\n") : null),
    "",
    "Proposition thérapeutique :",
    res,
    (notes ? "\n" + notes : "")
  ].filter(Boolean).join("\n");
}

function renderProbaAbdoForm(){
  $app.innerHTML = `
    <div class="card"><strong>Infections intra-abdominales — caractéristiques</strong></div>

    <div class="hero-pneu card">
      <img src="./img/abdo.png" alt="Infections intra-abdominales" class="form-hero">
    </div>

    <form id="formAbdo" class="form">
      <fieldset>
        <legend>Origine</legend>
        <label><input type="radio" name="origine" value="Communautaires" checked> Communautaires</label>
        <label><input type="radio" name="origine" value="Nosocomiales"> Nosocomiales</label>
      </fieldset>

      <fieldset>
        <legend>Catégorie d’infection</legend>
        <div class="row">
          <label><input type="radio" name="categorie" value="Infections des voies biliaires"> Infections des voies biliaires</label>
          <label><input type="radio" name="categorie" value="Infections entéro-coliques (hors péritonites)"> Infections entéro-coliques (hors péritonites)</label>
          <label><input type="radio" name="categorie" value="Péritonites secondaires"> Péritonites secondaires</label>
          <label><input type="radio" name="categorie" value="Cas particuliers"> Cas particuliers</label>
        </div>
      </fieldset>

      <fieldset id="fsSousType" class="hidden">
        <legend>Sous-type</legend>
        <select id="cboSousType"></select>
      </fieldset>

 <fieldset>
  <legend>Facteurs de risque microbiologiques</legend>
  <div class="row">
    <label><input type="checkbox" name="BLSE"> FdR BLSE / portage</label>
    <label><input type="checkbox" name="Faecium"> FdR <em>E. faecium</em></label>
    <label><input type="checkbox" name="Dupont"> Score de Dupont ≥ 3</label>
    <label><input type="checkbox" name="ProtheseBiliaire"> Prothèse biliaire</label>
  </div>
</fieldset>

<fieldset>
  <legend>Gravité</legend>
  <div class="row">
    <label><input type="checkbox" name="Sepsis"> Sepsis</label>
    <label><input type="checkbox" name="Choc"> Choc septique</label>
  </div>
</fieldset>

<fieldset>
  <legend>Facteurs liés au patient</legend>
  <div class="row">
    <label><input type="checkbox" name="allergieBL"> Allergie sévère β-lactamines</label>
    <label><input type="checkbox" name="immunodep"> Immunodépression</label>
  </div>
</fieldset>


      <div class="actions">
        <button type="button" class="btn" id="btnAbdo">Antibiothérapie probabiliste recommandée</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resAbdo" class="result"></div>
    </form>
  `;

  // — sous-types dynamiques (ComboBox)
  const form = document.getElementById("formAbdo");
  const fsST = document.getElementById("fsSousType");
  const cbo = document.getElementById("cboSousType");

  function fillSubtypes(cat){
    const map = {
      "Infections des voies biliaires": [
        "Cholécystite aiguë",
        "Angiocholite aiguë",
        "Abcès hépatique",
        "Infection nécrose pancréatique"
      ],
      "Infections entéro-coliques (hors péritonites)": [
        "Appendicite aiguë",
        "Diverticulite aiguë",
        "Entérocolite ou colite"
      ],
      "Péritonites secondaires": [
        "Péritonite secondaire"
      ],
      "Cas particuliers": [
        "Infection de liquide d’ascite",
        "Perforation œsophagienne (dont syndrome de Boerhaave)"
      ]
    };
    const list = map[cat] || [];
    cbo.innerHTML = list.map(s => `<option value="${s}">${s}</option>`).join("");
    fsST.classList.toggle("hidden", list.length === 0);
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "categorie") fillSubtypes(e.target.value);
  });

  document.getElementById("btnAbdo").addEventListener("click", () => {
    const fd = new FormData(form);
    const p = {
      origine: fd.get("origine") || "Communautaires",
      TypeInfection: fd.get("categorie") || "",
      SousType: cbo.value || "",
      BLSE: !!fd.get("BLSE"),
      Faecium: !!fd.get("Faecium"),
      Dupont: !!fd.get("Dupont"),
      Sepsis: !!fd.get("Sepsis"),
      Choc: !!fd.get("Choc"),
      ProtheseBiliaire: !!fd.get("ProtheseBiliaire"),
      allergieBL: !!fd.get("allergieBL"),
      immunodep: !!fd.get("immunodep")
    };
    if (!p.TypeInfection){
      document.getElementById("resAbdo").textContent = "Sélectionnez une catégorie d’infection.";
      return;
    }
    const out = decideAbdo(p);
    document.getElementById("resAbdo").textContent = out +
      "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ======= LOGIQUE (transposition VBA) =======

function sepsisOuChoc(p){ return !!(p.Sepsis || p.Choc); }

function decideAbdo(p){
  switch (p.TypeInfection){
    case "Infections des voies biliaires":      return recoVoiesBiliaires(p);
    case "Infections entéro-coliques (hors péritonites)": return recoEnteroColiques(p);
    case "Péritonites secondaires":              return recoPeritonites(p);
    case "Cas particuliers":                     return recoCasParticuliers(p);
    default: return "";
  }
}

// 1) Voies biliaires
function recoVoiesBiliaires(p){
  let txt = "";
  // origine effective si immunodépression (comme VBA)
  let oEff = p.origine;
  if (oEff === "Communautaires" && p.immunodep) oEff = "Nosocomiales";

  // Sous-type : Infection nécrose pancréatique (prioritaire)
  if (p.SousType === "Infection nécrose pancréatique"){
    if (p.allergieBL){
      txt = "Ciprofloxacine 400 mg x3/j IVL/PO ou Aztréonam 1 g x4/j\n" +
            "+ Métronidazole 500 mg x3/j IVL/PO\n" +
            "+ Vancomycine 30 mg/kg/j IVSE";
      if (sepsisOuChoc(p)) txt += "\n\nSi sepsis/choc septique : Ajout Amikacine 30 mg/kg IVL";
    } else {
      txt = "Pas d’antibiothérapie récente : Céfotaxime ou Ciprofloxacine + Métronidazole 500 mg x3/j IV/PO\n\n" +
            "Antibiothérapie récente : Imipénème 1 g x3/j + Vancomycine 30 mg/kg + Fluconazole 400 mg x3/j";
      if (sepsisOuChoc(p)) txt += "\n\nSi sepsis/choc septique : Ajout Amikacine 30 mg/kg IVL";
    }
    return txt;
  }

  // Allergie prioritaire — autres sous-types biliaires
  if (p.allergieBL){
    if (oEff === "Communautaires"){
      if (["Cholécystite aiguë","Angiocholite aiguë","Abcès hépatique"].includes(p.SousType)){
        if (sepsisOuChoc(p)){
          txt = "Ciprofloxacine 750 mg x2/j IV/PO ou Aztréonam 1 g x4/j IVL\n" +
                "+ Métronidazole 500 mg x3/j IVL/PO\n" +
                "+ Vancomycine 30 mg/kg/j\n" +
                "+ Amikacine 25–30 mg/kg IVL sur 30 min";
        } else {
          txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Gentamicine 5–8 mg/kg IVL 30 min";
        }
      }
    } else { // Nosocomiales
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n" +
            "+ Métronidazole 500 mg x3/j IVL/PO\n" +
            "+ Vancomycine 30 mg/kg/j IVSE";
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Caspofungine 70 mg puis 50 mg/j IVL";
      }
    }
    return txt;
  }

  // Non allergiques — autres sous-types
  if (oEff === "Communautaires"){
    if (["Cholécystite aiguë","Angiocholite aiguë"].includes(p.SousType)){
      if (sepsisOuChoc(p)){
        txt = "Pipéracilline-tazobactam 4 g x4/j\nAmikacine 25–30 mg/kg IVL 30 min";
      } else {
        txt = "Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
        if (p.BLSE) txt += "\nSi FdR de BLSE* : Pas de carbapénème";
      }
    } else if (p.SousType === "Abcès hépatique"){
      txt = "Drainage percutané de l’abcès\n+ Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (p.BLSE) txt += "\nSi FdR de BLSE* : Pas de carbapénème";
      if (sepsisOuChoc(p)) txt += "\nSi sepsis/choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    }
  } else { // Nosocomiales
    if (["Cholécystite aiguë","Angiocholite aiguë"].includes(p.SousType)){
      txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Vancomycine 30 mg/kg/j IVSE et Caspofungine 70 mg puis 50 mg/j";
      }
    } else if (p.SousType === "Abcès hépatique"){
      txt = "Drainage percutané de l’abcès\n+ " + (p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j");
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Vancomycine 30 mg/kg/j IVSE et Caspofungine 70 mg puis 50 mg/j";
      }
    }
  }
  return txt;
}

// 2) Entéro-coliques (hors péritonites)
function recoEnteroColiques(p){
  let txt = "";
  const o = p.origine;
  const isSev = sepsisOuChoc(p);

  if (p.allergieBL){
    if (o === "Communautaires"){
      txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (isSev) txt += "\nAjout Gentamicine 5–8 mg/kg ou Amikacine 25–30 mg/kg IVL 30 min";
    } else {
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (isSev) txt += "\n+/- Vancomycine 30 mg/kg/j IVSE\n+/- Caspofungine 70 mg puis 50 mg/j IVL";
    }
    return txt;
  }

  if (o === "Communautaires"){
    if (p.SousType === "Appendicite aiguë"){
      txt = "Appendicectomie + Amoxicilline-acide clavulanique 1 g x3/j IVL (antibiothérapie seule non recommandée)";
    } else if (p.SousType === "Diverticulite aiguë"){
      txt = "Amoxicilline-acide clavulanique 1 g x3/j IVL uniquement si : sepsis, grossesse, ASA >3, immunodépression (dont cancer évolutif et IRC terminale)";
    } else if (p.SousType === "Entérocolite ou colite"){
      txt = "Céfotaxime 4–6 g/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
    }
    if (p.BLSE) txt += "\nIdem absence de FdR de BLSE (pas de carbapénème)";
    if (isSev) txt += "\nAjout Gentamicine 5–8 mg/kg IV 30 min";
    if (p.immunodep){
      const p2 = {...p, origine: "Nosocomiales"};
      return recoEnteroColiques(p2);
    }
  } else { // Nosocomiales
    if (["Appendicite aiguë","Diverticulite aiguë","Entérocolite ou colite"].includes(p.SousType)){
      txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
    }
    if (isSev){
      txt += "\nAjout Amikacine 25–30 mg/kg IVL 30 min\n+/- Vancomycine 30 mg/kg/j IVSE\n+/- Caspofungine 70 mg puis 50 mg/j IVL";
    }
  }
  return txt;
}

// 3) Péritonites secondaires
function recoPeritonites(p){
  let txt = "";
  const o = p.origine;

  if (p.allergieBL){
    if (o === "Communautaires"){
      txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Gentamicine 5–8 mg/kg IVL 30 min";
    } else {
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Vancomycine 30 mg/kg/j IVSE\n+ Amikacine 25–30 mg/kg IVL 30 min";
    }
    return txt;
  }

  if (o === "Communautaires"){
    txt = "Céfotaxime 4–6 g/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
    if (p.BLSE) txt += "\nIdem absence de FdR BLSE";
    if (p.Faecium && p.immunodep) txt += "\nAjout Vancomycine 30 mg/kg/j IVSE uniquement si immunodépression";
    if (p.Dupont) txt += "\nAjout Caspofungine 70 mg puis 50 mg/j IVL";
    if (p.Choc) txt = "Pipéracilline-tazobactam 4 g x4/j\n+ Gentamicine 5–8 mg/kg IVL 30 min";
    if (p.immunodep){
      const p2 = {...p, origine: "Nosocomiales"};
      return recoPeritonites(p2);
    }
  } else { // Nosocomiales
    txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
    if (p.Faecium) txt += "\nAjout Vancomycine 30 mg/kg/j IVSE";
    if (p.Dupont) txt += "\nAjout Caspofungine 70 mg puis 50 mg/j IVL";
    if (p.Choc) txt += "\nAjout Amikacine 25–30 mg/kg IVL + Vancomycine 30 mg/kg/j IVSE";
  }
  return txt;
}

// 4) Cas particuliers
function recoCasParticuliers(p){
  let txt = "";
  const o = p.origine;

  if (p.SousType === "Infection de liquide d’ascite"){
    if (o === "Communautaires"){
      txt = "Drainage percutané de l’ascite\n+ Céfotaxime 1 g x4–6/24h IVL\n+ Albumine 1,5 g/kg J1 puis 1 g/kg J3";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    } else {
      txt = "Drainage percutané de l’ascite\n+ Pipéracilline-tazobactam 4 g x4/j\n+ Albumine 1,5 g/kg J1 puis 1 g/kg J3";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    }
  } else if (p.SousType === "Perforation œsophagienne (dont syndrome de Boerhaave)"){
    if (o === "Communautaires"){
      txt = "Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Gentamicine 5–8 mg/kg IVL 30 min et Caspofungine 70 mg puis 50 mg/j IVL";
    } else {
      txt = "Pipéracilline-tazobactam 4 g x4/j";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min et Caspofungine 70 mg puis 50 mg/j IVL";
    }
  }
  return txt;
}

function renderProbaNeuroForm(){
  $app.innerHTML = `
    <div class="card"><strong>Infections neuro-méningées — caractéristiques</strong></div>

    <div class="hero-pneu card">
      <img src="./img/neuro.png" alt="Infections neuro-méningées" class="form-hero">
    </div>

    <form id="formNeuro" class="form">
      <fieldset>
        <legend>Allergie aux β-lactamines</legend>
        <label><input type="radio" name="allergie" value="non" checked> Non</label>
        <label><input type="radio" name="allergie" value="oui"> Oui</label>
      </fieldset>

      <fieldset>
        <legend>Type d’infection</legend>
        <label><input type="radio" name="type" value="meningite" checked> Méningite purulente</label>
        <label><input type="radio" name="type" value="me"> Méningo-encéphalite</label>
        <label><input type="radio" name="type" value="abces"> Abcès cérébral</label>
      </fieldset>

      <!-- Bloc MÉNINGITE -->
      <fieldset id="blocMeningite">
        <legend>Méningite — Examen direct du LCS</legend>
        <label><input type="radio" name="edi" value="non" checked> Non</label>
        <label><input type="radio" name="edi" value="oui"> Oui</label>

        <div id="ediSelect" class="row hidden" style="margin-top:8px">
          <label style="grid-column:1/-1">
            Résultat :
            <select id="cmbEDI">
              <option value="CG+">CG+</option>
              <option value="CG-">CG-</option>
              <option value="BG+">BG+</option>
              <option value="BG-">BG-</option>
            </select>
          </label>
        </div>

        <fieldset style="margin-top:10px">
          <legend>Eléments complémentaires</legend>
          <div class="row">
            <label><input type="checkbox" name="argListeria"> Argument listériose</label>
            <label><input type="checkbox" name="lcsHSV"> LCS compatible HSV/VZV</label>
          </div>
        </fieldset>
      </fieldset>

      <!-- Bloc MÉNINGO-ENCÉPHALITE -->
      <fieldset id="blocME" class="hidden">
        <legend>Signes de gravité</legend>
        <div class="row">
          <label><input type="checkbox" name="focal"> Signe de localisation</label>
          <label><input type="checkbox" name="coma"> Coma</label>
          <label><input type="checkbox" name="convuls"> Convulsions</label>
        </div>
        <fieldset style="margin-top:10px">
          <legend>Orientation étiologique</legend>
          <label><input type="radio" name="etio" value="oui"> Oui</label>
          <label><input type="radio" name="etio" value="non"> Non</label>
        </fieldset>
      </fieldset>

      <!-- Bloc ABCÈS CÉRÉBRAL -->
      <fieldset id="blocAbces" class="hidden">
        <legend>Porte d’entrée</legend>
        <label style="display:block;max-width:380px">
          <select id="cmbPorte">
            <option value=""></option>
            <option value="Post-operatoire">Post-opératoire</option>
            <option value="Traumatique">Traumatique</option>
            <option value="Indeterminee">Indéterminée</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <fieldset style="margin-top:10px">
          <legend>Immunodépression</legend>
          <div class="row">
            <label><input type="checkbox" name="onco"> Onco-hématologie</label>
            <label><input type="checkbox" name="transp"> Transplanté</label>
            <label><input type="checkbox" name="vih"> VIH</label>
            <label><input type="checkbox" name="immunAutre"> Autre</label>
          </div>
        </fieldset>
      </fieldset>

      <div class="actions">
        <button type="button" class="btn" id="btnNeuro">Antibiothérapie probabiliste recommandée</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resNeuro" class="result"></div>
    </form>
  `;

  // UI dynamique (affichages conditionnels)
  const form = document.getElementById("formNeuro");
  const blocM = document.getElementById("blocMeningite");
  const blocME = document.getElementById("blocME");
  const blocA = document.getElementById("blocAbces");
  const ediSelect = document.getElementById("ediSelect");
  const cmbEDI = document.getElementById("cmbEDI");
  const cmbPorte = document.getElementById("cmbPorte");

  function syncBlocks(){
    const type = new FormData(form).get("type");
    blocM.classList.toggle("hidden", type!=="meningite");
    blocME.classList.toggle("hidden", type!=="me");
    blocA.classList.toggle("hidden", type!=="abces");
    const edi = new FormData(form).get("edi");
    ediSelect.classList.toggle("hidden", !(type==="meningite" && edi==="oui"));
  }
  form.addEventListener("change", syncBlocks);
  syncBlocks();

  document.getElementById("btnNeuro").addEventListener("click", () => {
    const fd = new FormData(form);
    const p = {
      allergie: (fd.get("allergie")==="oui"),
      type: fd.get("type") || "meningite",

      // MENINGITE
      edi: fd.get("edi")==="oui",
      ediRes: cmbEDI.value,          // CG+/CG-/BG+/BG-
      argListeria: !!fd.get("argListeria"),
      lcsHSV: !!fd.get("lcsHSV"),

      // ME
      focal: !!fd.get("focal"),
      coma: !!fd.get("coma"),
      convuls: !!fd.get("convuls"),
      etio: fd.get("etio") || "",   // oui/non/""

      // ABCES
      porte: cmbPorte.value || "",
      onco: !!fd.get("onco"),
      transp: !!fd.get("transp"),
      vih: !!fd.get("vih"),
      immunAutre: !!fd.get("immunAutre")
    };

    const out = decideNeuro(p);
    document.getElementById("resNeuro").textContent =
      out + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ===== Logique (transposition du VBA) =====
function decideNeuro(p){
  if (p.type==="meningite")   return buildMeningite(p);
  if (p.type==="me")          return buildME(p);
  if (p.type==="abces")       return buildAbces(p);
  return "";
}

// --- Méningite purulente ---
function buildMeningite(p){
  const allerg = p.allergie;
  let S = "", dex = "", addAcyclo = "";

  if (p.lcsHSV) addAcyclo = " +/- Aciclovir 10 mg/kg x3/j IVL (si LCS compatible HSV/VZV)";

  if (p.edi){
    switch (p.ediRes){
      case "CG+":
        if (!allerg) S = "Céfotaxime 300 mg/kg/j IV";
        else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV (ou Méropénème 2 g x3/j IVL) — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
      case "CG-":
        if (!allerg) S = "Céfotaxime 200 mg/kg/j IV";
        else         S = "Ciprofloxacine 800–1200 mg/j + Rifampicine 300 mg x2/j PO/IV — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
      case "BG+":
        if (!allerg) S = "Amoxicilline 200 mg/kg/j IVL + Gentamicine 5 mg/kg IVL (30 min).";
        else         S = "Cotrimoxazole (poso max 100/20 mg/kg/j) — allergie.";
        dex = ""; // pas de dexaméthasone si BG+
        break;
      case "BG-":
        if (!allerg) S = "Céfotaxime 200 mg/kg/j IVL";
        else         S = "Ciprofloxacine 800–1200 mg/j — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
    }
  } else {
    if (!p.argListeria){
      if (!allerg) S = "Céfotaxime 300 mg/kg/j IVL" + addAcyclo + ".";
      else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV" + addAcyclo + " — allergie.";
      dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
    } else {
      if (!allerg) S = "Céfotaxime 300 mg/kg/j + Amoxicilline 200 mg/kg/j" + addAcyclo + ".";
      else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV + Cotrimoxazole (poso max 100/20 mg/kg/j)" + addAcyclo + " — allergie.";
      dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
    }
  }

  return "Méningite purulente aiguë :\n• " + S + (dex || "");
}

// --- Méningo-encéphalite ---
function buildME(p){
  const allerg = p.allergie;
  const grave = !!(p.focal || p.coma || p.convuls);

  let firstLine = grave
    ? "1ère intention : Céfotaxime 300 mg/kg/j IVL + Amoxicilline + Aciclovir + Dexaméthasone + TDM cérébrale en urgence (puis PL si non contre-indiquée)"
    : "1ère intention : Ponction lombaire + TDM cérébrale";

  let detail = "";
  const lOrient = "Si orientation étiologique : traitement spécifique";
  const lSansOrient = "Si pas d’orientation : Aciclovir 10 mg/kg x3/j + Amoxicilline 200 mg/kg/j IVL +/- Céfotaxime si doute";

  if (p.etio === "oui") detail = lOrient;
  else if (p.etio === "non") detail = lSansOrient;

  if (allerg){
    firstLine = firstLine.replace("Céfotaxime 300 mg/kg/j IVL", "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV");
    detail = detail.replace("Amoxicilline 200 mg/kg/j IVL", "Cotrimoxazole (poso max 100/20 mg/kg/j)");
  }

  return "Méningo-encéphalite :\n• " + firstLine + (detail ? "\n• " + detail : "");
}

// --- Abcès cérébral ---
function buildAbces(p){
  const allerg = p.allergie;
  const entree = p.porte || "";
  let S = "", addImmuno = "";
  const immunoPrisEnCompte = !p.immunAutre; // même logique que VBA

  if (!allerg){
    if (entree==="Post-operatoire" || entree==="Traumatique"){
      S = "Méropénème 2 g x2/j (ou Céfépime ou Ceftazidime) + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j IVL/PO.";
    } else {
      S = "Céfotaxime 300 mg/kg/j IVL (ou Ceftriaxone 100 mg/kg/j IVL) + Métronidazole 500 mg x3/j IV/PO.";
    }
  } else {
    S = "Lévofloxacine 500 mg x2/j IVL/PO + Métronidazole 500 mg x3/j IV/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j IVL/PO — allergie.";
  }

  if (immunoPrisEnCompte){
    if (p.onco || p.transp){
      addImmuno += "\n• Ajouter : Cotrimoxazole (poso max 100/20 mg/kg/j) pour Nocardia spp. + Voriconazole 5 mg/kg x2/j IVL pour Aspergillus spp.";
    }
    if (p.vih){
      addImmuno += "\n• Patient VIH : Pyriméthamine-Sulfadiazine (si CD4 < 200) pour T. gondii, + Céfotaxime/Métronidazole si doute +/- quadrithérapie anti-tuberculeuse si gravité et contexte très évocateur.";
    }
  }

  return "Abcès cérébral (ATB idéalement après ponction-aspiration si possible) :\n• " + S + addImmuno;
}

function renderProbaDermohypodermiteForm(){
  $app.innerHTML = `
<!-- Formulaire pour les infections des parties molles -->
<div id="dermohypodermiteForm">
  <fieldset>
    <legend>Type d'infection</legend>
    <label><input type="checkbox" name="optDHNN" value="DHNN"> Dermohypodermite non nécrosante</label>
    <label><input type="checkbox" name="optDHN" value="DHN"> Dermohypodermite nécrosante</label>
    <label><input type="checkbox" name="optFN" value="FN"> Fascite nécrosante</label>
  </fieldset>

  <fieldset>
    <legend>Localisation de l'infection</legend>
    <label><input type="checkbox" name="optMembres" value="Membres"> Membres</label>
    <label><input type="checkbox" name="optCervico" value="Cervico"> Cervico-faciales</label>
    <label><input type="checkbox" name="optAbdomino" value="Abdomino"> Abdomino-périnéales</label>
  </fieldset>

  <fieldset>
    <legend>Facteurs de risque</legend>
    <label><input type="checkbox" name="chkAllergieLeft" value="Allergie"> Allergie aux béta-lactamines</label>
    <label><input type="checkbox" name="chkFDR_SARM_Left" value="SARM"> Facteur de risque SARM</label>
    <label><input type="checkbox" name="chkFDR_BLSE" value="BLSE"> Facteur de risque BLSE</label>
  </fieldset>

  <fieldset>
    <legend>Autres critères</legend>
    <label><input type="checkbox" name="chkMorsure" value="Morsure"> Morsure</label>
    <label><input type="checkbox" name="chkCath" value="Cath"> Point de départ cathéter</label>
  </fieldset>

  <div class="actions">
    <button type="button" class="btn" id="btnDermohypodermite">Antibiothérapie probabiliste recommandée</button>
    <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
  </div>

  <div id="resDermohypodermite" class="result"></div>
</div>
 </form>
  `;

  document.getElementById("btnDermohypodermite").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("dermohypodermiteForm"));
    const params = {
      // Type d'infection
      dhnn: !!fd.get("optDHNN"),
      necrotizing: !!fd.get("optDHN") || !!fd.get("optFN"),

      // Localisation
      membres: !!fd.get("optMembres"),
      cervico: !!fd.get("optCervico"),
      abdomino: !!fd.get("optAbdomino"),

      // Facteurs de risque
      allAllergy: !!fd.get("chkAllergieLeft"),
      fdrSarm: !!fd.get("chkFDR_SARM_Left"),
      fdrBLSE: !!fd.get("chkFDR_BLSE"),

      // Autres critères
      morsure: !!fd.get("chkMorsure"),
      cath: !!fd.get("chkCath")
    };

    // Affichage des données dans la console pour vérification
    console.log("Params envoyés à decideDermohypodermite:", params);

    // Appel à la fonction decideDermohypodermite avec les bons paramètres
    const result = decideDermohypodermite(params);

    // Affichage du résultat
    document.getElementById("resDermohypodermite").textContent = result;
  });
}

// 2. Logique dans decideDermohypodermite pour gérer les infections des parties molles
function decideDermohypodermite(p) {
  let gravite = "Sans signe de gravité";
  if (p.choc) gravite = "Choc septique";
  else if (p.qsofa2 || p.gesteUrg) gravite = "Signes de gravité sans choc (Q-SOFA = 2 et/ou geste urologique urgent)";

  let res = "", notes = "";

  // Traitement pour les Dermohypodermites non nécrosantes
  if (p.dhnn) {
    res = "Dermohypodermite bactérienne non nécrosante (DHBNN)\n";
    if (p.allAllergy) {
      res += "• Allergie ß-lactamines : Pristinamycine 1 g x3/j ou Clindamycine 600 mg x3/j IV/PO.\n";
    } else if (p.morsure) {
      res += "• Morsure : Amoxicilline–acide clavulanique 4–6 g/j IVL.\n";
    } else {
      res += "• Référence : Amoxicilline 4–6 g/j IVL.\n";
    }
    return wrapDermohypodermite(p, res, notes);
  }

  // Traitement pour infections nécrosantes (nosocomiales et communautaires)
  if (p.necrotizing) {
    let loc = p.membres ? "Membres" : p.cervico ? "Cervico-faciales" : "Abdomino-périnéales";
    res = "Infection nécrosante communautaire – Localisation : " + loc + "\n";

    if (p.allAllergy) {
      res += "• Ciprofloxacine 750 mg x2/j IVL/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.\n";
    } else {
      if (p.fdrBLSE) {
        res += "• Méropénème 4–6 g/j IVL.\n";
      } else {
        res += "• Pipéracilline–tazobactam 4 g x4/j IVL + Clindamycine 600 mg x3/j (48 h).\n";
      }
    }
    if (p.fdrSarm) {
      res += "• + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.\n";
    }
    if (p.sepsis) {
      res += "• + Amikacine 25–30 mg/kg IVL 30 min.\n";
    }
    return wrapDermohypodermite(p, res, notes);
  }

  // Si aucune condition spécifique n'est remplie, on retourne un message par défaut
  res = "Veuillez choisir un type d'infection et remplir les critères nécessaires.";
  return wrapDermohypodermite(p, res, notes);
}

// 3. Fonction wrapDermohypodermite pour formater et afficher les résultats
function wrapDermohypodermite(p, res, notes) {
  const lignes = [];
  if (p.allAllergy) lignes.push("Critère : Allergie aux béta-lactamines");
  if (p.fdrSarm) lignes.push("Critère : Facteur de risque SARM");
  if (p.fdrBLSE) lignes.push("Critère : Facteur de risque BLSE");
  if (p.morsure) lignes.push("Critère : Morsure");
  if (p.cath) lignes.push("Critère : Point de départ cathéter");

  return [
    "Infection des parties molles — Décision",
    "Type d'infection : " + (p.dhnn ? "Non nécrosante" : "Nécrosante"),
    "Localisation : " + (p.membres ? "Membres" : p.cervico ? "Cervico-faciales" : "Abdomino-périnéales"),
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
