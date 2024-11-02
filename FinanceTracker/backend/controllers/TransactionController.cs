using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly FirestoreDb _firestoreDb;

    public TransactionController(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(string id)
    {
        Console.WriteLine($"Attempting to retrieve transaction with ID: {id}");
        try
        {
            DocumentReference docRef = _firestoreDb.Collection("transactions").Document(id);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();
            if (snapshot.Exists)
            {
                var transaction = snapshot.ConvertTo<Transaction>();
                Console.WriteLine("Transaction retrieved successfully.");
                return Ok(transaction);
            }
            Console.WriteLine("Transaction not found.");
            return NotFound();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving transaction: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] Transaction transaction)
    {
        Console.WriteLine("Received transaction:");
        Console.WriteLine($"Description: {transaction.Description}");
        Console.WriteLine($"Amount: {transaction.Amount}");
        Console.WriteLine($"Category: {transaction.Category}");
        Console.WriteLine($"Date: {transaction.Date}");

        try
        {
            DocumentReference docRef = await _firestoreDb.Collection("transactions").AddAsync(transaction);
            Console.WriteLine("Transaction created successfully with ID: " + docRef.Id);
            return CreatedAtAction(nameof(GetTransaction), new { id = docRef.Id }, transaction);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating transaction: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
