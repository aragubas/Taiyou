import { Axios } from "axios";
import { SaveCredentials } from "../Credentials";
import ErrorResponse from "./Models/ErrorResponse";
import * as ServerLoginResponse from "./Models/LoginResponse";

export const ApiClient = new Axios({
  baseURL: "http://localhost:3314/",
})

export class LoginResponse
{
  success: boolean;
  message: string;

  constructor(success?: boolean, message?: string)
  {
    if (success == null) { this.success = false; } else { this.success = success; }
    if (message == null) { this.message = ""; } else { this.message = message; }
  }
}

export async function Login(email: string, password: string): Promise<LoginResponse | undefined>
{
  const request = await ApiClient.get("/user", { auth: { username: email, password: password } });

  if (request.status == 401)
  {
    const response = request.data as ErrorResponse;
    
    switch (response.message)
    {
      case "invalid_credentials":
        return new LoginResponse(false, "Invalid credentials.");

      default:
        return new LoginResponse(false, "Unknown error.");
    }

  } else if (request.status == 200)
  {
    const response = JSON.parse(request.data) as ServerLoginResponse.default;

    SaveCredentials(response.access_token, response.username, response.user_id);

    return new LoginResponse(true, "Successfully logged in.");
  }

  return undefined;
}