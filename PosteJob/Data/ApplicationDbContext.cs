using Microsoft.EntityFrameworkCore;
using PosteJob.Models;

namespace PosteJob.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Candidat> Candidats { get; set; }

    public DbSet<Candidature> Candidatures { get; set; }
}