import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
    const [events, setEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [event, setEvent] = useState("");
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        axios.get('http://localhost:5000/events')
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => console.error('Error fetching events:', error));
    };

    const handleEventChange = (e) => {
        setEvent(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };

    const addEvent = () => {
        if (event.trim() === "" || deadline === "") {
            alert("Please enter an event and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(deadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newEvent = {
            event,
            priority,
            deadline,
            done: false,
        };

        axios.post('http://localhost:5000/events', newEvent)
            .then(response => {
                setEvents([...events, response.data]);
                setEvent("");
                setPriority("top");
                setDeadline("");
            })
            .catch(error => console.error('Error adding event:', error));
    };

    const markDone = (id) => {
        axios.put(`http://localhost:5000/events/${id}`, { done: true })
            .then(() => {
                const updatedEvents = events.map(t =>
                    t.id === id ? { ...t, done: true } : t
                );
                setEvents(updatedEvents);

                const completedEvent = updatedEvents.find(t => t.id === id);
                if (completedEvent) {
                    setCompletedEvents([...completedEvents, completedEvent]);
                }
            })
            .catch(error => console.error('Error marking event as done:', error));
    };

    const upcomingEvents = events.filter(t => !t.done);

    return (
        <div className="App">
            <header>
                <h1>Eddie's Event Scheduler</h1>
            </header>
            <main>
                <div className="event-form">
                    <input
                        type="text"
                        id="event"
                        placeholder="Enter event name..."
                        value={event}
                        onChange={handleEventChange}
                    />
                    <select
                        id="priority"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <option value="top">Top Priority</option>
                        <option value="middle">Middle Priority</option>
                        <option value="low">Less Priority</option>
                    </select>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                    <button id="add-event" onClick={addEvent}>
                        Add Event
                    </button>
                </div>
                <h2 className="heading">Upcoming Events</h2>
                <div className="event-list" id="event-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingEvents.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.event}</td>
                                    <td>{t.priority}</td>
                                    <td>{t.deadline}</td>
                                    <td>
                                        {!t.done && (
                                            <button
                                                className="mark-done"
                                                onClick={() => markDone(t.id)}
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="completed-event-list">
                    <h2 className="cheading">Completed Events</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedEvents.map((ct) => (
                                <tr key={ct.id}>
                                    <td>{ct.event}</td>
                                    <td>{ct.priority}</td>
                                    <td>{ct.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default App;
