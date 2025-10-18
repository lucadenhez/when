from fastapi import FastAPI
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from firebase_admin import firestore, db as realtimedb
from firebase_admin import credentials, initialize_app, auth

app = FastAPI()

