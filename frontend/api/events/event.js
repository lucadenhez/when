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

/**
 * Converts a time string in "HHMM" format to the total number of minutes from midnight.
 * @param {string} timeStr - The time string, e.g., "0930" for 9:30 AM.
 * @returns {number} The total minutes from midnight.
 */
const timeToMinutes = (timeStr) => {
    if (!timeStr || timeStr.length !== 4) return 0;
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = parseInt(timeStr.substring(2, 4), 10);
    return hours * 60 + minutes;
};

/**
 * Converts total minutes from midnight back to a time string in "HHMM" format.
 * @param {number} minutes - The total minutes from midnight.
 * @returns {string} The time string in "HHMM" format.
 */
const minutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hours = h.toString().padStart(2, '0');
    const mins = m.toString().padStart(2, '0');
    return `${hours}${mins}`;
};

/**
 * Finds the top 3 best times for an event based on attendee availability.
 *
 * @param {object} eventData - Contains event details like duration.
 * @param {object} event - Contains the availability data, with dates as keys.
 * @returns {Array<object>} An array of up to 3 objects, each representing a best-fit time slot.
 */
export const GetTime = (eventData, event) => {
    // 1. Calculate the required event duration in minutes from the eventData.
    const eventDuration = (eventData.hours || 0) * 60 + (eventData.minutes || 0);

    const allAvailableBlocks = [];
    const eventSchema = event.schema || {};

    // 2. Iterate through each day in the event availability schema.
    for (const date in eventSchema) {
        if (Object.hasOwnProperty.call(eventSchema, date)) {
            const dayInfo = eventSchema[date];
            const people = dayInfo.people || [];
            const totalPeople = people.length;

            if (totalPeople === 0) continue;

            // 3. Create a timeline of events (start/end of availability) for all people on this day.
            const timelineEvents = [];
            people.forEach(person => {
                // Handle a potential typo in the schema ('availabileTimes' vs 'availableTimes').
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

            // 4. Sort the timeline events. Time is the primary sort key.
            // If times are equal, 'start' events come before 'end' events.
            timelineEvents.sort((a, b) => {
                if (a.time !== b.time) return a.time - b.time;
                return a.type === 'start' ? -1 : 1;
            });

            // 5. Sweep through the timeline to find blocks of common availability.
            let concurrentlyAvailablePeople = 0;
            let lastTime = 0; // Start at the beginning of the day (0000).

            timelineEvents.forEach(point => {
                const currentTime = point.time;

                // Analyze the interval *before* the current point.
                if (currentTime > lastTime) {
                    const slotDuration = currentTime - lastTime;

                    // If this time block has attendees and is long enough, it's a valid block.
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

                // Update the count of available people for the interval *after* the current point.
                if (point.type === 'start') {
                    concurrentlyAvailablePeople++;
                } else {
                    concurrentlyAvailablePeople--;
                }

                lastTime = currentTime;
            });

            // After the loop, check the final interval from the last event to the end of the day.
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

    // 6. Sort all found blocks to determine the "best" ones.
    allAvailableBlocks.sort((a, b) => {
        // Primary sort: higher score (percentage of attendees) is better.
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        // Secondary sort: more attendees is better (in case of same score but different total people).
        if (b.attendees !== a.attendees) {
            return b.attendees - a.attendees;
        }
        // Tertiary sort: earlier date is better.
        const [monthA, dayA, yearA] = a.date.split('-').map(Number);
        const [monthB, dayB, yearB] = b.date.split('-').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }
        // Quaternary sort: earlier time is better.
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    // 7. Return the top 3 best time blocks.
    const top3Blocks = allAvailableBlocks.slice(0, 5);

    return top3Blocks.map(block => {
        // Reliably parse the "MM-DD-YYYY" date string.
        const [month, day, year] = block.date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        // Format time from "HHMM" to "HH:MM" for display.
        const formatTime = (timeStr) => {
            if (!timeStr || timeStr.length !== 4) return "";
            return `${timeStr.substring(0, 2)}:${timeStr.substring(2, 4)}`;
        };

        return {
            ...block,
            // Add new properties for easy display.
            displayDate: dateObj.toDateString(), // e.g., "Sat Oct 18 2025"
            displayTime: `${formatTime(block.startTime)}` // e.g., "09:00 - 12:00"
        };
    });
};

