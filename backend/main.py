from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import firestore, db as realtimedb
from firebase_admin import credentials, initialize_app, auth
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
import firebase_admin
from io import BytesIO
import os
from dotenv import load_dotenv
import io
import datetime
import json

load_dotenv()


cred_path = os.getenv("FIREBASE_CREDENTIAL_PATH")
cred = credentials.Certificate(cred_path)
initialize_app(cred)

db = firestore.client()
app = FastAPI()

GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
SCOPES = ["https://www.googleapis.com/auth/calendar"]
REDIRECT_URI = "http://localhost:8000/oauth2callback"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
       print("Missing auth token")
    try:
        id_token = auth_header.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception:
        return None

@app.get("/oauth2callback")
async def oauth2callback(request: Request):
    code = request.query_params.get("code")
    return RedirectResponse(url=f"http://localhost:3000/success?code={code}")

@app.post("/store_google_tokens")
async def setup_calendar(request: Request):
    body = await request.json()
    code = body.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="Missing uid or code")

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=["https://www.googleapis.com/auth/calendar"],
        redirect_uri="http://localhost:8000/oauth2callback"
    )

    flow.fetch_token(code=code)
    creds = flow.credentials

    token = {
        "access_token": creds.token,
        "refresh_token": creds.refresh_token,
        "expiry": creds.expiry.isoformat(),
    }

    return { "calendar_tokens": json.dumps(token) }



def get_availability(service, endDate):
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    time_min_dt = utc_now.replace(hour=0, minute=0, second=0, microsecond=0)

    end_date_dt = datetime.datetime.strptime(endDate, "%m-%d-%Y")
    time_max_dt = end_date_dt.replace(hour=23, minute=59, second=59)
    time_max_aware = time_max_dt.replace(tzinfo=datetime.timezone.utc)

    time_min = time_min_dt.isoformat()
    time_max = time_max_aware.isoformat()

    calendar_list = service.calendarList().list().execute()
    calendar_ids = [item['id'] for item in calendar_list.get('items', [])]

    availability = {}
    
    for id in calendar_ids:
        result = service.events().list(
            calendarId=id,
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True
        ).execute()

        event_list = result.get('items', [])

        for event in event_list:
            start_data = event.get('start', {})
            end_data = event.get('end', {})

            if 'dateTime' in start_data:
                start_time = datetime.datetime.fromisoformat(start_data['dateTime'])
                end_time = datetime.datetime.fromisoformat(end_data['dateTime'])
    
            elif 'date' in start_data:
                start_time = datetime.date.fromisoformat(start_data['date'])
                end_time = datetime.date.fromisoformat(end_data['date'])
        
            else:
        
                continue

            add = datetime.timedelta(days=1)

            start = start_time.strftime('%H%M')
            end = end_time.strftime('%H%M')
            start_date = start_time.strftime('%m-%d-%Y')

            if (start_date not in availability):
                availability[start_date] = []

            if (start_time.date() == end_time.date()):
                availability[start_date].add({f"{start}-{end}"})
            else:
                availability[start_date].add(f"{start}-2400")
                while (start_time.date() != end_time.date()):
                    start_time = start_time + add
                    date = start_time.strftime('%m-%d-%Y')
                    if (date not in availability):
                        availability[date] = []
                    if (start_time.date() == end_time.date()):
                        availability[date].add(f"0000-{end}")
                        break
                    else:
                        availability[date].add(f"0000-2400")
    return availability


@app.post("/add_availability") 
async def add_availability(request: Request):
    body = await request.json()
    tokens = body.get("tokens")
    endDate = body.get("endDate")
    eventId = body.get("eventId")

    firstName = "Sean"
    lastName = "Gutmann"

    if not tokens:
        raise HTTPException(status_code=400, detail="Missing calendar tokens")
    
    print(endDate)
    print(eventId)
    print(tokens)
    tokens = json.loads(json.loads(tokens)["calendar_tokens"])
    print(type(tokens))


    creds = Credentials(
        tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
    )

    service = build("calendar", "v3", credentials=creds)

    availability = get_availability(service, endDate)

    event_doc = db.collection("events").document(eventId).to_dict()
    event = event_doc["schema"]

    for day in availability:
        if (day not in event):
            event[day] = []
        event[day].add({"firstName": firstName, "lastName": lastName, "availableTimes": availability[day]})

    db.collection("events").document(eventId).set({"schema": event, "maxPeople": event_doc["numPeople"] + 1})
        


            

            







    


    




