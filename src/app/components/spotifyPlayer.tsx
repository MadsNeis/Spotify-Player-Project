'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpotifyPlayer(props: { uri: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Load the IFrame API once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      IFrameAPI.createController(containerRef.current, {
        uri: props.uri,
        width: 600,
        height: 200,
        theme: 'dark',
      }, (controller: any) => {
        controllerRef.current = controller;
        controller.addListener('ready', () => setReady(true));
      });
    };

    return () => {
      if (controllerRef.current) controllerRef.current.destroy();
      document.body.removeChild(script);
      delete (window as any).onSpotifyIframeApiReady;
    };
  }, []); // ← only run on mount

  // Update the URI dynamically when props.uri changes
  useEffect(() => {
    if (ready && controllerRef.current) {
      controllerRef.current.loadUri(props.uri);
      // controllerRef.current.play();
    }
  }, [props.uri, ready]);

  return <div style={{ margin: "50px" }} ref={containerRef} />;
}