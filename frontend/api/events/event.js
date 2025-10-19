import { auth } from '../firebase/firebase';
import { doc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const CreateEvent = async (eventData) => {

    const docRef = doc(db, "events", eventData["code"]);

    await setDoc(docRef, { "schema": {}, "numPeople": 0, "eventData": eventData["data"] });
}

export const GetEvent = async (eventID) => {
  const docRef = doc(db, "events", eventID);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
};

export const EventExists = async (eventData) => {
    const docRef = db.collection("events").doc(eventData["code"]);
    const docSnapshot = await docRef.get();

    return docSnapshot.exists;
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

const timeToMinutes = (timeStr) => {
    if (!timeStr || timeStr.length !== 4) return 0;
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = parseInt(timeStr.substring(2, 4), 10);
    return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hours = h.toString().padStart(2, '0');
    const mins = m.toString().padStart(2, '0');
    return `${hours}:${mins}`;
};

export const GetTime = (eventData, event) => {
    const eventDuration = (eventData.hours || 0) * 60 + (eventData.minutes || 0);

    const allPossibleSlots = [];

    if (event && event.availableDays) {
        event.availableDays.forEach(dayObject => {
            const date = Object.keys(dayObject)[0];
            const dayInfo = dayObject[date];
            const people = dayInfo.people || [];

            if (people.length === 0) return;

            const timelineEvents = [];
            people.forEach(person => {
                const availableTimes = person.availableTimes || person.availabileTimes || [];
                availableTimes.forEach(slot => {
                    const [start, end] = slot.split('-');
                    if (start && end) {
                        timelineEvents.push({ time: timeToMinutes(start), type: 'start' });
                        timelineEvents.push({ time: timeToMinutes(end), type: 'end' });
                    }
                });
            });
            
            if (timelineEvents.length === 0) return;

            timelineEvents.sort((a, b) => {
                if (a.time !== b.time) return a.time - b.time;
                return a.type === 'start' ? -1 : 1;
            });

            let maxAttendeesInSlot = 0;
            let concurrentlyAvailablePeople = 0;
            let lastTime = timelineEvents[0].time;

            timelineEvents.forEach(point => {
                const currentTime = point.time;

                if (currentTime > lastTime) {
                    const slotDuration = currentTime - lastTime;
                    
                    if (concurrentlyAvailablePeople > 0 && slotDuration >= eventDuration) {
                        const potentialStarts = currentTime - lastTime - eventDuration;
                        for (let i = 0; i <= potentialStarts; i++) {
                             allPossibleSlots.push({
                                date: date,
                                prettyDate: (newDate.parse(date)).toDateString(),
                                startTime: minutesToTime(lastTime + i),
                                attendees: concurrentlyAvailablePeople,
                            });
                        }
                    }
                }

                if (point.type === 'start') {
                    concurrentlyAvailablePeople++;
                } else {
                    concurrentlyAvailablePeople--;
                }
                
                lastTime = currentTime;
            });
        });
    }

    allPossibleSlots.sort((a, b) => {
        if (b.attendees !== a.attendees) {
            return b.attendees - a.attendees;
        }
        const [monthA, dayA, yearA] = a.date.split('-').map(Number);
        const [monthB, dayB, yearB] = b.date.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    return allPossibleSlots.slice(0, 3);
};