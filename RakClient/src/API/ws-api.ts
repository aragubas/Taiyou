import { ref } from "@vue/runtime-dom";
import { Manager, Socket } from "socket.io-client";
import { credentials, LoadCredentials } from "../Credentials";

export const manager = new Manager("http://localhost:3313");
export const socket: Socket = manager.socket("/").disconnect();

export class SessionTokenStore
{
  session_token: string;

  constructor(session_token: string)
  {
    this.session_token = session_token;
  }
}

export const Connected = ref(false)
export let SessionToken: SessionTokenStore | null = null;

export function Connect()
{
  LoadCredentials();
  SessionToken = new SessionTokenStore(credentials!.value.session_token);

  console.log(credentials.value.session_token)

  socket.connect();

  socket.emit("authenticate", SessionToken)
}

function handleCredentialsError()
{
  Connected.value = false
  credentials.value.logged_in = false;
  console.log("Credentials error")

}

function handleAuthSuccess()
{
  Connected.value = true
  credentials.value.logged_in = true;
}

socket.on("credential_error", handleCredentialsError);
socket.on("auth_success", handleAuthSuccess)