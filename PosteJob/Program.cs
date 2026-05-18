using Microsoft.EntityFrameworkCore;
using PosteJob.Data;

var builder = WebApplication.CreateBuilder(args);

// ==========================
// DATABASE
// ==========================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ==========================
// CONTROLLERS
// ==========================
builder.Services.AddControllers();

// ==========================
// SWAGGER
// ==========================
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// ==========================
// CORS
// ==========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// ==========================
// SWAGGER
// ==========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

// ==========================
// CORS
// ==========================
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();