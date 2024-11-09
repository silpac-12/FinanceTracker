using Google.Cloud.Firestore;
using System;

namespace FinanceTracker.Models
{
    [FirestoreData]
    public class User
    {
        [FirestoreProperty]
        public string Email { get; set; }

        [FirestoreProperty]
        public string PasswordHash { get; set; } // Store hashed passwords for security

        [FirestoreProperty]
        public string Name { get; set; }
    }
}
