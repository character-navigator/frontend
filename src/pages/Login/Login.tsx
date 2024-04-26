import LoginView from "./LoginView";
import Footer from "../../components/Footer/FooterView";
import { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "../../config/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function onSubmit() {
    axios
      .post("authenticate", { username, password })
      .then((response) => {
        if (response.status === 200) {
          setError("");
          navigate("/book-selector");
        }
      })
      .catch(() => {
        setError("Invalid credentials. Please try again.");
      });
  }

  return (
    <div className="background">
      <LoginView
        error={error}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        onSubmit={onSubmit}
      />
      <Footer />
    </div>
  );
}

export default Login;

