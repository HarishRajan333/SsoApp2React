import { useContext, useEffect, useState } from "react";
import LoginContext from "./LoginContext";
import axios from "axios";

const getToken = () => {
  return sessionStorage.getItem("accessToken");
};

const Recruiter = () => {
  const [data, setData] = useState("");
  const { logout } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("http://localhost:8081/recruiter/getAts-data", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((resp) => {
        if (resp.status == 200) {
          setData(resp.data);
        }
      });
  }, []);

  return (
    <>
      <h1>{data}</h1>
      <button onClick={() => logout()}>log out</button>
    </>
  );
};

export default Recruiter;
