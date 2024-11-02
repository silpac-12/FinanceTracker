using Google.Cloud.Firestore;
using System;

[FirestoreData]
public class Transaction
{
    [FirestoreProperty]
    public string Description { get; set; }

    [FirestoreProperty]
    public double Amount { get; set; }

    [FirestoreProperty]
    public string Category { get; set; }

    [FirestoreProperty]
    public DateTime Date { get; set; }
}
