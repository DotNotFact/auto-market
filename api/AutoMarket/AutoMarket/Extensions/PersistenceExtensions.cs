using AutoMarket.Repositories.Abstracts;
using AutoMarket.Services.Abstracts;
using AutoMarket.Repositories.Bases;
using AutoMarket.Services.Bases;
using AutoMarket.Entities;
using AutoMarket.Data;

namespace AutoMarket.Extensions;

public static class PersistenceExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services)
    {
        services.AddDbContext<ApplicationDbContext>();

        services
            .AddScoped<IRepository<MakerEntity>, MakersRepository>()
            .AddScoped<IRepository<ModelEntity>, ModelsRepository>();

        services
            .AddScoped<ICarService, CarService>();

        services.AddControllers();
        services.AddOpenApi();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins", policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }
}
