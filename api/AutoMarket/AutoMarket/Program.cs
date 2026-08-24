using Scalar.AspNetCore;
using AutoMarket.Extensions;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddPersistence();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
