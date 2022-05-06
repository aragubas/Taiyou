import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { IncomingHttpHeaders } from 'http';
import { v4 } from 'uuid';
import BasicAuthHeaderDecode from '../Utils/BasicAuthHeaderDecode';

let router = Router();
const prisma = new PrismaClient();
export default router;

interface CreateUserRequest
{
  username: string;
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

// Create a new user
router.post("/", async (request, response) =>{
  const createRequest = (request.body as CreateUserRequest);

  // TODO: Check if request data is correct

  // Check if user already exists
  const userUsername = await prisma.user.findUnique({ where: { username: createRequest.username } });
  const userEmail = await prisma.user.findUnique({ where: { email: createRequest.email } })

  if (userUsername != null || userEmail != null)
  {
    response.statusCode = 400;
    response.send(new GenericResponse("user_already_exists"));
    return;
  }

  const newUser = await prisma.user.create({ data: { email: createRequest.email, password: createRequest.password, username: createRequest.username } })

  response.send(new GetUserResponse(await getUserToken(newUser.id), newUser.id, newUser.username));
})

async function getUserToken(userID: string) : Promise<string>
{
  const storedToken = await prisma.sessionToken.findUnique({
    where:
    {
      ownerID: userID,
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
        ownerID: userID,
      }
    })
    
    return token;
  }
  
  return storedToken.token;
}

// Get me request
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
    response.status(401).send(new GenericResponse("invalid_credentials"));
    return;
  }

  // Check if password is valid
  if (user.password != getUserRequest.password)
  {
    response.status(401).send(new GenericResponse("invalid_credentials"));
    return;
  }

  response.send(new GetUserResponse(await getUserToken(user.id), user.id, user.username));
})