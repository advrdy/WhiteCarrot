import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const EventTable = ({ events, deleteEvent, onEventClick }) => {
  return (
    <div className="text-center my-6">
      <table className="table-auto ml-auto mr-auto border border-gray-200 rounded-lg shadow-xl w-9/12">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
              Event
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
              Start Date & Time
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
              End Date & Time
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700 text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event, index) => (
              <tr
                key={event.id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition`}
                onClick={() => onEventClick(event)}
              >
                <td className="py-3 px-4 text-sm text-gray-800 cursor-pointer">
                  {event.summary || "No Title"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 cursor-pointer">
                  {new Date(
                    event.start.dateTime || event.start.date
                  ).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 cursor-pointer">
                  {new Date(
                    event.end.dateTime || event.end.date
                  ).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent(event.id);
                    }}
                    className="text-white py-1 px-3 rounded-lg text-xl"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="text-red-400 hover:text-red-600"
                    />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="py-4 px-4 text-center text-gray-500 text-sm"
              >
                No events to display. Loading...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
