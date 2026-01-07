import joblib

model = joblib.load("models/domain_model.pkl")
vectorizer = joblib.load("models/domain_vectorizer.pkl")

def predict_domain(query):
    vec = vectorizer.transform([query])
    pred = model.predict(vec)[0]
    conf = max(model.predict_proba(vec)[0])
    return pred, round(conf, 2)
