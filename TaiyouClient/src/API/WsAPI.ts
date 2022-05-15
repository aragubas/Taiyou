import { ref } from "@vue/runtime-dom";
import { Manager, Socket, io } from "socket.io-client";
import { UserCredentialsStore } from "../store/UserCredentialsStore";

export const manager = new Manager("http://localhost:3313", { autoConnect: false, reconnection: false });
export let socket: Socket = manager.socket("/");
export const Connected = ref(false)

export function Connect()
{
  console.log("[ws-api] Trying to connect...");
  const userStore = UserCredentialsStore();
  userStore.LoadCredentials();
  
  socket.disconnect(); // Makes sure that the socket is disconnected before connecting again
  socket.io.opts.extraHeaders = { "x-auth-token": userStore.SessionToken };

  socket.connect();
  
  socket.once("connect", () => { socket.emit("check_auth") })
}

export function Disconnect()
{
  socket.disconnect();
  console.log("[ws-api] Manually disconnected");
}

function Disconnected(data?: any)
{
  if (socket.connected) { socket.disconnect(); }
  Connected.value = false
  UserCredentialsStore().LogOff();


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
}

function handleCredentialsError()
{
  Disconnected();
  console.log("[ws-api] Runtime Credentials error")
}

function handleAuthSuccess()
{
  Connected.value = true;
  console.log("[ws-api] Successfully authenticated");

  const userStore = UserCredentialsStore();

  userStore.IsLoggedIn = true;
}

socket.on("auth_success", handleAuthSuccess);
socket.on("credential_error", handleCredentialsError);
socket.on("disconnect", Disconnected);
socket.on("connect_error", Disconnected);
socket.on("connect_failed", Disconnected);