const session = JSON.parse(localStorage.getItem("pj_session") || "null");
if (!session || session.type !== "candidat")
  window.location.href = "index.html";

if (session) {
  const ini = (
    (session.prenom || "?")[0] + (session.nom || "?")[0]
  ).toUpperCase();
  document.getElementById("uav").textContent = ini;
  document.getElementById("unm").textContent =
    session.prenom + " " + session.nom;
  document.getElementById("f-prenom").value = session.prenom || "";
  document.getElementById("f-nom").value = session.nom || "";
  document.getElementById("f-tel").value = session.tel || "";
  document.getElementById("f-ville").value = session.ville || "";
  document.getElementById("f-poste").value = session.poste || "";
  if (session.niveau)
    document.getElementById("f-niveau").value = session.niveau;
}

function logout() {
  localStorage.removeItem("pj_session");
  window.location.href = "index.html";
}

let cvDone = false,
  lmDone = false;
let currentCandData = {};

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

function handleFileSelect(type, input) {
  if (!input.files || !input.files[0]) return;
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

  // Sauvegarder dans localStorage
  const cands = JSON.parse(localStorage.getItem("pj_cands") || "[]");
  const ini = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  if (!cands.find((c) => c.name === prenom + " " + nom)) {
    cands.unshift({
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
    localStorage.setItem("pj_cands", JSON.stringify(cands));
  }
  goStep(4);
  showToast("Profil soumis avec succès !");
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
