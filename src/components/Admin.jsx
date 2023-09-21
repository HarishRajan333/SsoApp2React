import { useContext, useEffect, useState } from "react";
import LoginContext from "./LoginContext";
import axios from "axios";
import {
  getAccessToken,
  getAccessTokenByRefreshToken,
} from "../service/SecurityService";
import { getExpiredTimeStamp } from "./KeycloakFunctions";

const getToken = () => {
  return sessionStorage.getItem("accessToken");
};

const Admin = () => {
  const [data, setData] = useState("");
  const { logout } = useContext(LoginContext);

  useEffect(() => {
    axios
      .get("http://localhost:8081/admin/getAts-data", {
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

  const [getData1, setGetData1] = useState("");

  const getData = async () => {
    try {
      axios
        .get("http://localhost:8081/admin/getAts-data", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            setGetData1(resp.data);
          }
        })
        .catch((error) => {
          if (error?.response?.status == 401) {
            getAccessTokenByRefreshToken().then((resp) => {
              sessionStorage.setItem("accessToken", resp.data?.access_token);
              sessionStorage.setItem(
                "expiresIn",
                getExpiredTimeStamp(resp.data?.expires_in - 30)
              );
              getData();
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>{data}</h1>
      <button onClick={() => getData()}>Get Data</button>
      <h1>{getData1}</h1>
      <button onClick={() => logout()}>log out</button>
    </>
  );
};

export default Admin;
