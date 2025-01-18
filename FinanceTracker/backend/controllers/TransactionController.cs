using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TransactionController : ControllerBase
{
    private readonly FirestoreDb _firestoreDb;

    public TransactionController(FirestoreDb firestoreDb)
    {
        _firestoreDb = firestoreDb;
        Console.WriteLine("FirestoreDb initialized in TransactionController.");
    }

    // Get all transactions (for testing purposes)
    [HttpGet("all")]
    public async Task<IActionResult> GetAllTransactions()
    {
        Console.WriteLine("Attempting to retrieve all transactions.");
        try
        {
            var transactionsRef = _firestoreDb.Collection("transactions");
            var snapshot = await transactionsRef.GetSnapshotAsync();
            var transactions = new List<Transaction>();

            foreach (var doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    transactions.Add(doc.ConvertTo<Transaction>());
                }
            }

            Console.WriteLine($"All transactions retrieved. Count: {transactions.Count}");
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving transactions: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }

    // Get transactions for a specific user
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserTransactions(string userId)
    {
        Console.WriteLine($"Attempting to retrieve transactions for User ID: {userId}");

        try
        {
            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine("User ID is missing.");
                return BadRequest("User ID is required.");
            }

            CollectionReference transactionsRef = _firestoreDb.Collection("transactions");
            Query query = transactionsRef.WhereEqualTo("UserId", userId);
            QuerySnapshot snapshot = await query.GetSnapshotAsync();

            Console.WriteLine($"Query executed. Document count: {snapshot.Documents.Count}");

            var transactions = new List<Transaction>();

            foreach (DocumentSnapshot doc in snapshot.Documents)
            {
                if (doc.Exists)
                {
                    var transaction = doc.ConvertTo<Transaction>();
                    Console.WriteLine($"Transaction found: {transaction.Description}, Date: {transaction.Date}");
                    transactions.Add(transaction);
                }
            }

            if (transactions.Count == 0)
            {
                Console.WriteLine("No transactions found for the user.");
            }

            return Ok(transactions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error retrieving transactions for user {userId}: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }


    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] Transaction transaction)
    {
        Console.WriteLine("Received POST request");
        try
        {
            // Log the received data
            Console.WriteLine($"Description: {transaction.Description}");
            Console.WriteLine($"Amount: {transaction.Amount}");
            Console.WriteLine($"Category: {transaction.Category}");
            Console.WriteLine($"UserId: {transaction.UserId}");
            Console.WriteLine($"Date: {transaction.Date}");

            // If no date is provided, set the current date and time as a string
            if (string.IsNullOrEmpty(transaction.Date))
            {
                transaction.Date = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
            }

            // Write the transaction directly to Firestore
            DocumentReference docRef = await _firestoreDb.Collection("transactions").AddAsync(transaction);
            Console.WriteLine("Transaction written to Firestore with ID: " + docRef.Id);

            return Ok(new { id = docRef.Id });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating transaction: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}