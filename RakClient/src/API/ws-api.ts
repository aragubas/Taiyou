import { ref } from "@vue/runtime-dom";
import { Manager, Socket } from "socket.io-client";
import { credentials, LoadCredentials } from "../Credentials";
import { CloseAllWindows, createWindow, getInstance } from "../window-manager";

export const manager = new Manager("http://localhost:3313");
export const socket: Socket = manager.socket("/").disconnect();

let loginWindowClosed: boolean = false;
export function si(newValue: boolean | undefined ): boolean
{
  if (newValue != undefined) { loginWindowClosed = newValue }
  return loginWindowClosed;
}

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

  socket.connect();

  socket.emit("authenticate", SessionToken)
}

function Disconnected()
{
  if (socket.connected) { socket.disconnect(); }
  Connected.value = false
  credentials.value.logged_in = false;
}

function handleCredentialsError()
{
  Disconnected();
  console.log("Credentials error")

  if (loginWindowClosed)
  {
    createWindow({componentPath: "AccountSetup.vue", width: 440, height: 340, closeable: false});
  }

}

function handleAuthSuccess()
{
  Connected.value = true;
  credentials.value.logged_in = true;

  console.log("Successfully authenticated");
}

socket.on("credential_error", handleCredentialsError);
socket.on("auth_success", handleAuthSuccess);
socket.on("disconnect", Disconnected);