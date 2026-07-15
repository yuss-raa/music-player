const API_KEY = import.meta.env.VITE_YT_API_KEY;
const BASE = 'https://www.googleapis.com/youtube/v3';

// static sidebar/link data (not fetchable, kept as-is)
export const browseMusicLinks = [
  { id: 'discover', label: 'Discover', icon: 'faCompass' },
  { id: 'genre', label: 'Genre', icon: 'faMusic' },
  { id: 'top-charts', label: 'Top Charts', icon: 'faChartLine' },
  { id: 'collabs', label: 'Collabs', icon: 'faUserFriends' },
  { id: 'free-music', label: 'Free Music', icon: 'faHeadphones' },
  { id: 'stations', label: 'Stations', icon: 'faBroadcastTower' },
];

export const yourMusicLinks = [
  { id: 'favourites', label: 'Favourites', icon: 'faHeart' },
  { id: 'history', label: 'History', icon: 'faHistory' },
];

export const playlistLinks = [
  { id: 'public', label: 'Public Playlist', icon: 'faPlayCircle' },
  { id: 'purchased', label: 'Purchased', icon: 'faMusic' },
  { id: 'my-first', label: 'My First Playlists', icon: 'faList' },
];

export const HERO_QUERY = 'Astrid S official music video';

// Maps sidebar link ids to YouTube search queries
export const categoryQueries = {
  discover: 'trending music 2026',
  genre: 'pop hits playlist',
  'top-charts': 'top charts music',
  collabs: 'collaboration song feat',
  'free-music': 'royalty free music',
  stations: 'live radio station music',
  favourites: null, // handled locally via liked state
  history: null, // handled locally
  public: 'public playlist music mix',
  purchased: 'best selling songs',
  'my-first': 'starter playlist beginner favorites',
};

const _cache = new Map();

const FALLBACK_SONGS = [
  { id: 'fb1', videoId: '4S6mesJoezc', title: 'Remixes', name: 'Remixes', artist: 'Flume', image: '/1.png', duration: '3:20' },
  { id: 'fb2', videoId: 'Kj6qSVLYFvk', title: 'Ace', name: 'Ace', artist: 'Else', image: '/2.png', duration: '2:58' },
  { id: 'fb3', videoId: 'lYBUbBu4W08', title: "How'd You Like It", name: "How'd You Like It", artist: 'Rosie Lowe', image: '/3.png', duration: '4:01' },
  { id: 'fb4', videoId: '2Vv-BfVoq4g', title: 'Take a Chance', name: 'Take a Chance', artist: 'Else', image: '/4.png', duration: '3:12' },
  { id: 'fb5', videoId: 'kOkQ4T5WO9E', title: 'Skin: The Remixes', name: 'Skin: The Remixes', artist: 'Flume', image: '/5.png', duration: '3:45' },
  { id: 'fb6', videoId: 'CevxZvSJLk8', title: '1978', name: '1978', artist: 'Else, Lorde', image: '/6.jpg', duration: '3:33' },
];

export async function fetchSongs(query, maxResults = 6) {
  const cacheKey = `${query}|${maxResults}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  try {
    const result = await fetchFromAPI(query, maxResults);
    if (result && result.length) {
      _cache.set(cacheKey, result);
      return result;
    }
    return pickFallback(query, maxResults);
  } catch (err) {
    console.warn('YouTube API failed, using fallback data:', err.message);
    return pickFallback(query, maxResults);
  }
}

function pickFallback(query, maxResults) {
  let hash = 0;
  for (let i = 0; i < query.length; i++) hash = (hash * 31 + query.charCodeAt(i)) % FALLBACK_SONGS.length;
  const rotated = [...FALLBACK_SONGS.slice(hash), ...FALLBACK_SONGS.slice(0, hash)];
  return rotated.slice(0, maxResults);
}

async function fetchFromAPI(query, maxResults) {

  if (!API_KEY) {
    console.warn('Missing VITE_YT_API_KEY');
    return [];
  }
  const searchUrl = `${BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  const res = await fetch(searchUrl);
  const data = await res.json();
  if (!data.items) return [];

  const ids = data.items.map((i) => i.id.videoId).join(',');
  const detailsRes = await fetch(`${BASE}/videos?part=contentDetails&id=${ids}&key=${API_KEY}`);
  const details = await detailsRes.json();

  const result = data.items.map((item, idx) => {
    const dur = details.items?.[idx]?.contentDetails?.duration;
    return {
      id: item.id.videoId,
      videoId: item.id.videoId,
      title: item.snippet.title,
      name: item.snippet.title,
      artist: item.snippet.channelTitle,
      image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      duration: dur ? formatISODuration(dur) : '—',
    };
  });
  return result;
}

function formatISODuration(iso) {
  const m = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const s = parseInt(m[3] || 0);
  const totalMin = h * 60 + min;
  return `${totalMin}:${s.toString().padStart(2, '0')}`;
}
