// ===============================
// POSTEJOB - INDEX.JS
// ===============================

const API_URL = "http://localhost:5294/api";

// ===============================
// STATS
// ===============================
async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/candidats`);
    if (!res.ok) return;
    const candidats = await res.json();
    document.getElementById("stat-total").textContent = candidats.length;
  } catch (err) {
    console.log(err);
  }
}
loadStats();

// ===============================
// LOGIN CANDIDAT → profil direct
// ===============================
async function doLoginCand() {
  const email = document.getElementById("l-email").value.trim();
  const pass = document.getElementById("l-pass").value.trim();

  if (!email || !pass) {
    showToast("Veuillez remplir tous les champs");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash: pass }),
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem("pj_session", JSON.stringify(user));
      showToast("Bienvenue " + user.prenom + " !");
      setTimeout(() => {
        window.location.href = "candidat.html";
      }, 800);
    } else {
      showToast("Email ou mot de passe incorrect");
    }
  } catch (error) {
    console.log(error);
    showToast("Erreur serveur");
  }
}

// ===============================
// ADMIN
// ===============================
function openAdminModal() {
  document.getElementById("admin-modal").classList.add("open");
}
function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("open");
}
function doLoginAdmin() {
  const email = document.getElementById("adm-email").value;
  const pass = document.getElementById("adm-pass").value;
  if (email === "admin@talentci.ci" && pass.length > 0) {
    localStorage.setItem(
      "pj_session",
      JSON.stringify({ type: "admin", prenom: "Recruteur", nom: "RH" }),
    );
    window.location.href = "admin.html";
  } else {
    showToast("Accès refusé");
  }
}

// ===============================
// MODAL INSCRIPTION MULTI-ÉTAPES
// ===============================
let regStep = 1;
let regSkills = [];

function openRegisterModal() {
  regStep = 1;
  regSkills = [];
  document.getElementById("register-modal").classList.add("open");
  showRegStep(1);
}
function closeRegisterModal() {
  document.getElementById("register-modal").classList.remove("open");
}

function showRegStep(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById("reg-step-" + i);
    if (el) el.style.display = i === step ? "block" : "none";
  }
  // update progress bar
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById("reg-dot-" + i);
    if (!dot) continue;
    dot.classList.remove("reg-dot-act", "reg-dot-done");
    if (i < step) dot.classList.add("reg-dot-done");
    else if (i === step) dot.classList.add("reg-dot-act");
  }
  regStep = step;
}

function regNext() {
  if (regStep === 1) {
    const prenom = document.getElementById("reg-prenom").value.trim();
    const nom = document.getElementById("reg-nom").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value.trim();
    if (!prenom || !nom || !email || !pass) {
      showToast("Tous les champs sont obligatoires");
      return;
    }
  }
  if (regStep < 3) showRegStep(regStep + 1);
}

function regBack() {
  if (regStep > 1) showRegStep(regStep - 1);
}

// Slider inside modal
function updateRegSlider(value) {
  document.getElementById("reg-exp-num").textContent = value;
  document.getElementById("reg-track-fill").style.width = value * 5 + "%";
  let level = "Junior";
  if (value >= 3) level = "Intermédiaire";
  if (value >= 6) level = "Senior";
  if (value >= 10) level = "Expert";
  document.getElementById("reg-exp-unit").textContent = level;
}

// Chips inside modal
function addRegChip(e) {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const input = document.getElementById("reg-chip-inp");
  const value = input.value.trim();
  if (!value) return;
  regSkills.push(value);
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.innerHTML = `${value}<span onclick="removeRegChip('${value}', this)">×</span>`;
  document.getElementById("reg-skills-box").insertBefore(chip, input);
  input.value = "";
}
function removeRegChip(skill, el) {
  regSkills = regSkills.filter((s) => s !== skill);
  el.parentElement.remove();
}

// ===============================
// SOUMISSION INSCRIPTION COMPLÈTE
// ===============================
async function doRegister() {
  const prenom = document.getElementById("reg-prenom").value.trim();
  const nom = document.getElementById("reg-nom").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (!prenom || !nom || !email || !pass) {
    showToast("Informations de compte manquantes");
    return;
  }

  // 1. Créer le compte
  try {
    const resAuth = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom,
        nom,
        email,
        passwordHash: pass,
        role: "candidat",
      }),
    });

    if (!resAuth.ok) {
      const err = await resAuth.text();
      showToast(err || "Erreur lors de la création du compte");
      return;
    }

    const user = await resAuth.json();
    localStorage.setItem("pj_session", JSON.stringify(user));

    // 2. Enregistrer le profil complet
    const exp = parseInt(document.getElementById("reg-exp-slider").value) || 0;
    const candidat = {
      userId: user.id,
      prenom: user.prenom,
      nom: user.nom,
      telephone: document.getElementById("reg-tel").value.trim(),
      ville: document.getElementById("reg-ville").value.trim(),
      poste: document.getElementById("reg-poste").value.trim(),
      bio: document.getElementById("reg-bio").value.trim(),
      experience: exp,
      niveau: document.getElementById("reg-niveau").value,
      entreprise: document.getElementById("reg-entreprise").value.trim(),
      competences: regSkills.join(", "),
    };

    const resCand = await fetch(`${API_URL}/candidats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidat),
    });

    if (resCand.ok) {
      closeRegisterModal();
      showToast("Compte créé ! Bienvenue " + prenom + " 🎉");
      setTimeout(() => {
        window.location.href = "candidat.html";
      }, 900);
    } else {
      showToast(
        "Compte créé mais erreur profil. Connectez-vous pour compléter.",
      );
      setTimeout(() => {
        window.location.href = "candidat.html";
      }, 1200);
    }
  } catch (error) {
    console.log(error);
    showToast("Erreur serveur");
  }
}

// ===============================
// TOAST
// ===============================
function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toast-msg");
  msg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
