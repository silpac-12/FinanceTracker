using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;

var builder = WebApplication.CreateBuilder(args);

// Set the environment variable for Google credentials
string path = AppDomain.CurrentDomain.BaseDirectory + @"secrets/finance-tracker-9a9fa-firebase-adminsdk-853s8-5a664a38a5.json";
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);

// Initialize FirebaseApp if not already initialized
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential.GetApplicationDefault()
    });
}

// Register FirestoreDb as a singleton service for dependency injection
builder.Services.AddSingleton(provider => FirestoreDb.Create("finance-tracker-9a9fa"));

// Add controllers and other services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseDeveloperExceptionPage();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
