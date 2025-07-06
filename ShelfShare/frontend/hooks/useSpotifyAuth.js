import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SPOTIFY_CLIENT_ID = 'e1036862aaee48f6808fad6752a055b7'
// THIS IS DEPRECATED!!!! - This is why it isnt working.
// https://github.com/expo/fyi/blob/main/auth-proxy-migration.md
const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
console.log(redirectUri)

export function useSpotifyAuth() {
  // EXPO built-in PKCE Authorisation function - creates and hashes code.
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: ['user-read-private', 'user-read-email'],
      redirectUri,
      usePKCE: true,
    },
    discovery
  );

  // If authorisation was a success...
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      // Send code and code_verifier to backend for token exchange.
      const exchangeCodeForToken = async () => {
        const code_verifier = await SecureStore.getItemAsync('expo-auth-session-code-verifier');
        const res = await fetch('http://127.0.0.1:3001/spotify/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier,
            redirect_uri: redirectUri,
          }),
        });

        const data = await res.json();
        console.log('Access Token:', data.access_token);
        console.log('Refresh Token:', data.refresh_token);
        console.log('Spotify ID:', data.spotify_id);
        console.log('Email:', data.email)
      };

      exchangeCodeForToken();
    }
  }, [response]);

  return { promptAsync };
}



