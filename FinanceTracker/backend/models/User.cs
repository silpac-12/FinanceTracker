using Google.Cloud.Firestore;

namespace FinanceTracker.backend.models
{
    public class User
    {
        [FirestoreProperty]
        public string email {  get; set; }

        [FirestoreProperty]
        public string name { get; set; }
    }
}
