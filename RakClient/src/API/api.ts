import { Axios } from "axios";
import { SaveCredentials } from "../Credentials";
import ErrorResponse from "./Models/ErrorResponse";
import LoginResponse from "./Models/LoginResponse";

export const ApiClient = new Axios({
  baseURL: "http://localhost:3314/",
})

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

export async function Register(email: string, username: string, password: string): Promise<OperationResult | undefined>
{
  const request = await ApiClient.post("/", { email: email, username: username, password: password });

  if (request.status === 200)
  {
    const response = 
  }

  return undefined;
}

export async function Login(email: string, password: string): Promise<OperationResult | undefined>
{
  const request = await ApiClient.get("/user", { auth: { username: email, password: password } });

  if (request.status == 401)
  {
    const response = request.data as ErrorResponse;
    
    switch (response.message)
    {
      case "invalid_credentials":
        return new OperationResult(false, "Invalid credentials.");

      default:
        return new OperationResult(false, "Unknown error.");
    }

  } else if (request.status == 200)
  {
    const response = JSON.parse(request.data) as LoginResponse;

    SaveCredentials(response.access_token, response.username, response.user_id);

    return new OperationResult(true, "Successfully logged in.");
  }

  return undefined;
}