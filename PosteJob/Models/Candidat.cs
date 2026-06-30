namespace PosteJob.Models;

public class Candidat
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // relation utilisateur
    public Guid UserId { get; set; }

    public string Prenom { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string Telephone { get; set; } = string.Empty;

    public string Ville { get; set; } = string.Empty;

    public string Poste { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public int Experience { get; set; }

    public string Niveau { get; set; } = string.Empty;

    public string Entreprise { get; set; } = string.Empty;

    public string Competences { get; set; } = string.Empty;

    public string CvPath { get; set; } = string.Empty;

    public string LettrePath { get; set; } = string.Empty;
    
    public string CvFileName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}