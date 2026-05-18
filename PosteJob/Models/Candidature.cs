namespace PosteJob.Models;

public class Candidature
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CandidatId { get; set; }

    public string Poste { get; set; } = string.Empty;

    public string Statut { get; set; } = "Nouveau";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}