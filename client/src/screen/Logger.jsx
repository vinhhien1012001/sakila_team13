import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "../state/axios-instance";

const Logger = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: ({ value }) => formatTimestamp(value),
      },
      {
        Header: "Level",
        accessor: "level",
      },
      {
        Header: "Message",
        accessor: "message",
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/logs");
      const data = response.data;
      console.log("Data fetch:", data);
      setData(data);
      // Update the data in the table
      // setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data, // Initial empty data
    });

  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <React.Fragment>
      <div className="screen">
        <div className="center-content">
          <div>
            {/* <button onClick={fetchData}>Reload Data</button> */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={fetchData}
            >
              Fetch Logger
            </button>
            <table {...getTableProps()} className="table">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Logger;
