using Microsoft.AspNetCore.Mvc;
using PosteJob.Data;
using PosteJob.Models;

namespace PosteJob.Controllers;

[ApiController]
[Route("api/candidats")]
public class CandidatsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CandidatsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================
    // CREER UN CANDIDAT
    // =========================
    [HttpPost]
    public IActionResult Create(Candidat candidat)
    {
        _context.Candidats.Add(candidat);

        _context.SaveChanges();

        return Ok(candidat);
    }

    // =========================
    // RECUPERER TOUS
    // =========================
    [HttpGet]
    public IActionResult GetAll()
    {
        var candidats = _context.Candidats.ToList();

        return Ok(candidats);
    }

    // =========================
    // RECUPERER PAR ID
    // =========================
    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var candidat = _context.Candidats.FirstOrDefault(x => x.Id == id);

        if (candidat == null)
        {
            return NotFound("Candidat introuvable");
        }

        return Ok(candidat);
    }

    // =========================
    // MODIFIER
    // =========================
    [HttpPut("{id}")]
    public IActionResult Update(Guid id, Candidat data)
    {
        var candidat = _context.Candidats.FirstOrDefault(x => x.Id == id);

        if (candidat == null)
        {
            return NotFound("Candidat introuvable");
        }

        candidat.Telephone = data.Telephone;
        candidat.Ville = data.Ville;
        candidat.Poste = data.Poste;
        candidat.Bio = data.Bio;
        candidat.Experience = data.Experience;
        candidat.Niveau = data.Niveau;
        candidat.Entreprise = data.Entreprise;
        candidat.Competences = data.Competences;
        candidat.CvPath = data.CvPath;
        candidat.LettrePath = data.LettrePath;

        _context.SaveChanges();

        return Ok(candidat);
    }

    // =========================
    // SUPPRIMER
    // =========================
    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var candidat = _context.Candidats.FirstOrDefault(x => x.Id == id);

        if (candidat == null)
        {
            return NotFound("Candidat introuvable");
        }

        _context.Candidats.Remove(candidat);

        _context.SaveChanges();

        return Ok("Candidat supprimé");
    }
}