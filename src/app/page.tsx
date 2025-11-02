
'use client'

import {Box, TextField, List, ListItem, ListItemText, Avatar, ListItemAvatar, ListItemButton, Typography } from '@mui/material'

import { useState, useEffect } from 'react'

import type { Track } from '@/lib/spotify'
import { pink } from '@mui/material/colors'


export default function Home() {
  const [word, setWord] = useState<string>("")
  const [savedWord, setSavedWord] = useState<string>("")
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  useEffect(()=>{
    fetch("/api/word").then((res)=>res.json()).then((data)=>{console.log(data)})

  },[])

  useEffect(()=>{
    if (savedWord) {
      console.log(savedWord)
      searchSpotify(savedWord)
    }
  }, [savedWord])

  const searchSpotify = async (query: string) => {
    const response = await fetch(`/api/search?search=${encodeURIComponent(query)}`)
    const data = await response.json()
    setTracks(data.tracks)
  }

  const handleTrackClick = (track: Track) => {
    setSelectedTrack(track)
  }

  return (
    <Box>
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <img src="https://64.media.tumblr.com/ebe2ccda43d6cf9fdf79e2cf5c8b4f33/tumblr_pg2u7ghbCn1vbdodoo1_500.gif" alt="music gif" style={{width:'200px'}}/>
        <header style={{fontFamily:'Arial', textAlign:'center', color: 'pink'}}>
          <h3> Search for a song on Spotify!</h3>
        </header>
        <Box sx={{display:'flex', justifyContent: 'center', mt:2}}>
          <TextField
            id="word-text"
            label="Enter Song!"
            value={word}
            onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{ setWord(event.target.value) }}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter'){setSavedWord(word)}}}
            />
        </Box>
      </Box>

        {selectedTrack && (
          <Box sx={{textAlign: 'center', mt:4 }}>

            {/* Would show album art, artist name, and song name with minimal styling. Removed for simplisity.  */}

            {/* <img src={selectedTrack.albumImage} alt={selectedTrack.name} style={{width: '200px', height:'200px', display: 'block', margin:'0 auto', border:'4px solid black'}}/>
            <Typography variant="h5" sx={{fontFamily:'Arial', textAlign: 'center'}}>
              <p> {selectedTrack.name} </p>
              <p> {selectedTrack.artists.join(',')} </p>
            </Typography> */}

            <iframe src={`https://open.spotify.com/embed/track/${selectedTrack.uri.split(':')[2]}`} width="100%" height="152" style={{ borderRadius: '20px'}} />
          </Box>
        )}

        <List sx={{ mt: 2}}>
          {tracks.map((track, index) => (
            <ListItem key={index}>
              <ListItemButton onClick={()=> handleTrackClick(track)}>
                <ListItemAvatar>
                  <Avatar src={track.albumImage} alt={track.name} variant="square"/>
                </ListItemAvatar>
                <ListItemText primary={track.name} secondary={track.artists.join(', ')} />
              </ListItemButton>
              </ListItem>
          ))}
        </List>
    </Box>
  );
}
