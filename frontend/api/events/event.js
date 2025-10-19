import { auth } from '../firebase/firebase';
import { doc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default async function CreateEvent(eventData) {

    const userUid = auth.currentUser.uid;
    const eventCol = doc(db, "events", eventData.code);

    const event = await getDoc(eventCol);

    if (event.exists()) {        
        console.log("There is already an event with this code.");
    } else {
        await setDoc(eventCol, event);
        
        const userEvents = collection(db, "events", userUid);
        // userEvents.addDoc()
    }

}

export default async function AddAvailability() {
    
}