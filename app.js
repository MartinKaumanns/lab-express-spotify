require('dotenv').config();

const express = require('express');
const { get } = require('express/lib/response');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const app = express();

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist-search', (req, res) => {
  const artist = req.query.Artist;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log(
        'The received data from the API:',
        data.body.artists.items[0].images[0]
      );
      res.render('artist-search-results', { data: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occured: ', err)
    );
});

app.listen(3003, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
