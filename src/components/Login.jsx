import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import bgimg from "../images/bgimg.svg";
import { useNavigate } from "react-router-dom";
import LoginContext from "./LoginContext";
import axios from "axios";
import {
  deleteStorages,
  getExpiredTimeStamp,
  getRemainingMilliSeconds,
  setCookieWithTimestampExpiry,
} from "./KeycloakFunctions";
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import { keycloakAxios } from "../service/Const";
import { getAccessTokenByRefreshToken } from "../service/SecurityService";
import {
  keycloakBaseUrl,
  loginDomain,
  refreshTokenEndPoint,
  tokenEndPoint,
} from "../Const/const";

let atsRoles = ["admin", "recuriter", "interviewers"];

function Login({ children }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setroles] = useState([]);
  const cookies = new Cookies();

  useEffect(() => {
    if (getRemainingMilliSeconds(cookies.get("atsRefreshExpires")) > 0) {
      let formData = new URLSearchParams();
      formData.append("client_id", "ats");
      formData.append("grant_type", "refresh_token");
      formData.append("refresh_token", cookies.get("atsRefreshToken"));
      getAccessTokenByRefreshToken();
      let c = {
        clientId: "ats",
        refreshToken: cookies.get("atsRefreshToken"),
      };
      axios.post(refreshTokenEndPoint, c).then((resp) => {
        console.log(resp.data);
        if (resp.status == 200) {
          const checkRoles = atsRoles.some((r) =>
            jwtDecoder(
              resp.data?.value?.access_token
            )?.atsDesignation?.includes(r)
          );
          console.log(
            jwtDecoder(resp.data?.value?.access_token)?.atsDesignation
          );
          if (checkRoles) {
            clearCookies();
            sessionStorage.setItem(
              "accessToken",
              resp.data?.value?.access_token
            );
            sessionStorage.setItem(
              "expiresIn",
              getExpiredTimeStamp(resp.data?.value?.expires_in - 30)
            );
            cookies.set(
              "atsRefreshExpires",
              getExpiredTimeStamp(resp.data?.value?.refresh_expires_in - 30),
              {
                path: "/",
              }
            );
            cookies.set("atsRefreshToken", resp.data?.value?.refresh_token, {
              path: "/",
            });
            setAuthenticated(true);
            mapRoles(resp.data?.value?.access_token);
          }
        }
      });
    } else {
      window.location.href = loginDomain + "/auth/ats";
    }
  }, []);

  const autoLogOut = (remainingMilliSeconds) => {
    if (remainingMilliSeconds > 0) {
      setTimeout(() => {
        logout();
      }, remainingMilliSeconds);
    }
  };

  const clearCookies = () => {
    cookies.remove("atsRefreshExpires", { path: "/" });
    cookies.remove("atsRefreshToken", { path: "/" });
  };

  const logout = () => {
    deleteStorages();
    clearCookies();
    setAuthenticated(false);
    window.location.href = loginDomain + "/auth/ats/logout";
  };

  const mapRoles = (token) => {
    setroles(jwtDecoder(token)?.atsDesignation);
  };

  const jwtDecoder = (token) => {
    try {
      return jwtDecode(token);
    } catch (Error) {
      alert("login failed");
    }
  };

  return !authenticated ? (
    <Box
      sx={{
        m: -1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1a237e",
      }}
    ></Box>
  ) : (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoginContext.Provider value={{ roles, logout }}>
        {children}
      </LoginContext.Provider>
    </Box>
  );
}

export default Login;
