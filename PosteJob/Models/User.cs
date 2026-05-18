namespace PosteJob.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Prenom { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // candidat / admin
    public string Role { get; set; } = "candidat";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}