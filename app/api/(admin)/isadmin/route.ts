import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export async function GET(request: NextRequest) {
   const { isLoaded, isSignedIn, user } = useUser()

   if (!isLoaded || !isSignedIn) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
   }

   if(user?.emailAddresses[0].emailAddress !== "parekhdhrish.pg@gmail.com") {
      return NextResponse.json({ isAdmin: true }, { status: 401 })
   }

   return NextResponse.json({ isAdmin: false }, { status: 200 })
}
