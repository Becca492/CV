using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PosteJob.Migrations
{
    /// <inheritdoc />
    public partial class InitAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nom",
                table: "Candidats");

            migrationBuilder.DropColumn(
                name: "Prenom",
                table: "Candidats");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Candidats",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Candidatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CandidatId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Poste = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Candidatures", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Candidatures");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Candidats");

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
    }
}
