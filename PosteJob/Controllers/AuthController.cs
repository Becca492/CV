using Microsoft.AspNetCore.Mvc;
using PosteJob.Data;
using PosteJob.Models;

namespace PosteJob.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    // REGISTER
    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        if (_context.Users.Any(u => u.Email == user.Email))
            return BadRequest("Email déjà utilisé");

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(user);
    }

    // LOGIN
    [HttpPost("login")]
    public IActionResult Login(User login)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == login.Email && u.PasswordHash == login.PasswordHash);

        if (user == null)
            return Unauthorized("Identifiants incorrects");

        return Ok(user);
    }
}