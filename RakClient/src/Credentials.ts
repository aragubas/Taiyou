import { Ref, ref } from "@vue/runtime-core";

class StoredCredentals
{
  session_token: string = "";
  username: string = "";
  userID: string = "";
  logged_in: boolean = false;
}

export let credentials: Ref<StoredCredentals> = ref(new StoredCredentals());

export function SaveCredentials(session_token: string, username: string, userID: string)
{
  const newCredentials = new StoredCredentals();
  newCredentials.session_token = session_token;
  newCredentials.username = username;
  newCredentials.userID = userID;
  newCredentials.logged_in = true;

  localStorage.setItem("credentials", JSON.stringify(newCredentials));
  LoadCredentials();
}

export function LoadCredentials()
{
  let storedCredentials = localStorage.getItem("credentials");
  
  if (storedCredentials)
  {
    credentials.value = JSON.parse(storedCredentials) as StoredCredentals;
    
  }


}