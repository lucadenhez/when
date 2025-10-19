import { auth } from '../firebase/firebase';
import { doc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const CreateEvent = async (eventData) => {

    const docRef = doc(db, "events", eventData["code"]);

    await setDoc(docRef, { "schema": {}, "numPeople": 0, "eventData": {} });
}

export const GetEvent = async (eventData) => {
    const docSnapshop = await getDoc(db, "events", eventData);
    const doc = await getDoc();

    return doc;
}

export const EventExists = async (eventData) => {
    const docRef = db.collection("events").doc(eventData["code"]);
    const docSnapshot = await docRef.get();

    return docSnapshot.exists;
}

export const GetTime = (eventData) => {
    const timePeriod = {}
    const minutes = ["00", "15", "30", "45"]

    eventData.map((val, key) => {
        const days = {}

        for (let index = 0; index < 24; index++) {
            const s = index.toString();
            if (index < 10) s = "0" + s;

            for (let m = 0; m < minutes.length; m++) {
                count[s + m] = 0
            }
        }

        const test = "";
        test.su

        val.forEach(person => {
            person.forEach(time => {
                startH = time.substring(0,2)
                endH = time.substring(5,7)
                startM = time.substring(2,4)
                endM = time.substring(7)

                
            });
        });
    })
}

export const AddAvailability = async (eventData) => {
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
                    eventId: "eventcode0101",
                    endDate: "10-31-2025",
                    time: eventData.time
                })
            })

        const event = response.body

        return event
    } catch (e) {
        console.error(e)
    }
}