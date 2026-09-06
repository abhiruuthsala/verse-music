export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Artist {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string | null;
  cover_url: string | null;
  release_date: string | null;
  created_at: string;
  artist?: Artist;
}

export interface Song {
  id: string;
  title: string;
  artist_id: string | null;
  album_id: string | null;
  genre_id: string | null;
  cover_url: string | null;
  audio_url: string;
  duration_seconds: number;
  release_date: string | null;
  explicit: boolean;
  created_at: string;
  artist?: Artist;
  album?: Album;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
  song?: Song;
}
