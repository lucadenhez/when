import { auth } from '../firebase/firebase';
import { doc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const CreateEvent = async (eventData) => {

    const docRef = doc(db, "events", eventData["code"]);

    await setDoc(docRef, { "schema": {}, "numPeople": 0, "eventData": eventData["data"] });
}

export const GetEvent = async (eventData) => {
    const docRef = doc(db, "events", eventData["code"])

    const doc = (await getDoc(docRef)).toJSON();

    return doc
}

export const EventExists = async (eventData) => {
    const docRef = db.collection("events").doc(eventData["code"]);
    const docSnapshot = await docRef.get();

    return docSnapshot.exists;
}

export const AddAvailability = async () => {
    const calendar_tokens = localStorage.getItem('calendar_tokens')
    console.log(calendar_tokens)

    try {
        const response = await fetch(
            "http://localhost:8000/add_availability",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tokens: calendar_tokens,
                    eventId: "eventcode1010",
                    endDate: "10-31-2025"
                })
            })

        const event = response.body

        return event
    } catch (e) {
        console.error(e)
    }
}