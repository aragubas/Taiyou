import { Ref, ref } from "@vue/runtime-core";

class StoredCredentals
{
  session_token: string;
  username: string;
  userID: string;

  constructor(username: string, userID: string, session_token: string) {
    this.username = username;
    this.userID = userID;
    this.session_token = session_token;
  }
}

export let credentials: Ref<StoredCredentals> | null = null;

export function SaveCredentials(session_token: string, username: string, userID: string)
{
  credentials = ref(new StoredCredentals(username, userID, session_token));
  localStorage.setItem("credentials", JSON.stringify(credentials.value));
}

export function LoadCredentials()
{
  let storedCredentials = localStorage.getItem("credentials");
  if (storedCredentials)
  {
    credentials = ref(JSON.parse(storedCredentials));
  }
}