require('dotenv').config();

const express = require('express');
const { get } = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
// INDEX
app.get('/', (req, res) => {
  res.render('index');
});

// ARTIST SEARCH
app.get('/artist-search', (req, res) => {
  const term = req.query.term;
  spotifyApi
    .searchArtists(term)
    .then((data) => {
      console.log('The received data from the API:', data.body);
      const artists = data.body.artists.items;
      console.log(artists);
      res.render('artist-search-results', { artists });
    })
    .catch((err) =>
      console.log('The error while searching artists occured: ', err)
    );
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log('Album information', data.body);
      const albums = data.body.items;
      res.render('albums', { albums });
    })
    .catch((err) => {
      console.log('The was an Error loading artists albums: ', err);
    });
});

app.get('/album/:albumId', (req, res) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log(data.body);
      const tracks = data.body.items;
      res.render('track-list', { tracks });
    })
    .catch((err) => {
      console.log('There is an error loading the album track');
    });
});

// Next route to do
/*app.get('/album/:albumId', (req, res)=> {
  const {albumId} = req.params;
  spotifyApi
  .getAlbumsTracks(albumId)
  .then((data) => {
    console.log('data.body')
  })
})  */

app.listen(3003, () =>
  console.log('My Spotify project running on port 3003 🎧 🥁 🎸 🔊')
);
