// ===============================
// POSTEJOB - CANDIDAT.JS (PROPRE)
// ===============================

const API_URL = "http://localhost:5294/api";

// SESSION
const session = JSON.parse(localStorage.getItem("pj_session"));

if (!session) {
  window.location.href = "index.html";
}

// AFFICHAGE USER
document.getElementById("unm").textContent = session.prenom + " " + session.nom;

document.getElementById("uav").textContent =
  session.prenom.charAt(0) + session.nom.charAt(0);

// ===============================
// VARIABLES
// ===============================
let currentStep = 1;
let skills = [];

// ===============================
// NAVIGATION STEPS
// ===============================
function goStep(step) {
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";

  document.getElementById("step" + step).style.display = "block";

  currentStep = step;
  updateSteps();
}

function updateSteps() {
  for (let i = 1; i <= 3; i++) {
    document.getElementById("sn" + i).classList.remove("s-act");
    document.getElementById("sl" + i).classList.remove("s-act");
  }

  for (let i = 1; i <= currentStep; i++) {
    document.getElementById("sn" + i).classList.add("s-act");
    document.getElementById("sl" + i).classList.add("s-act");
  }
}

// ===============================
// SLIDER EXPERIENCE
// ===============================
function updateSlider(value) {
  document.getElementById("exp-num").textContent = value;
  document.getElementById("track-fill").style.width = value * 5 + "%";

  let level = "Junior";
  if (value >= 3) level = "Intermédiaire";
  if (value >= 6) level = "Senior";
  if (value >= 10) level = "Expert";

  document.getElementById("exp-unit").textContent = level;
}

// ===============================
// SKILLS
// ===============================
function addChip(e) {
  if (e.key !== "Enter") return;
  e.preventDefault();

  const input = document.getElementById("chip-inp");
  const value = input.value.trim();
  if (!value) return;

  skills.push(value);
  renderChip(value);
  input.value = "";
}

function renderChip(value) {
  const chip = document.createElement("div");
  chip.className = "chip";

  chip.innerHTML = `
    ${value}
    <span onclick="removeChip('${value}', this)">×</span>
  `;

  const input = document.getElementById("chip-inp");
  document.getElementById("skills-box").insertBefore(chip, input);
}

function removeChip(skill, el) {
  skills = skills.filter((s) => s !== skill);
  el.parentElement.remove();
}

// ===============================
// SUBMIT PROFIL (IMPORTANT)
// ===============================
async function submitProfile() {
  const exp = parseInt(document.getElementById("exp-slider").value);

  let level = "Junior";
  if (exp >= 3) level = "Intermédiaire";
  if (exp >= 6) level = "Senior";
  if (exp >= 10) level = "Expert";

  const candidat = {
    userId: session.id,
    prenom: session.prenom,
    nom: session.nom,

    telephone: document.getElementById("f-tel").value,
    ville: document.getElementById("f-ville").value,
    poste: document.getElementById("f-poste").value,
    bio: document.getElementById("f-bio").value,

    experience: exp,
    niveau: document.getElementById("f-niveau").value,
    entreprise: document.getElementById("f-entreprise").value,

    competences: skills.join(", "),

    cvPath: "",
    lettrePath: "",
  };

  try {
    const res = await fetch(`${API_URL}/candidats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(candidat),
    });

    if (res.ok) {
      showToast("Profil enregistré avec succès");

      document.getElementById("step3").style.display = "none";
      document.getElementById("step-success").style.display = "block";

      document.getElementById("succ-pill").textContent =
        `✦ ${exp} an${exp > 1 ? "s" : ""} · ${level}`;
    } else {
      showToast("Erreur lors de l'enregistrement");
    }
  } catch (err) {
    console.log(err);
    showToast("Erreur serveur");
  }
}

// ===============================
// DOWNLOAD
// ===============================
function downloadFile(name) {
  alert("Téléchargement : " + name);
}

function downloadProfileTxt() {
  const text = `
POSTEJOB - PROFIL

Nom: ${session.nom}
Prénom: ${session.prenom}

Compétences:
${skills.join(", ")}
  `;

  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "profil.txt";
  a.click();
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  localStorage.removeItem("pj_session");
  window.location.href = "index.html";
}

// ===============================
// TOAST
// ===============================
function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toast-msg");

  msg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
