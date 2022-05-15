import { Axios } from "axios";
import { UserCredentialsStore } from "../store/UserCredentialsStore";
import ErrorResponse from "./Models/ErrorResponse";
import GetUserResponse from "./Models/LoginResponse";

export class OperationResult
{
  success: boolean;
  message: string;

  constructor(success?: boolean, message?: string)
  {
    if (success == null) { this.success = false; } else { this.success = success; }
    if (message == null) { this.message = ""; } else { this.message = message; }
  }
}

export const ApiClient = new Axios({
  baseURL: "http://localhost:3314/",
  headers: {
    "Content-Type": "application/json",
  }
})

export async function Login(email: string, password: string): Promise<OperationResult | undefined>
{
  try
  {
    const request = await ApiClient.get("/user", { auth: { username: email, password: password } });
  
    if (request.status == 401)
    {
      const response = JSON.parse(request.data) as ErrorResponse;

      switch (response.message)
      {
        case "invalid_credentials":
          console.log("[http-api] Error! invalid credentials")
          return new OperationResult(false, "Username or password invalid.");
  
        default:
          console.log(`[http-api] Unknown error: ${response.message}`)
          return new OperationResult(false, "Unknown error.");
      }
  
    } else if (request.status == 200)
    {
      const response = JSON.parse(request.data) as GetUserResponse;
  
      const credentials = UserCredentialsStore();
      credentials.SessionToken = response.access_token;
      credentials.Username = response.username;
      credentials.UserID = response.user_id;
      credentials.SaveCredentials();

      console.log("[http-api] Successful response from user endpoint")
      return new OperationResult(true, "Successfully logged in.");
    }
  
    return undefined;

  } catch (exception)
  {
    return undefined;
  }
}
