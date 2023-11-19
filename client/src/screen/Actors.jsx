import React, { useEffect, useState } from "react";
import axios from "../state/axios-instance"; // Import Axios

const ActorsList = () => {
  const [actors, setActors] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get("/api/actors", {
          headers: {
            Authorization: accessToken,
          },
        });

        const data = response.data;
        console.log("Actors: ", data);
        setActors(data);
      } catch (error) {
        console.error("Fetching actors error:", error);
      }
    };

    if (accessToken) {
      fetchActors();
    }
  }, [accessToken]);

  return (
    <div>
      <h2>List of Actors</h2>
      <ul>
        {actors.map((actor) => (
          <li key={actor.id}>
            {actor.first_name} {actor.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorsList;
