import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SK,
});

export async function POST(request) {
    
  // Get the current user from your database
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }


  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user?.primaryEmailAddress?.emailAddress
    
  );
  
 const {searchParams}=new URL(request.url)
  const roomId=searchParams.get('roomId')
 session.allow(roomId,session?.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}