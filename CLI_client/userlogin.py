import requests

# Example URL (replace with your API endpoint)
url = "http://localhost:8000/users/"

# Send a GET request to the API
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response (if the API returns JSON data)
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")
