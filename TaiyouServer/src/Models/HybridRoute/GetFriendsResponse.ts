export default class GetFriendsResponse
{
  usernames: Array<string>;

  constructor(usernames: Array<string>)
  {
    this.usernames = usernames;
  }
}