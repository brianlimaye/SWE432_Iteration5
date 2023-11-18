var express = require('express');
var app = express();

const bodyParser = require('body-parser');

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');
var songInfos = require('./models/songInfos.js');
var comments = require('./models/comments.js');
var saves = require('./models/saves.js');

var db;
var currSongs;
var songNames;

const uri = "mongodb+srv://blimaye:1fNhbEi1dERRufQP@cluster0.x5vrqdd.mongodb.net/song?retryWrites=true&w=majority";

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(8080);


const start = async() => {
    try {
        await mongoose.connect(uri);
        db = mongoose.connection;

        console.log('App listening on port 8080');

        var currSongs = await songInfos.find({});
        songNames = ['Chosen', 'Nonstop', 'SOTOTW'];

        if(currSongs.length == 0) {
            const songs = [ { title: 'Chosen', artist: 'Blxst', genre: 'Hip-Hop', duration: 162, year: 2020, moreinfo: 'Chosen is a song by American rapper Blxst, featuring American singer Ty Dolla Sign and fellow American rapper Tyga. It was released as a single from the deluxe version of Blxst debut EP No Love Lost on December 4, 2020, through Red Bull Records and Evgle.'},
                            { title: 'Nonstop', artist: 'Drake', genre: 'Hip-Hop', duration: 239, year: 2018, moreinfo: 'Nonstop is a song by Canadian musician Drake from his fifth studio album, Scorpion (2018). It was released as the sixth single from the album on July 31, 2018.' },
                            { title: 'SOTOTW', artist: 'Burna Boy', duration: 183, year: 2023, moreinfo: 'Sittin on Top of the World is a song by Nigerian singer Burna Boy, released on June 1, 2023 as the lead single from his seventh studio album I Told Them... (2023).' }
                          ];

            for(let i = 0; i < songs.length; i++) {
                var song = new songInfos({title: songs[i].title, artist: songs[i].artist, genre: songs[i].genre, duration: songs[i].duration, year: songs[i].year, moreinfo: songs[i].moreinfo});
                song.save();
            }
        }
    }
    catch(e) {
        console.log(e.message);
    }
};

start();

// use res.render to load up an ejs view file

app.get('/', function (req, res) {
    res.send('Welcome to the home page!');
});

// listener page
app.get('/listener', async function (req, res) {

    var postedComments = await comments.find({});
    var songList = await songInfos.find({});
    var savedList = await saves.find({});
    var username = "Jimmy";
    res.render('pages/listener', {
        username: username,
        songList: songList,
        comments: comments,
        savedList: savedList
    });
});

app.get('/getSongList', async (req, res) => {
  try {
    const songList = await songInfos.find({});
    res.json({ success: true, songList });
  } catch (error) {
    console.error('Error fetching song list:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/insertComment', async (req, res) => {
    try {
        const { message } = req.body;
        const newComment = new comments({ message });
        await newComment.save();
        res.json({ success: true, message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/saveSong', async (req, res) => {
    try {
        const { songTitle } = req.body;

        const ssong = await songInfos.findOne({ title: songTitle });

        if (ssong) {
            const savedSong = new saves({
                songTitle: ssong.title,
            });

            await savedSong.save();

            res.json({ success: true, message: 'Song saved successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Song not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/addCustomSong', async (req, res) => {
    try {
        const { title, artist, genre, duration, year, moreinfo } = req.body;

        const customSong = new songInfos({ title: title, artist: artist, genre: genre, duration: duration, year: year, moreinfo: moreinfo });
        await customSong.save();

        res.json({ success: true, message: 'Custom song added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/resetData', async (req, res) => {

    const savesCollection = mongoose.connection.collections['saves'];

    if(savesCollection) {
        await savesCollection.deleteMany({});
    }

    const songInfosCollection = mongoose.connection.collections['songinfos'];

    if (songInfosCollection) {
        await songInfosCollection.deleteMany({ title: { $nin: songNames } });
    }

    res.json({ success: true });
});


// producer page
app.get('/producer', function (req, res) {
    var username = "Producer User";
    res.render('pages/producer', {
        username: username
    });
});

// DJ page
app.get('/dj', function (req, res) {
    var username = "DJ User";
    res.render('pages/dj', {
        username: username
    });
});