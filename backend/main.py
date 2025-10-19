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
from collections import defaultdict
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
        redirect_uri=f"http://localhost:8000/oauth2callback"
    )

    flow.fetch_token(code=code)
    creds = flow.credentials

    token = {
        "access_token": creds.token,
        "refresh_token": creds.refresh_token,
        "expiry": creds.expiry.isoformat(),
    }

    return { "calendar_tokens": json.dumps(token) }



def get_unavailability(service, endDate):
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    time_min_dt = utc_now.replace(hour=0, minute=0, second=0, microsecond=0)

    end_date_dt = datetime.datetime.strptime(endDate, "%m-%d-%Y")
    time_max_dt = end_date_dt.replace(hour=23, minute=59, second=59)
    time_max_aware = time_max_dt.replace(tzinfo=datetime.timezone.utc)

    time_min = time_min_dt.isoformat()
    time_max = time_max_aware.isoformat()

    calendar_list = service.calendarList().list().execute()
    calendar_ids = [item['id'] for item in calendar_list.get('items', [])]

    unavailable = defaultdict(list)
    add = datetime.timedelta(days=1)
    
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
                start_dt = datetime.datetime.fromisoformat(start_data['dateTime'])
                end_dt = datetime.datetime.fromisoformat(end_data['dateTime'])

                current_dt = start_dt
                while current_dt.date() <= end_dt.date():
                    date_str = current_dt.strftime('%m-%d-%Y')

                    start_str = current_dt.strftime('%H%M') if current_dt.date() == start_dt.date() else "0000"
                    if current_dt.date() == end_dt.date():
                         
                            end_str = end_dt.strftime('%H%M')
                       
                            if end_str == "0000" and end_dt.date() > start_dt.date():
                            
                                prev_day_str = (current_dt - add).strftime('%m-%d-%Y')
                          
                                for i, time in enumerate(unavailable[prev_day_str]):
                                    if time.endswith("-0000"):
                                        unavailable[prev_day_str][i] = time.replace("-0000", "-2359")
                                break
                    else:
                        end_str = "2359"

                    unavailable[date_str].append(f"{start_str}-{end_str}")
                    current_dt = (current_dt + add).replace(hour=0, minute=0)
    
            elif 'date' in start_data:
                start_date = datetime.date.fromisoformat(start_data['date'])
                end_date = datetime.date.fromisoformat(end_data['date']) - add
                    
                current_date = start_date
                while current_date <= end_date:
                    date_str = current_date.strftime('%m-%d-%Y')
                    unavailable[date_str].append("0000-2400")
                    current_date += add
        
            else:
                continue
    return dict(unavailable)

def get_availability(busy_times: list[str], event_time_minutes: int) -> list[str]:    
    def time_to_minutes(time_str: str) -> int:
        hours = int(time_str[0:2])
        minutes = int(time_str[2:4])
        return (hours * 60) + minutes

    if not busy_times:
        if (24 * 60) >= event_time_minutes:
            return ["0000-2400"]
        else:
            return []
            
    busy_times.sort()

    merged_busy = []
    
    current_start, current_end = busy_times[0].split('-')

    for event in busy_times[1:]:
        next_start, next_end = event.split('-')

        if next_start <= current_end:
            current_end = max(current_end, next_end)
        else:
            merged_busy.append(f"{current_start}-{current_end}")
            current_start, current_end = next_start, next_end
            
    merged_busy.append(f"{current_start}-{current_end}")

    available_slots = []
    last_busy_end = "0000"

    for busy_slot in merged_busy:
        busy_start, busy_end = busy_slot.split('-')

        if busy_start > last_busy_end:
            available_start_min = time_to_minutes(last_busy_end)
            available_end_min = time_to_minutes(busy_start)
            duration = available_end_min - available_start_min
            
            if duration >= event_time_minutes:
                available_slots.append(f"{last_busy_end}-{busy_start}")
                
        last_busy_end = busy_end
        
    if last_busy_end < "2400":
        available_start_min = time_to_minutes(last_busy_end)
        available_end_min = time_to_minutes("2400")
        duration = available_end_min - available_start_min
        
        if duration >= event_time_minutes:
            available_slots.append(f"{last_busy_end}-2400")

    return available_slots

@app.post("/add_availability") 
async def add_availability(request: Request):
    body = await request.json()
    tokens = body.get("tokens")
    endDate = body.get("endDate")
    eventId = body.get("eventId")
    time = body.get("time")

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

    unavailable = get_unavailability(service, endDate)

    event_doc = db.collection("events").document(eventId)
    event_snap = event_doc.get()

    event = event_snap.to_dict().get("schema")
    numPeople = event_snap.to_dict().get("numPeople")
    eventData = event_snap.to_dict().get("eventData")

    for day in unavailable:
        av = get_availability(unavailable[day], time)
        data = {"firstName": firstName, "lastName": lastName, "unavailableTimes": unavailable[day], "availableTimes": av}
        if (day not in event):
            event[day] = {"people": [], "availableCount": 0}
        event[day]["people"].append(data)
        if (len(av) > 0):
            event[day]["availableCount"] = event[day]["availableCount"] + 1

    db.collection("events").document(eventId).set({"schema": event, "numPeople": numPeople + 1, "eventData": eventData})

    print("MADE IT")
        


            

            







    


    




