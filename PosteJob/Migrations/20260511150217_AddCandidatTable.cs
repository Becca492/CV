using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PosteJob.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidatTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nom",
                table: "Candidats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Prenom",
                table: "Candidats",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nom",
                table: "Candidats");

            migrationBuilder.DropColumn(
                name: "Prenom",
                table: "Candidats");
        }
    }
}
