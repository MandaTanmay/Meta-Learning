import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Define the absolute path to the dataset directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, 'datasets', 'domain_dataset.csv')

# Load data with updated error handling
df = pd.read_csv(DATASET_PATH, on_bad_lines='skip')

X = df["query"]
y = df["domain"]

# Vectorization
vectorizer = TfidfVectorizer(stop_words="english")
X_vec = vectorizer.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_vec, y, test_size=0.2, random_state=42
)

# Model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Evaluation
pred = model.predict(X_test)
print("Domain Model Accuracy:", accuracy_score(y_test, pred))

# Save model
joblib.dump(model, "models/domain_model.pkl")
joblib.dump(vectorizer, "models/domain_vectorizer.pkl")
