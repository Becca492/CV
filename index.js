let CANDS = [];
let ACCOUNTS = [];
let sortKey = "exp",
  sortDir = "d";
let cvDone = false,
  lmDone = false;
let currentCandData = {};

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 3200);
}

function showScreen(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("act"));
  document.getElementById("screen-" + name).classList.add("act");
  if (name === "admin") {
    renderTable();
    renderAccounts();
    setAdminDate();
  }
}

function doLoginCand() {
  const email = document.getElementById("l-email").value.trim();
  if (!email) {
    showToast("Entrez votre adresse e-mail");
    return;
  }

  const acc = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  );
  setUserUI(
    acc ? (acc.prenom[0] + acc.nom[0]).toUpperCase() : email[0].toUpperCase(),
    acc ? acc.prenom + " " + acc.nom : email,
  );
  if (acc) {
    document.getElementById("f-prenom").value = acc.prenom;
    document.getElementById("f-nom").value = acc.nom;
    document.getElementById("f-tel").value = acc.tel || "";
    document.getElementById("f-ville").value = acc.ville || "";
    document.getElementById("f-poste").value = acc.poste || "";
    if (acc.niveau) document.getElementById("f-niveau").value = acc.niveau;
  }
  showScreen("candidat");
  goStep(1);
}

function openAdminModal() {
  document.getElementById("admin-modal").classList.add("open");
}
function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("open");
}
function doLoginAdmin() {
  closeAdminModal();
  setUserUI("RH", "Recruteur RH");
  showScreen("admin");
}

function setUserUI(av, nm) {
  document.getElementById("uinfo").style.display = "flex";
  document.getElementById("btn-logout").style.display = "block";
  document.getElementById("uav").textContent = av;
  document.getElementById("unm").textContent = nm;
}

function logout() {
  document.getElementById("uinfo").style.display = "none";
  document.getElementById("btn-logout").style.display = "none";
  showScreen("login");
}

function goStep(n) {
  ["step1", "step2", "step3", "step-success"].forEach((id, i) => {
    document.getElementById(id).style.display = i + 1 === n ? "block" : "none";
  });
  const bar = document.getElementById("steps-bar");
  bar.style.display = n === 4 ? "none" : "flex";
  [1, 2, 3].forEach((i) => {
    const num = document.getElementById("sn" + i);
    const lbl = document.getElementById("sl" + i);
    const conn = document.getElementById("sc" + i);
    num.className = "s-num";
    lbl.className = "s-lbl";
    if (i < n) {
      num.classList.add("s-done");
      num.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l3 3 5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (i === n) {
      num.classList.add("s-act");
      num.textContent = i;
      lbl.classList.add("s-act");
    } else {
      num.textContent = i;
    }
    if (conn) conn.className = "s-conn" + (i < n ? " s-done" : "");
  });
}

function goBackFromSuccess() {
  document.getElementById("step-success").style.display = "none";
  document.getElementById("steps-bar").style.display = "flex";
  goStep(3);
}

function updateSlider(v) {
  v = parseInt(v);
  document.getElementById("exp-num").textContent = v;
  document.getElementById("exp-unit").textContent =
    v <= 1 ? "an d'expérience" : "ans d'expérience";
  document.getElementById("track-fill").style.width = (v / 20) * 100 + "%";
  const active = v <= 2 ? 0 : v <= 5 ? 1 : v <= 10 ? 2 : 3;
  [
    ["lj", "lj"],
    ["lm", "lm"],
    ["ls", "ls"],
    ["le", "le"],
  ].forEach(([id, cls], i) => {
    document.getElementById(id).className =
      "e-lvl" + (i === active ? " " + cls : "");
  });
}
updateSlider(0);

function addChip(e) {
  if (e.key !== "Enter") return;
  const inp = document.getElementById("chip-inp");
  const val = inp.value.trim();
  if (!val) return;
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML =
    val + ' <button onclick="this.parentElement.remove()">×</button>';
  document.getElementById("skills-box").insertBefore(chip, inp);
  inp.value = "";
  e.preventDefault();
}

function getSkills() {
  return Array.from(document.querySelectorAll("#skills-box .chip"))
    .map((c) => c.textContent.replace("×", "").trim())
    .filter(Boolean);
}

function uploadDoc(type) {
  if (type === "cv") {
    cvDone = true;
    document.getElementById("cv-zone").classList.add("ok");
    document.getElementById("cv-ico").innerHTML =
      '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 11l5 5 8-8" stroke="#25c898" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.getElementById("cv-lbl").textContent = "CV déposé ✓";
    document.getElementById("cv-hint").textContent = "Cliquez pour remplacer";
  } else {
    lmDone = true;
    document.getElementById("lm-zone").classList.add("ok");
    document.getElementById("lm-ico").innerHTML =
      '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9l4 4 7-7" stroke="#25c898" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.getElementById("lm-lbl").textContent = "Lettre déposée ✓";
  }
}

function submitProfile() {
  const expVal = parseInt(document.getElementById("exp-slider").value);
  const expLbl =
    expVal <= 2
      ? "Junior"
      : expVal <= 5
        ? "Intermédiaire"
        : expVal <= 10
          ? "Senior"
          : "Expert";
  const prenom = document.getElementById("f-prenom").value || "Candidat";
  const nom = document.getElementById("f-nom").value || "";
  const poste = document.getElementById("f-poste").value || "Non précisé";
  const ville = document.getElementById("f-ville").value || "";
  const niveau = document.getElementById("f-niveau").value || "";
  const skills = getSkills();

  currentCandData = {
    prenom,
    nom,
    poste,
    ville,
    niveau,
    skills,
    exp: expVal,
    expLbl,
    tel: document.getElementById("f-tel").value,
    bio: document.getElementById("f-bio").value,
    entreprise: document.getElementById("f-entreprise").value,
    cvJoint: cvDone,
    lmJoint: lmDone,
    date: new Date().toLocaleDateString("fr-CI", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  document.getElementById("succ-pill").textContent =
    `✦ ${expVal} an${expVal > 1 ? "s" : ""} · ${expLbl}`;
  if (lmDone) document.getElementById("dl-lm-card").style.display = "flex";

  const ini = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  if (!CANDS.find((c) => c.name === prenom + " " + nom)) {
    CANDS.unshift({
      ini,
      name: prenom + " " + nom,
      role: poste,
      city: ville,
      exp: expVal,
      niveau,
      skills: skills.length ? skills : [],
      status: "Nouveau",
      cv: cvDone,
      lm: lmDone,
      bg: "rgba(212,168,67,.15)",
      tc: "#d4a843",
      date: Date.now(),
    });
  }
  updateHeroStat();
  goStep(4);
  showToast("Profil soumis avec succès !");
}

function updateHeroStat() {
  const el = document.getElementById("stat-total");
  if (el) el.textContent = CANDS.length;
}

function downloadFile(name) {
  const a = document.createElement("a");
  a.href =
    "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNjIgMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNCAvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDQKJSVFT0Y=";
  a.download = name;
  a.click();
  showToast("Téléchargement : " + name);
}

function downloadProfileTxt() {
  const d = currentCandData;
  const txt = `FICHE CANDIDAT — TalentCI\n${"═".repeat(40)}
NOM COMPLET    : ${d.prenom} ${d.nom}
POSTE SOUHAITÉ : ${d.poste}
TÉLÉPHONE      : ${d.tel || "Non renseigné"}
VILLE          : ${d.ville || "Non renseignée"}
EXPÉRIENCE     : ${d.exp} an${d.exp > 1 ? "s" : ""} — ${d.expLbl}
FORMATION      : ${d.niveau || "Non précisé"}
DERNIÈRE ENTR. : ${d.entreprise || "Non précisé"}
COMPÉTENCES    : ${d.skills.join(", ") || "Non précisées"}
CV JOINT       : ${d.cvJoint ? "Oui" : "Non"}
LETTRE         : ${d.lmJoint ? "Oui" : "Non"}
${"─".repeat(40)}
PRÉSENTATION
${d.bio || "—"}
${"═".repeat(40)}
Soumis le : ${d.date}
Plateforme : TalentCI — Côte d'Ivoire`;
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Fiche_${d.prenom}_${d.nom}_TalentCI.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("Fiche téléchargée !");
}

function adminTab(name) {
  ["candidats", "inscrire", "comptes"].forEach((t) => {
    document.getElementById("tab-" + t).style.display =
      t === name ? "block" : "none";
    document.getElementById("sbi-" + t).classList.toggle("act", t === name);
  });
  if (name === "comptes") renderAccounts();
  if (name === "candidats") renderTable();
}

function expKey(e) {
  return e <= 2 ? "j" : e <= 5 ? "m" : e <= 10 ? "s" : "e";
}
function expBadge(e) {
  return e <= 2 ? "eb-j" : e <= 5 ? "eb-m" : e <= 10 ? "eb-s" : "eb-e";
}
function expLbl(e) {
  return e <= 2
    ? "Junior"
    : e <= 5
      ? "Intermédiaire"
      : e <= 10
        ? "Senior"
        : "Expert";
}
function stCls(s) {
  return s === "Nouveau" ? "st-n" : s === "En review" ? "st-r" : "st-a";
}
function score(c) {
  return Math.min(
    100,
    Math.round((c.exp / 15) * 60 + (c.cv ? 25 : 0) + (c.lm ? 15 : 0)),
  );
}
function scoreColor(s) {
  return s >= 70 ? "#97c459" : s >= 50 ? "#ef9f27" : "#e05252";
}

function setSort(k, d) {
  sortKey = k;
  sortDir = d;
  document.querySelectorAll(".sp").forEach((p) => p.classList.remove("act"));
  const map = {
    "exp-d": "sp-ed",
    "exp-a": "sp-ea",
    "name-a": "sp-n",
    "date-d": "sp-d",
  };
  const el = document.getElementById(map[k + "-" + d] || map[k + "-a"]);
  if (el) el.classList.add("act");
  renderTable();
}

function renderTable() {
  const q = (document.getElementById("a-search").value || "").toLowerCase();
  const fs = document.getElementById("a-status").value;
  const fe = document.getElementById("a-exp").value;
  let data = CANDS.filter((c) => {
    if (
      q &&
      !c.name.toLowerCase().includes(q) &&
      !c.role.toLowerCase().includes(q) &&
      !(c.skills || []).some((s) => s.toLowerCase().includes(q)) &&
      !c.city.toLowerCase().includes(q)
    )
      return false;
    if (fs && c.status !== fs) return false;
    if (fe && expKey(c.exp) !== fe) return false;
    return true;
  });
  data.sort((a, b) => {
    if (sortKey === "exp")
      return sortDir === "d" ? b.exp - a.exp : a.exp - b.exp;
    if (sortKey === "name") return a.name.localeCompare(b.name, "fr");
    return b.date - a.date;
  });
  const avg = data.length
    ? Math.round(data.reduce((s, c) => s + c.exp, 0) / data.length)
    : null;
  document.getElementById("m-total").textContent = CANDS.length;
  document.getElementById("m-avg").textContent =
    avg !== null ? avg + " ans" : "—";
  document.getElementById("m-sub").textContent =
    data.length < CANDS.length ? "(" + data.length + " filtrés)" : "";
  document.getElementById("m-cv").textContent = CANDS.filter(
    (c) => c.cv,
  ).length;
  document.getElementById("m-acc").textContent = CANDS.filter(
    (c) => c.status === "Accepté",
  ).length;
  document.getElementById("a-count").textContent =
    data.length + " profil" + (data.length !== 1 ? "s" : "");

  const tbody = document.getElementById("a-tbody");
  if (!data.length) {
    tbody.innerHTML =
      '<tr class="empty-row"><td colspan="8">Aucune candidature pour l\'instant. Les profils soumis apparaîtront ici automatiquement.</td></tr>';
    return;
  }
  tbody.innerHTML = data
    .map((c, idx) => {
      const sc = score(c);
      const ri = CANDS.indexOf(c);
      return `<tr>
      <td><div class="av-cell">
        <div class="av" style="background:${c.bg};color:${c.tc}">${c.ini}</div>
        <div><div class="cand-name-cell">${c.name}</div><div class="cand-city-cell">${c.city}${c.niveau ? " · " + c.niveau : ""}</div></div>
      </div></td>
      <td style="color:var(--text2);font-size:12px;max-width:130px">${c.role}</td>
      <td><span class="ebadge ${expBadge(c.exp)}">${c.exp}a · ${expLbl(c.exp)}</span></td>
      <td><div style="display:flex;flex-wrap:wrap;gap:3px">
        ${(c.skills || [])
          .slice(0, 3)
          .map(
            (s) =>
              `<span style="padding:2px 7px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:11px;color:var(--text3)">${s}</span>`,
          )
          .join("")}
        ${(c.skills || []).length > 3 ? `<span style="padding:2px 7px;background:var(--bg3);border:1px solid var(--line);border-radius:4px;font-size:11px;color:var(--text3)">+${c.skills.length - 3}</span>` : ""}
      </div></td>
      <td><div class="score-row">
        <div class="score-bar"><div class="score-fill" style="width:${sc}%;background:${scoreColor(sc)}"></div></div>
        <span class="score-num" style="color:${scoreColor(sc)}">${sc}</span>
      </div></td>
      <td><select class="status-sel" onchange="changeStatus(${ri},this.value)">
        <option${c.status === "Nouveau" ? " selected" : ""}>Nouveau</option>
        <option${c.status === "En review" ? " selected" : ""}>En review</option>
        <option${c.status === "Accepté" ? " selected" : ""}>Accepté</option>
      </select></td>
      <td><div class="doc-cell">
        <button class="doc-btn${c.cv ? " has" : ""}" onclick="${c.cv ? `downloadFile('CV_${c.name.replace(/ /g, "_")}.pdf')` : `showToast('Pas de CV déposé')`}">${c.cv ? "↓ CV" : "— CV"}</button>
        ${c.lm ? `<button class="doc-btn has" onclick="downloadFile('LM_${c.name.replace(/ /g, "_")}.pdf')">↓ LM</button>` : ""}
      </div></td>
      <td><button class="btn-fiche" onclick="exportFiche(${ri})">⬇ Fiche</button></td>
    </tr>`;
    })
    .join("");
}

function changeStatus(idx, val) {
  CANDS[idx].status = val;
  renderTable();
}

function exportCSV() {
  if (!CANDS.length) {
    showToast("Aucune candidature à exporter");
    return;
  }
  const header =
    "Nom,Poste,Ville,Expérience (ans),Niveau,Compétences,Statut,CV,Lettre";
  const rows = CANDS.map((c) =>
    [
      `"${c.name}"`,
      `"${c.role}"`,
      `"${c.city}"`,
      c.exp,
      `"${c.niveau || ""}"`,
      `"${(c.skills || []).join("; ")}"`,
      c.status,
      c.cv ? "Oui" : "Non",
      c.lm ? "Oui" : "Non",
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "candidatures_TalentCI.csv";
  a.click();
  showToast("Export CSV téléchargé !");
}

function exportFiche(idx) {
  const c = CANDS[idx];
  const txt = `FICHE CANDIDAT — TalentCI\n${"═".repeat(38)}
NOM            : ${c.name}
POSTE          : ${c.role}
VILLE          : ${c.city}
EXPÉRIENCE     : ${c.exp} an${c.exp > 1 ? "s" : ""} — ${expLbl(c.exp)}
NIVEAU         : ${c.niveau || "Non précisé"}
COMPÉTENCES    : ${(c.skills || []).join(", ") || "—"}
STATUT         : ${c.status}
CV JOINT       : ${c.cv ? "Oui" : "Non"}
LETTRE         : ${c.lm ? "Oui" : "Non"}
${"═".repeat(38)}`;
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Fiche_" + c.name.replace(/ /g, "_") + ".txt";
  a.click();
  showToast("Fiche exportée !");
}
/* ── INSCRIPTION CANDIDAT ── */
function openRegisterModal() {
  document.getElementById("register-modal").classList.add("open");
}

function closeRegisterModal() {
  document.getElementById("register-modal").classList.remove("open");
}

function doRegister() {
  const prenom = document.getElementById("reg-prenom").value.trim();
  const nom = document.getElementById("reg-nom").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (!prenom || !nom || !email || !pass) {
    showToast("Tous les champs sont obligatoires");
    return;
  }
  if (ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
    showToast("Un compte existe déjà avec cet email");
    return;
  }

  // Créer le compte
  ACCOUNTS.push({ prenom, nom, email, pass, date: Date.now() });

  // Pré-remplir et rediriger vers le formulaire
  document.getElementById("f-prenom").value = prenom;
  document.getElementById("f-nom").value = nom;
  setUserUI((prenom[0] + nom[0]).toUpperCase(), prenom + " " + nom);

  closeRegisterModal();
  showScreen("candidat");
  goStep(1);
  showToast("Compte créé ! Complétez votre profil.");
}

/* ── INSCRIRE UN CANDIDAT ── */
function creerCompte() {
  const prenom = document.getElementById("r-prenom").value.trim();
  const nom = document.getElementById("r-nom").value.trim();
  const email = document.getElementById("r-email").value.trim();
  if (!prenom || !nom || !email) {
    showToast("Prénom, nom et email sont requis");
    return;
  }
  if (ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
    showToast("Ce compte existe déjà");
    return;
  }
  ACCOUNTS.push({
    prenom,
    nom,
    email,
    tel: document.getElementById("r-tel").value.trim(),
    ville: document.getElementById("r-ville").value.trim(),
    poste: document.getElementById("r-poste").value,
    niveau: document.getElementById("r-niveau").value,
    pass: document.getElementById("r-pass").value.trim(),
    date: Date.now(),
  });
  ["r-prenom", "r-nom", "r-email", "r-tel", "r-ville", "r-pass"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("r-poste").value = "";
  document.getElementById("r-niveau").value = "";
  showToast("Compte créé pour " + prenom + " " + nom + " !");
  renderAccounts();
  setTimeout(() => adminTab("comptes"), 900);
}

function renderAccounts() {
  const list = document.getElementById("accounts-list");
  if (!ACCOUNTS.length) {
    list.innerHTML =
      '<div class="empty-accs">Aucun compte créé. Utilisez l\'onglet "Inscrire un candidat".</div>';
    return;
  }
  list.innerHTML = ACCOUNTS.map(
    (a, i) => `
    <div class="acc-row">
      <div class="acc-info">
        <div class="acc-av">${a.prenom[0]}${a.nom[0]}</div>
        <div>
          <div class="acc-name">${a.prenom} ${a.nom}</div>
          <div class="acc-email">${a.email}${a.poste ? " · " + a.poste : ""}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="acc-badge">Candidat</span>
        <button class="btn-del" onclick="supprimerCompte(${i})">Supprimer</button>
      </div>
    </div>`,
  ).join("");
}

function supprimerCompte(i) {
  const nom = ACCOUNTS[i].prenom + " " + ACCOUNTS[i].nom;
  ACCOUNTS.splice(i, 1);
  renderAccounts();
  showToast("Compte de " + nom + " supprimé");
}

function exportComptes() {
  if (!ACCOUNTS.length) {
    showToast("Aucun compte à exporter");
    return;
  }
  const header = "Prénom,Nom,Email,Téléphone,Ville,Poste,Niveau";
  const rows = ACCOUNTS.map((a) =>
    [
      `"${a.prenom}"`,
      `"${a.nom}"`,
      a.email,
      a.tel || "",
      a.ville || "",
      `"${a.poste || ""}"`,
      `"${a.niveau || ""}"`,
    ].join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "comptes_candidats_TalentCI.csv";
  a.click();
  showToast("Liste exportée !");
}

function setAdminDate() {
  const d = new Date();
  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const el = document.getElementById("admin-date");
  if (el)
    el.textContent =
      days[d.getDay()] +
      " " +
      d.getDate() +
      " " +
      months[d.getMonth()] +
      " " +
      d.getFullYear();
}

updateHeroStat();
