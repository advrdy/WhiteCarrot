import "./App.css";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import SignInButton from "./components/SignInButton";
import EventTable from "./components/EventTable";
import Filter from "./components/Filter";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Modal from "./components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [events, setEvents] = useState([]);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [startD, setStartD] = useState(new Date());
  const [endD, setEndD] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [firstName, setFirstName] = useState("");
  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      fetchGoogleCalendarEvents();
      extractFirstName();
    }
  }, [session]);

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      toast.error("Error logging in to Google Provider with Supabase");
      console.log(error);
    }
  }

  async function fetchGoogleCalendarEvents() {
    if (!session) return;

    try {
      const accessToken = session.provider_token;
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const sortedEvents = response.data.items.sort(
        (a, b) =>
          new Date(b.start.dateTime || b.start.date) -
          new Date(a.start.dateTime || a.start.date)
      );
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      toast.error("Error fetching events");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  }

  async function deleteEvent(eventId) {
    if (!session) return;

    try {
      const accessToken = session.provider_token;
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Event deleted successfully!");
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      setFilteredEvents((prevFilteredEvents) =>
        prevFilteredEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting Google Calendar event:", error);
      toast.error("Error deleting event");
    }
  }

  function extractFirstName() {
    if (session && session.user && session.user.user_metadata) {
      const fullName = session.user.user_metadata.full_name || "";
      const firstName = fullName.split(" ")[0];
      setFirstName(firstName);
    }
  }

  function handleFilterChange(selectedDate) {
    setFilterDate(selectedDate);

    if (!selectedDate) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const eventStartDate = new Date(event.start.dateTime || event.start.date);
      const eventFormattedDate = eventStartDate.toISOString().split("T")[0];
      return eventFormattedDate === selectedDate;
    });

    setFilteredEvents(filtered);
  }

  async function createCalendarEvent() {
    try {
      const eventObj = {
        summary: eventName,
        description: eventDescription,
        start: {
          dateTime: startD.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endD.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        eventObj,
        {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Event created successfully!");

      const newEvent = response.data;
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
      setFilteredEvents((prevFilteredEvents) => [
        newEvent,
        ...prevFilteredEvents,
      ]);

      setEventName("");
      setEventDescription("");
      setShowCreateEventModal(false);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      toast.error("Error creating calendar event");
    }
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-700 to-blue-300">
      <Toaster position="top-right" />
      <div className="container mx-auto w-2/3">
        {session ? (
          <>
            <div className="bg-white pt-6 pb-6 pl-8 pr-8 rounded-2xl shadow-md text-center  border-blue-400 border-x-8 border-y-8 ">
              <div className="flex  justify-between w-full items-center">
                <div className="flex">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mt-1 mr-3"
                    size="lg"
                  />
                  <h1 className="text-2xl font-semibold mb-4">
                    Hi, {firstName}
                  </h1>
                </div>

                <span className="text-3xl font-semibold text-center mt-0.5 mb-5">
                  <span className="text-[#4285F4] text-5xl">G</span>
                  <span className="text-[#EA4335] text-5xl">o</span>
                  <span className="text-[#FBBC05] text-5xl">o</span>
                  <span className="text-[#4285F4] text-5xl">g</span>
                  <span className="text-[#34A853] text-5xl">l</span>
                  <span className="text-[#EA4335] text-5xl mr-2">e</span>{" "}
                  <span>Calendar Events</span>
                </span>
                <button
                  onClick={signOut}
                  className="bg-red-500 text-white rounded-lg px-2 h-8 mb-5 text-sm hover:bg-red-600 mt-2"
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    flip="horizontal"
                    className="mr-2"
                  />
                  Sign Out
                </button>
              </div>

              <div className="flex justify-around mt-5">
                <Filter
                  filterDate={filterDate}
                  handleFilterChange={handleFilterChange}
                />
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="bg-blue-500 text-white rounded-lg px-3 h-10 hover:bg-blue-600 pb-1"
                >
                  <span className="text-xl">+ </span>
                  Create Event
                </button>
              </div>

              <EventTable
                events={filteredEvents}
                deleteEvent={(eventId) => deleteEvent(eventId)}
                onEventClick={handleEventClick}
              />
            </div>

            {selectedEvent && showEventDetailsModal && (
              <Modal
                show={showEventDetailsModal}
                onClose={() => setShowEventDetailsModal(false)}
                className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
              >
                <div className="bg-white p-6 rounded-lg  w-96">
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                    Event Details
                  </h3>
                  <p className="text-gray-600">
                    <strong>Event Name:</strong> {selectedEvent.summary}
                  </p>
                  <p className="text-gray-600">
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                  <p className="text-gray-600">
                    <strong>Start:</strong>{" "}
                    {new Date(
                      selectedEvent.start.dateTime || selectedEvent.start.date
                    ).toLocaleString()}
                  </p>
                  <p className="text-gray-600">
                    <strong>End:</strong>{" "}
                    {new Date(
                      selectedEvent.end.dateTime || selectedEvent.end.date
                    ).toLocaleString()}
                  </p>
                  <button
                    onClick={() => setShowEventDetailsModal(false)}
                    className="mt-4 w-full py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
              </Modal>
            )}

            {showCreateEventModal && (
              <Modal
                show={showCreateEventModal}
                onClose={() => setShowCreateEventModal(false)}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Create and add event to your Google Calendar
                  </h3>

                  <div>
                    <p className="mb-1">Start of your event</p>
                    <DateTimePicker onChange={setStartD} value={startD} />
                  </div>

                  <div>
                    <p className="mb-1">End of your event</p>
                    <DateTimePicker onChange={setEndD} value={endD} />
                  </div>

                  <div>
                    <p className="mb-1">Event Name</p>
                    <input
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <p className="mb-1">Event Description</p>
                    <input
                      type="text"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <button
                    onClick={createCalendarEvent}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                  >
                    Create Calendar Event
                  </button>
                </div>
              </Modal>
            )}
          </>
        ) : (
          <SignInButton googleSignIn={googleSignIn} />
        )}
      </div>
    </div>
  );
}

export default App;
