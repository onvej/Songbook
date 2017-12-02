# songbook
## Motivation
To provide an interface to the song database such as [supermusic.sk](http://www.supermusic.sk). The aim is not to create or publish such a database.
## Description
Songbook is web server which allows you
 * to search for songs by title, author or lyrics;
 * to display lyrics and chords of a song;
 * to transpose chords;

The interface has a highly customizable design.
## Dependencies
Python of version 3 is required. Furthemore, you will need [unidecode module](https://pypi.python.org/pypi/Unidecode).
## Usage
In order to start a server which uses database file `example.db`, run
```
./songbook example.db
```
By default the server uses port 1024 and it is accessible only from localhost: 
```
firefox 127.0.0.1:1024
```
The latter can be changed by the argument `--public-server`. Root privilege is needed, however.
## Installation
Files `search.html`, `song.html`, `songs.html`, `script.js`, `style.css` has to be placed in the same folder (e.g., `/usr/share/songbook/`). The path of this folder has is set in the function `runServer` of the script `songbook`. By default, `path = "."`.

The `songbook` file can be placed wherever you want (e.g., `/usr/bin/`).
The same is true for the database file (its path is passed as an argument of `songbook` script).
## Database file
The database file has to be sqlite database with the following structure:
```
CREATE TABLE songs (
  key integer PRIMARY KEY AUTOINCREMENT,
  id integer UNIQUE, 
  type text,
  title text,
  author text,
  lyrics text,
  title_search text,
  author_search text,
  lyrics_search text
 );
```

The `id` schould be an unambiguous identificator of the song. It may be equal to `key`. The `type` should be equal to `"chords"` when the lyrics of the song contain chords. Both columns are somehow linked to the [supermusic database](http://www.supermusic.sk).
There should be the following relationship between `title` and `title_search` columns:
```
title_search = SongDatabase._getSearchVersion( title )
```
See the file `songbook` for details. The analogic relationship should hold for `author`, `author_search` and `lyrics`, `lyrics_search` columns.
A database with the described structure can be created with methods `createTable`, `insertSong` (see the function `createExampleDatabase` in `songbook`).

You can make use of `chord` tag in lyrics:
```
<chord>Am</chord>
```
