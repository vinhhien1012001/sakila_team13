import React, { useState } from "react";
import axios from "../state/axios-instance";
import { useNavigate } from "react-router-dom";

const Login = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });

      const data = response.data;
      //   setAccessToken(data.accessToken); // Set accessToken received from the server
      console.log("ACCESS TOKEN: ", data);
      localStorage.setItem("accessToken", data.accessToken);
      //   localStorage.setItem("accessToken", data.accessToken); // Store access token

      navigate("/actors-list");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
