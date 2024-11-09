using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using FinanceTracker.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly FirestoreDb _firestoreDb;

    public UserController(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        try
        {
            // Hash the password
            user.PasswordHash = HashPassword(user.PasswordHash);

            CollectionReference usersRef = _firestoreDb.Collection("users");
            DocumentReference docRef = await usersRef.AddAsync(user);
            return Ok(new { userId = docRef.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginRequest)
    {
        try
        {
            Query query = _firestoreDb.Collection("users").WhereEqualTo("Email", loginRequest.Email);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            if (snapshot.Count == 0)
                return Unauthorized("User not found");

            var dbUser = snapshot.Documents[0].ConvertTo<User>();
            if (dbUser.PasswordHash != HashPassword(loginRequest.PasswordHash))
                return Unauthorized("Invalid password");

            string userId = snapshot.Documents[0].Id;
            return Ok(new { userId });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private string HashPassword(string password)
    {
        // Implement a secure password hashing mechanism
        return password; // Replace this with actual hashing logic
    }
}
