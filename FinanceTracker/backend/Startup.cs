using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace FinanceTracker.backend
{
    public class Startup
    {
        //public void ConfigureServices(IServiceCollection services)
        //{
        //    // Set the environment variable for Google credentials
        //    string path = AppDomain.CurrentDomain.BaseDirectory + @"secrets/finance-tracker-9a9fa-firebase-adminsdk-853s8-5a664a38a5.json";
        //    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);

        //    // Initialize Firebase App if not already initialized
        //    if (FirebaseApp.DefaultInstance == null)
        //    {
        //        FirebaseApp.Create(new AppOptions
        //        {
        //            Credential = GoogleCredential.GetApplicationDefault()
        //        });
        //    }
        //    Console.WriteLine("Registering FirestoreDb...");

        //    // Register FirestoreDb as a singleton for dependency injection
        //    services.AddSingleton(provider => FirestoreDb.Create("finance-tracker-9a9fa"));

        //    // Add controllers
        //    services.AddControllers();
        //}

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    builder => builder
                        .WithOrigins("http://localhost:3000") // Allow requests from the frontend
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });

            services.AddControllers();
        }




        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
