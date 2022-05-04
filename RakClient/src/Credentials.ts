import { ref } from "@vue/runtime-core";

class StoredCredentals
{
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

export let credentials = ref(new StoredCredentals("silas"));

export function SaveCredentials(username: string)
{
  credentials.value = new StoredCredentals(username);
  localStorage.setItem("credentials", JSON.stringify(credentials.value));
}

export function LoadCredentials()
{
  let storedCredentials = localStorage.getItem("credentials");
  if (storedCredentials)
  {
    credentials.value = JSON.parse(storedCredentials);
  }
}