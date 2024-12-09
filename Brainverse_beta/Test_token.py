
import requests

# Inserisci il tuo token API
API_TOKEN = "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"
headers = {"Authorization": f"Bearer {API_TOKEN}"}

# Effettua la richiesta per verificare il token
response = requests.get("https://huggingface.co/api/whoami-v2", headers=headers)

if response.status_code == 200:
    print("Token valido! Dettagli account:", response.json())
else:
    print("Errore con il token:", response.status_code, response.text)
