using Microsoft.EntityFrameworkCore;
using HrmApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Missing ConnectionStrings:DefaultConnection. Set it in appsettings.Development.json, user-secrets, or the ConnectionStrings__DefaultConnection environment variable.");

builder.Services.AddDbContext<HrmDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure CORS for Next.js frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure PostgreSQL database is created and seeded with Pakistani records
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<HrmDbContext>();
        DbInitializer.Initialize(context);
        app.Logger.LogInformation("Successfully connected to PostgreSQL 'hrm_db' and initialized HRM schema.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while connecting or migrating the PostgreSQL database.");
    }
}

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PakHRM Enterprise API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run("http://0.0.0.0:5000");
