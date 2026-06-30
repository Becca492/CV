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

    // CREATE
    [HttpPost]
    public IActionResult Create(Candidat c)
    {
        _context.Candidats.Add(c);

        _context.SaveChanges();

        return Ok(c);
    }

    // GET ALL
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_context.Candidats.ToList());
    }

    // GET BY USER ID
    [HttpGet("{userId}")]
    public IActionResult GetByUserId(Guid userId)
    {
        var candidat = _context.Candidats
            .FirstOrDefault(c => c.UserId == userId);

        if (candidat == null)
        {
            return NotFound();
        }

        return Ok(candidat);
    }
}