// Afficher le nb de profils depuis localStorage
const cands = JSON.parse(localStorage.getItem("pj_cands") || "[]");
document.getElementById("stat-total").textContent = cands.length;

function doLoginCand() {
  const email = document.getElementById("l-email").value.trim();
  const pass = document.getElementById("l-pass").value.trim();
  if (!email || !pass) {
    showToast("Veuillez remplir l'email et le mot de passe");
    return;
  }
  const accounts = JSON.parse(localStorage.getItem("pj_accounts") || "[]");
  const acc = accounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase(),
  );
  if (!acc) {
    showToast("❌ Aucun compte trouvé avec cet email.");
    document.getElementById("l-email").style.borderColor =
      "rgba(224,82,82,0.6)";
    setTimeout(
      () => (document.getElementById("l-email").style.borderColor = ""),
      2500,
    );
    return;
  }
  if (acc.pass && acc.pass !== pass) {
    showToast("❌ Mot de passe incorrect");
    document.getElementById("l-pass").style.borderColor = "rgba(224,82,82,0.6)";
    setTimeout(
      () => (document.getElementById("l-pass").style.borderColor = ""),
      2500,
    );
    return;
  }
  localStorage.setItem(
    "pj_session",
    JSON.stringify({ type: "candidat", ...acc }),
  );
  showToast("Bienvenue " + acc.prenom + " !");
  setTimeout(() => (window.location.href = "candidat.html"), 800);
}

function openAdminModal() {
  document.getElementById("admin-modal").classList.add("open");
}
function closeAdminModal() {
  document.getElementById("admin-modal").classList.remove("open");
}
function doLoginAdmin() {
  localStorage.setItem(
    "pj_session",
    JSON.stringify({ type: "admin", prenom: "Recruteur", nom: "RH" }),
  );
  window.location.href = "admin.html";
}

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
  const accounts = JSON.parse(localStorage.getItem("pj_accounts") || "[]");
  if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
    showToast("Un compte existe déjà avec cet email");
    return;
  }
  accounts.push({ prenom, nom, email, pass, date: Date.now() });
  localStorage.setItem("pj_accounts", JSON.stringify(accounts));
  localStorage.setItem(
    "pj_session",
    JSON.stringify({ type: "candidat", prenom, nom, email, pass }),
  );
  closeRegisterModal();
  showToast("Compte créé ! Complétez votre profil.");
  setTimeout(() => (window.location.href = "candidat.html"), 900);
}
