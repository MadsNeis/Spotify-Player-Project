import { NextRequest } from "next/server"

import { searchSpotify } from "@/lib/spotify"

// Add an API route for searching

export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('search')

    if (!query){
        return Response.json({message: "Please enter query"})
    }

    const tracks = await searchSpotify(query)
    return Response.json({ tracks })
}