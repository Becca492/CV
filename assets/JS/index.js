const API_URL = "http://localhost:5294/api";

// ===============================
// STATS
// ===============================
async function loadStats() {
  try {
    const res = await fetch(`${API_URL}/candidats`);

    if (!res.ok) return;

    const candidats = await res.json();

    const stat = document.getElementById("stat-total");

    if (stat) {
      stat.textContent = candidats.length;
    }
  } catch (err) {
    console.log(err);
  }
}

loadStats();

// ===============================
// LOGIN CANDIDAT
// ===============================
async function doLoginCand() {
  const emailEl = document.getElementById("l-email");
  const passEl = document.getElementById("l-pass");

  if (!emailEl || !passEl) {
    alert("Champs login introuvables");
    return;
  }

  const email = emailEl.value.trim();
  const pass = passEl.value.trim();

  if (!email || !pass) {
    showToast("Veuillez remplir tous les champs");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        passwordHash: pass,
      }),
    });

    if (res.ok) {
      const user = await res.json();

      localStorage.setItem("pj_session", JSON.stringify(user));

      showToast("Connexion réussie");

      setTimeout(() => {
        window.location.href = "candidat.html";
      }, 800);
    } else {
      showToast("Email ou mot de passe incorrect");
    }
  } catch (err) {
    console.log(err);

    showToast("Erreur serveur");
  }
}

// ===============================
// ADMIN
// ===============================
function openAdminModal() {
  const modal = document.getElementById("admin-modal");

  if (modal) {
    modal.classList.add("open");
  }
}

function closeAdminModal() {
  const modal = document.getElementById("admin-modal");

  if (modal) {
    modal.classList.remove("open");
  }
}

function doLoginAdmin() {
  const emailEl = document.getElementById("adm-email");
  const passEl = document.getElementById("adm-pass");

  if (!emailEl || !passEl) return;

  const email = emailEl.value.trim();
  const pass = passEl.value.trim();

  if (email === "admin@talentci.ci" && pass.length > 0) {
    localStorage.setItem(
      "pj_session",
      JSON.stringify({
        type: "admin",
        prenom: "Recruteur",
        nom: "RH",
      }),
    );

    window.location.href = "admin.html";
  } else {
    showToast("Accès refusé");
  }
}

// ===============================
// REGISTER MODAL
// ===============================
let regStep = 1;
let regSkills = [];

function openRegisterModal() {
  regStep = 1;

  regSkills = [];

  const modal = document.getElementById("register-modal");

  if (modal) {
    modal.classList.add("open");
  }

  showRegStep(1);
}

function closeRegisterModal() {
  const modal = document.getElementById("register-modal");

  if (modal) {
    modal.classList.remove("open");
  }
}

function showRegStep(step) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById("reg-step-" + i);

    if (el) {
      el.style.display = i === step ? "block" : "none";
    }
  }

  regStep = step;
}

function regNext() {
  if (regStep < 3) {
    showRegStep(regStep + 1);
  }
}

function regBack() {
  if (regStep > 1) {
    showRegStep(regStep - 1);
  }
}

// ===============================
// REGISTER
// ===============================
async function doRegister() {
  const prenomEl = document.getElementById("reg-prenom");
  const nomEl = document.getElementById("reg-nom");
  const emailEl = document.getElementById("reg-email");
  const passEl = document.getElementById("reg-pass");

  if (!prenomEl || !nomEl || !emailEl || !passEl) {
    showToast("Champs introuvables");

    return;
  }

  const prenom = prenomEl.value.trim();
  const nom = nomEl.value.trim();
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();

  if (!prenom || !nom || !email || !pass) {
    showToast("Veuillez remplir tous les champs");

    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        prenom: prenom,
        nom: nom,
        email: email,
        passwordHash: pass,
        role: "candidat",
      }),
    });

    if (res.ok) {
      const user = await res.json();

      localStorage.setItem("pj_session", JSON.stringify(user));

      showToast("Compte créé avec succès");

      setTimeout(() => {
        window.location.href = "inscription-candidat.html";
      }, 1000);
    } else {
      const err = await res.text();

      showToast(err);
    }
  } catch (err) {
    console.log(err);

    showToast("Erreur serveur");
  }
}

// ===============================
// TOAST
// ===============================
function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toast-msg");

  if (!toast || !msg) {
    alert(message);
    return;
  }

  msg.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
