import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { IncomingHttpHeaders } from 'http';
import { v4 } from 'uuid';
import BasicAuthHeaderDecode from '../Utils/BasicAuthHeaderDecode';

let router = Router();
const prisma = new PrismaClient();

interface GetUserRequest
{
  email: string;
  password: string;
}

class GenericResponse
{
  message: string;
  constructor (message: string) {
    this.message = message;
  }
}

class GetUserResponse extends GenericResponse
{
  access_token: string;
  user_id: string;
  username: string;

  constructor (access_token: string, user_id: string, username: string) {
    super("success");
    this.access_token = access_token;
    this.user_id = user_id;
    this.username = username;
  }
}

router.get("/", async (request, response) =>{
  // Check if authorization header is present
  if (request.headers.authorization == undefined)
  {
    response.status(401).send(new GenericResponse("invalid_credentials"));
    return;
  }
  const getUserRequest = BasicAuthHeaderDecode(request.headers.authorization);
  
  // Get user by email
  const user = await prisma.user.findUnique({
    where: {
      email: getUserRequest.username,
    }
  })

  // Check if user exists
  if (user == null)
  {
    response.status(401).send(JSON.stringify(new GenericResponse("invalid_credentials")));
    return;
  }

  // Check if password is valid
  if (user.password != getUserRequest.password)
  {
    response.status(401).send(JSON.stringify(new GenericResponse("invalid_credentials")));
    return;
  }

  const storedToken = await prisma.sessionToken.findUnique({
    where:
    {
      ownerID: user.id,
    }
  })

  // Create access token if it doesn't exist
  if (storedToken == null)
  {
    // Create token
    const token = `${v4()}.${new Date().getTime()}`;

    const newStoredToken = await prisma.sessionToken.create({
      data: {
        token: token,
        ownerID: user.id,
      }
    })
    
    response.send(JSON.stringify(new GetUserResponse(token, user.id, user.username)));
    return;
  }

  response.send(JSON.stringify(new GetUserResponse(storedToken.token, storedToken.ownerID, user.username)));
})

export default router;