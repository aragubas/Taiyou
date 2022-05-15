import { defineStore } from "pinia";

class StoredCredentals
{
  Username: string = "";
  UserID: string = "";
  SessionToken: string = "";
  
  constructor (username: string, userID: string, sessionToken: string)
  {
    this.Username = username;
    this.UserID = userID;
    this.SessionToken = sessionToken;
  }
}

export const UserCredentialsStore = defineStore("UserCredentialsStore", {
  state: () => 
  { 
    return { 
      Username: "Mr Sinas",
      UserID: "",
      SessionToken: "",
      IsLoggedIn: false,
    } 
  },

  actions: {
    LogIn(username: string, userID: string)
    {
      this.Username = username;
      this.UserID = userID;
      this.IsLoggedIn = true;
    },
    
    SaveCredentials()
    {
      const credentialsObj = new StoredCredentals(this.Username, this.UserID, this.SessionToken);

      localStorage.setItem("credentials", JSON.stringify(credentialsObj));
    },

    LoadCredentials()
    {
      const savedCredentials = localStorage.getItem("credentials");
      if (!savedCredentials) {  return; }
      const credentialsObj = JSON.parse(savedCredentials) as StoredCredentals;

      this.Username = credentialsObj.Username;
      this.UserID = credentialsObj.UserID;
      this.SessionToken = credentialsObj.SessionToken;
    },

    LogOff()
    {
      this.Username = "";
      this.UserID = "";
      this.IsLoggedIn = false;

      this.SaveCredentials();
    }
  }
})