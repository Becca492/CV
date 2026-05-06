// Auth guard
const session = JSON.parse(localStorage.getItem("pj_session") || "null");
if (!session || session.type !== "admin") window.location.href = "index.html";

function logout() {
  localStorage.removeItem("pj_session");
  window.location.href = "index.html";
}

let CANDS = JSON.parse(localStorage.getItem("pj_cands") || "[]");
let ACCOUNTS = JSON.parse(localStorage.getItem("pj_accounts") || "[]");
let sortKey = "exp",
  sortDir = "d";

function saveCands() {
  localStorage.setItem("pj_cands", JSON.stringify(CANDS));
}
function saveAccounts() {
  localStorage.setItem("pj_accounts", JSON.stringify(ACCOUNTS));
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
  // Refresh from storage
  CANDS = JSON.parse(localStorage.getItem("pj_cands") || "[]");
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
    .map((c) => {
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
  saveCands();
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
  const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], {
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

function downloadFile(name) {
  const a = document.createElement("a");
  a.href =
    "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNjIgMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNCAvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDQKJSVFT0Y=";
  a.download = name;
  a.click();
  showToast("Téléchargement : " + name);
}

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
  saveAccounts();
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
  ACCOUNTS = JSON.parse(localStorage.getItem("pj_accounts") || "[]");
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
              <div><div class="acc-name">${a.prenom} ${a.nom}</div><div class="acc-email">${a.email}${a.poste ? " · " + a.poste : ""}</div></div>
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
  saveAccounts();
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
  const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], {
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

// Init
setAdminDate();
renderTable();
renderAccounts();
