using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using FinanceTracker.backend.models;

namespace FinanceTracker.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;

        public UserController(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            try
            {
                DocumentReference docRef = await _firestoreDb.Collection("users").AddAsync(user);
                return CreatedAtAction(nameof(GetUser), new { id = docRef.Id }, user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating user: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
                DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
                if (snapshot.Exists)
                {
                    var user = snapshot.ConvertTo<User>();
                    return Ok(user);
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving user: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] User user)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
                await docRef.SetAsync(user, SetOptions.Overwrite);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                DocumentReference docRef = _firestoreDb.Collection("users").Document(id);
                await docRef.DeleteAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting user: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
