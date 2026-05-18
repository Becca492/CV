using Microsoft.AspNetCore.Mvc;
using PosteJob.Data;
using PosteJob.Models;

namespace PosteJob.Controllers;

[ApiController]
[Route("api/candidatures")]
public class CandidatureController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CandidatureController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================
    // AJOUTER UNE CANDIDATURE
    // =========================
    [HttpPost]
    public IActionResult Create(Candidature candidature)
    {
        _context.Candidatures.Add(candidature);

        _context.SaveChanges();

        return Ok(candidature);
    }

    // =========================
    // LISTE DES CANDIDATURES
    // =========================
    [HttpGet]
    public IActionResult GetAll()
    {
        var candidatures = _context.Candidatures
            .OrderByDescending(c => c.CreatedAt)
            .ToList();

        return Ok(candidatures);
    }

    // =========================
    // UNE CANDIDATURE
    // =========================
    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var candidature = _context.Candidatures
            .FirstOrDefault(c => c.Id == id);

        if (candidature == null)
        {
            return NotFound("Candidature introuvable");
        }

        return Ok(candidature);
    }

    // =========================
    // MODIFIER STATUT
    // =========================
    [HttpPut("{id}/statut")]
    public IActionResult UpdateStatut(Guid id, [FromBody] string statut)
    {
        var candidature = _context.Candidatures
            .FirstOrDefault(c => c.Id == id);

        if (candidature == null)
        {
            return NotFound("Candidature introuvable");
        }

        candidature.Statut = statut;

        _context.SaveChanges();

        return Ok(candidature);
    }

    // =========================
    // SUPPRIMER
    // =========================
    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        var candidature = _context.Candidatures
            .FirstOrDefault(c => c.Id == id);

        if (candidature == null)
        {
            return NotFound("Candidature introuvable");
        }

        _context.Candidatures.Remove(candidature);

        _context.SaveChanges();

        return Ok("Candidature supprimée");
    }
}