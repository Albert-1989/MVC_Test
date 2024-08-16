using Microsoft.Extensions.DependencyInjection;
using MVC_Test.Controllers;
using MVC_Test.Interfaces;
using MVC_Test.Models;
using MVC_Test.Services;
using Newtonsoft.Json;
using System.Numerics;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSession();
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton<ISingleton, Sample>();
builder.Services.AddScoped<IScoped, Sample>();
builder.Services.AddTransient<ITransient, Sample>();
builder.Services.AddScoped<HomeService, HomeService>();
builder.Services.AddScoped<HomeController, HomeController>();

//(寫法1)
builder.Configuration.AddJsonFile("appsettings.json");

// 使用 Configure 註冊 Option(寫法2)
builder.Services.Configure<DemoUserOption>(
    builder.Configuration.GetSection("DemoUser"));



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}



app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
