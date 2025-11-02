import { redis } from "@/lib/redis";

// 3. Create type to represent track
export type Track = {
  name: string
  artists: string[]
  uri: string
  albumImage: string
}

// 1. Update your getAccessToken() function
async function getAccessToken(): Promise<string> {
  const cachedToken = await redis.get('spotify_access_token')

    if (cachedToken) {
      console.log("Using token cached")
      return cachedToken as string;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const credentials = btoa(`${clientId}:${clientSecret}`);
  
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
  
    const data = await res.json();
    const newToken = data.access_token;

    await redis.set('spotify_access_token', newToken, {ex:3540});
    return newToken
  }

  // 2. Add a searchSpotify function 
  export async function searchSpotify(query: string): Promise<Track[]>{
    const access_token = await getAccessToken()
    const searchParams = new URLSearchParams({
      q: query,
      type: 'track',
      limit: '20'
    })

    const res = await fetch(`https://api.spotify.com/v1/search?${searchParams}`,{
      headers:{
        Authorization:`Bearer ${access_token}`,
      },
    })
    const data = await res.json();

    const tracks: Track[] = data.tracks.items.map((item:any)=> ({
      name: item.name,
      artists: item.artists.map((artists: any)=> artists.name),
      uri: item.uri,
      albumImage: item.album.images[0]?.url ||'',
    }))

    return tracks
  }
  