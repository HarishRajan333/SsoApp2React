import Cookies from "universal-cookie";
import { keycloakAxios } from "./Const";

const token_endpoint = "/realms/bassure/protocol/openid-connect/token";

export const getAccessTokenByRefreshToken = async () => {
  let formData = new URLSearchParams();
  const cookies = new Cookies();
  formData.append("client_id", "ats");
  formData.append("grant_type", "refresh_token");
  formData.append("refresh_token", cookies.get("atsRefreshToken"));
  try {
    let response = await keycloakAxios.post(token_endpoint, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (error) {
    window.location.href = "http://localhost:3000/auth/ats";
  }
};
