export class AuthorizationHeader
{
  username: string;
  password: string;

  constructor(username: string, password: string)
  {
    this.username = username;
    this.password = password;
  }
}

export default function(header: string): AuthorizationHeader
{
  const headerDecode = Buffer.from(header.replace("Basic ", ""), "base64").toString().trim().split(":");

  return new AuthorizationHeader(headerDecode[0], headerDecode[1]);
}