import { auth } from '../firebase/firebase';
import { doc, getDoc, collection, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const CreateEvent = async (eventData) => {

    const docRef = doc(db, "events", eventData["code"]);

    await setDoc(docRef, { "schema": {}, "numPeople": 0, "eventData": eventData["data"], "bestTimes": [] });
}

export const GetEvent = async (eventID) => {
    const docRef = doc(db, "events", eventID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data();
};

export const SelectBestTime = async (eventID, date, time) => {
    const data = GetEvent(eventID);
    const docRef = doc(db, "events", eventID);

    var parsed = Date.parse(date)
    parsed.hours = Math.parse(time.substring(0, 2))
    parsed.minutes = Math.parse(time.substring(2))

    data.bestTimes.push(parsed.toString());

    await setDoc(docRef, data);
}

export const GetBestTime = async (eventID) => {
    const docRef = doc(db, "events", eventID);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();
    const bestTimes = data.bestTimes;
    const numPeople = data.numPeople;
    
    if (bestTimes.length == numPeople) {
        return Date.parse(bestTimes[0]).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
}

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
    return `${hours}${mins}`;
};

export const GetTime = (eventData, event) => {
    const eventDuration = (eventData.hours || 0) * 60 + (eventData.minutes || 0);

    const allAvailableBlocks = [];
    const eventSchema = event.schema || {};

    for (const date in eventSchema) {
        if (Object.hasOwnProperty.call(eventSchema, date)) {
            const dayInfo = eventSchema[date];
            const people = dayInfo.people || [];
            const totalPeople = people.length;

            if (totalPeople === 0) continue;

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

            if (timelineEvents.length === 0) continue;

            timelineEvents.sort((a, b) => {
                if (a.time !== b.time) return a.time - b.time;
                return a.type === 'start' ? -1 : 1;
            });

            let concurrentlyAvailablePeople = 0;
            let lastTime = 0;

            timelineEvents.forEach(point => {
                const currentTime = point.time;

                if (currentTime > lastTime) {
                    const slotDuration = currentTime - lastTime;

                    if (concurrentlyAvailablePeople > 0 && slotDuration >= eventDuration) {
                        allAvailableBlocks.push({
                            date: date,
                            startTime: minutesToTime(lastTime),
                            endTime: minutesToTime(currentTime),
                            attendees: concurrentlyAvailablePeople,
                            totalPeople: totalPeople,
                            score: concurrentlyAvailablePeople / totalPeople,
                        });
                    }
                }

                if (point.type === 'start') {
                    concurrentlyAvailablePeople++;
                } else {
                    concurrentlyAvailablePeople--;
                }

                lastTime = currentTime;
            });

            const endOfDay = 24 * 60;
            if (endOfDay > lastTime) {
                const finalSlotDuration = endOfDay - lastTime;
                if (concurrentlyAvailablePeople > 0 && finalSlotDuration >= eventDuration) {
                    allAvailableBlocks.push({
                        date: date,
                        startTime: minutesToTime(lastTime),
                        endTime: minutesToTime(endOfDay),
                        attendees: concurrentlyAvailablePeople,
                        totalPeople: totalPeople,
                        score: concurrentlyAvailablePeople / totalPeople,
                    });
                }
            }
        }
    }

    allAvailableBlocks.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
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

    const top3Blocks = allAvailableBlocks.slice(0, 5);

    return top3Blocks.map(block => {
        const [month, day, year] = block.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        const formatTime = (timeStr) => {
            if (!timeStr || timeStr.length !== 4) return "";
            return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
        };

        return {
            ...block,
            displayDate: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            displayTime: `${formatTime(block.startTime)}`
        };
    });
};

