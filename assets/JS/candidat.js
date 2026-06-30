// ===============================
// POSTEJOB - CANDIDAT.JS
// ===============================

const API_URL = "http://localhost:5294/api";

// ===============================
// SESSION
// ===============================
const session = JSON.parse(localStorage.getItem("pj_session"));

if (!session) {
  window.location.href = "index.html";
}

// ===============================
// USER NAVBAR
// ===============================
document.getElementById("unm").textContent = session.prenom + " " + session.nom;

document.getElementById("uav").textContent =
  session.prenom.charAt(0) + session.nom.charAt(0);

// ===============================
// VARIABLES
// ===============================
let currentProfil = null;

let skills = [];

// ===============================
// LOAD PROFIL
// ===============================
async function loadProfil() {
  try {
    const res = await fetch(`${API_URL}/candidats/${session.id}`);

    if (res.ok) {
      currentProfil = await res.json();

      renderProfil(currentProfil);
    } else {
      renderNoProfil();
    }
  } catch (err) {
    console.log(err);

    renderNoProfil();
  }
}

// ===============================
// RENDER PROFIL
// ===============================
function renderProfil(p) {
  const exp = p.experience || 0;

  const level = getLevel(exp);

  const chips = p.competences
    ? p.competences
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<span class="chip-ro">${s}</span>`)
        .join("")
    : `<span class="chip-empty">
         Aucune compétence
       </span>`;

  document.getElementById("profil-view").innerHTML = `

    <div class="profil-edit-btn">
      <button class="btn-edit" onclick="openEdit()">
        Modifier mon profil
      </button>
    </div>

    <div class="profil-header">

      <div class="profil-avatar">
        ${session.prenom.charAt(0)}
        ${session.nom.charAt(0)}
      </div>

      <div class="profil-header-right">

        <div class="profil-name">
          ${p.prenom} ${p.nom}
        </div>

        <div class="profil-poste">
          ${p.poste || "Poste non renseigné"}
        </div>

        <div class="profil-badges">

          <span class="badge badge-level">
            ✦ ${level}
          </span>

          ${
            p.ville
              ? `<span class="badge badge-info">
                  📍 ${p.ville}
                </span>`
              : ""
          }

          ${
            p.telephone
              ? `<span class="badge badge-info">
                  📞 ${p.telephone}
                </span>`
              : ""
          }

        </div>
      </div>
    </div>

    <div class="pcard">

      <div class="pcard-title">
        Présentation
      </div>

      <p class="pcard-bio">
        ${p.bio || "Aucune présentation"}
      </p>

    </div>

    <div class="pcard">

      <div class="pcard-title">
        Informations
      </div>

      <div class="info-grid">

        <div class="info-item">
          <label>Niveau</label>
          <span>${p.niveau || "-"}</span>
        </div>

        <div class="info-item">
          <label>Entreprise</label>
          <span>${p.entreprise || "-"}</span>
        </div>

      </div>
    </div>

    <div class="pcard">

      <div class="pcard-title">
        Expérience
      </div>

      <div class="exp-num-big">
        ${exp} an(s)
      </div>

    </div>

    <div class="pcard">

      <div class="pcard-title">
        Compétences
      </div>

      <div class="chips-list">
        ${chips}
      </div>

    </div>
  `;
}

// ===============================
// OPEN EDIT
// ===============================
function openEdit() {
  const p = currentProfil;

  document.getElementById("e-tel").value = p.telephone || "";

  document.getElementById("e-ville").value = p.ville || "";

  document.getElementById("e-poste").value = p.poste || "";

  document.getElementById("e-bio").value = p.bio || "";

  document.getElementById("e-niveau").value = p.niveau || "";

  document.getElementById("e-entreprise").value = p.entreprise || "";

  document.getElementById("exp-slider").value = p.experience || 0;

  updateSlider(p.experience || 0);

  // compétences
  skills = p.competences
    ? p.competences
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const box = document.getElementById("skills-box");

  const inp = document.getElementById("chip-inp");

  Array.from(box.children).forEach((c) => {
    if (c !== inp) c.remove();
  });

  skills.forEach((s) => renderChip(s));

  document.getElementById("profil-view").style.display = "none";

  document.getElementById("edit-view").style.display = "block";
}

// ===============================
// CANCEL EDIT
// ===============================
function cancelEdit() {
  document.getElementById("edit-view").style.display = "none";

  document.getElementById("profil-view").style.display = "block";
}

// ===============================
// SLIDER
// ===============================
function updateSlider(value) {
  document.getElementById("exp-num").textContent = value;

  document.getElementById("track-fill").style.width = value * 5 + "%";

  document.getElementById("exp-unit").textContent = getLevel(value);
}

// ===============================
// CHIPS
// ===============================
function addChip(e) {
  if (e.key !== "Enter") return;

  e.preventDefault();

  const inp = document.getElementById("chip-inp");

  const val = inp.value.trim();

  if (!val) return;

  skills.push(val);

  renderChip(val);

  inp.value = "";
}

function renderChip(value) {
  const chip = document.createElement("div");

  chip.className = "chip";

  chip.innerHTML = `
    ${value}
    <button
      type="button"
      onclick="removeChip('${value}', this)">
      ×
    </button>
  `;

  document
    .getElementById("skills-box")
    .insertBefore(chip, document.getElementById("chip-inp"));
}

function removeChip(skill, el) {
  skills = skills.filter((s) => s !== skill);

  el.parentElement.remove();
}

// ===============================
// SAVE PROFILE
// ===============================
async function saveProfile() {
  const updated = {
    userId: session.id,

    prenom: currentProfil.prenom,

    nom: currentProfil.nom,

    telephone: document.getElementById("e-tel").value.trim(),

    ville: document.getElementById("e-ville").value.trim(),

    poste: document.getElementById("e-poste").value.trim(),

    bio: document.getElementById("e-bio").value.trim(),

    experience: parseInt(document.getElementById("exp-slider").value),

    niveau: document.getElementById("e-niveau").value,

    entreprise: document.getElementById("e-entreprise").value.trim(),

    competences: skills.join(", "),
  };

  try {
    const res = await fetch(`${API_URL}/candidats/${session.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(updated),
    });

    if (res.ok) {
      currentProfil = {
        ...currentProfil,
        ...updated,
      };

      renderProfil(currentProfil);

      cancelEdit();

      showToast("Profil mis à jour");
    } else {
      const err = await res.text();

      console.log(err);

      showToast("Erreur lors de la mise à jour");
    }
  } catch (err) {
    console.log(err);

    showToast("Erreur serveur");
  }
}

// ===============================
// HELPERS
// ===============================
function getLevel(exp) {
  if (exp >= 10) return "Expert";

  if (exp >= 6) return "Senior";

  if (exp >= 3) return "Intermédiaire";

  return "Junior";
}

function renderNoProfil() {
  document.getElementById("profil-view").innerHTML = `
    <div class="no-profil">

      <h2>
        Profil introuvable
      </h2>

      <p>
        Aucun profil trouvé.
      </p>

    </div>
  `;
}

function logout() {
  localStorage.removeItem("pj_session");

  window.location.href = "index.html";
}

function showToast(msg) {
  const toast = document.getElementById("toast");

  document.getElementById("toast-msg").textContent = msg;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===============================
// START
// ===============================
loadProfil();
