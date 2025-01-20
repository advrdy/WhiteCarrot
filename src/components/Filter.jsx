const Filter = ({ filterDate, handleFilterChange }) => {
  return (
    <label className="bg-blue-500 text-white rounded-lg px-3 h-10 hover:bg-blue-600">
      Filter by Date:
      <input
        type="date"
        value={filterDate}
        onChange={(e) => handleFilterChange(e.target.value)}
        style={{ width: "150px" }}
        className="bg-blue-500 text-white rounded-lg px-3 h-10 hover:bg-blue-600 cursor-pointer"
      />
    </label>
  );
};

export default Filter;
