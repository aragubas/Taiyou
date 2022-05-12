import { ref } from "@vue/runtime-dom";
import { Manager, Socket, io } from "socket.io-client";
import { credentials, LoadCredentials } from "../Credentials";
import { CloseAllWindows, createWindow, getInstance } from "../window-manager";

export const manager = new Manager("http://localhost:3313", { autoConnect: false, reconnection: false });
export let socket: Socket = manager.socket("/");

let lastLoginWindowInstance = "";
let loginWindowClosed: boolean = false;
export function loginWindowClosed_setter(newValue: boolean | undefined ): boolean
{
  if (newValue != undefined) { loginWindowClosed = newValue }
  return loginWindowClosed;
}

export const Connected = ref(false)

export function Connect()
{
  console.log("[ws-api] Trying to connect...");
  LoadCredentials();
  
  socket.disconnect(); // Makes sure that the socket is disconnected before connecting again
  socket.io.opts.extraHeaders = { "x-auth-token": credentials.value.session_token };

  socket.connect();
  
  socket.once("connect", () => { socket.emit("check_auth") })
}

function Disconnected(data?: any)
{
  if (socket.connected) { socket.disconnect(); }
  Connected.value = false
  credentials.value.logged_in = false;

  // Parsers error type for logging
  if (data instanceof Error)
  {
    const message = (data as Error).message;

    switch (message)
    {
      case "credential_error":
        console.log("[ws-api] Connect error due to credential errors.")
        break;
    }
  } else
  {
    console.log("[ws-api] Disconnected!")
  }

  if (loginWindowClosed && !getInstance(lastLoginWindowInstance))
  {
    lastLoginWindowInstance = createWindow({componentPath: "AccountSetup.vue", width: 440, height: 340, closeable: false});
  }
}

function handleCredentialsError()
{
  Disconnected();
  console.log("[ws-api] Runtime Credentials error")
}

function handleAuthSuccess()
{
  Connected.value = true;
  credentials.value.logged_in = true;

  console.log("[ws-api] Successfully authenticated");
}

socket.on("auth_success", handleAuthSuccess);
socket.on("credential_error", handleCredentialsError);
socket.on("disconnect", Disconnected);
socket.on("connect_error", Disconnected);
socket.on("connect_failed", Disconnected);