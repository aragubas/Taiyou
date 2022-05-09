import { ref } from "@vue/runtime-dom";
import { Manager, Socket } from "socket.io-client";
import { credentials, LoadCredentials } from "../Credentials";
import { CloseAllWindows, createWindow, getInstance } from "../window-manager";

export const manager = new Manager("http://localhost:3313", { autoConnect: false, reconnection: false });
export const socket: Socket = manager.socket("/");

let loginWindowClosed: boolean = false;
export function loginWindowClosed_setter(newValue: boolean | undefined ): boolean
{
  if (newValue != undefined) { loginWindowClosed = newValue }
  return loginWindowClosed;
}

export const Connected = ref(false)
export function SessionToken() { return { session_token: credentials.value.session_token } }

export function Connect()
{
  console.log("Connecting...");
  LoadCredentials();

  socket.connect();

  socket.emit("authenticate", SessionToken())
}

function Disconnected()
{
  if (socket.connected) { socket.disconnect(); }
  Connected.value = false
  credentials.value.logged_in = false;

  if (loginWindowClosed)
  {
    createWindow({componentPath: "AccountSetup.vue", width: 440, height: 340, closeable: false});
  }
  console.log("Disconnected!")
}

function handleCredentialsError()
{
  Disconnected();
  console.log("Credentials error")
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
socket.on("connect_error", Disconnected);
socket.on("connect_failed", Disconnected);