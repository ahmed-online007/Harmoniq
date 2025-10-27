console.log('Code is running Dont try to ruin it !!!');

let currentsong = new Audio();
let songs;
let isDragging = false; // Added for draggable seekbar

function formatTime(seconds) {
    seconds = Math.round(seconds);
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

async function getsongs() {
    let a = await fetch("songs/");
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];
    for (let index = 1; index < as.length; index++) {
        songs.push(as[index].href.split("%5C")[2]);
    }
    return songs;
}

function playmusic(track) {
    currentsong.src = "songs/" + track;
    currentsong.play();
}

async function main() {
    const songs = [
      "Kun%20Anta%20-%20Humood%20Alkhuder.mp3",
      "The%20Way%20of%20The%20Tears%20-%20Muhammad%20al%20Muqit.mp3",
      "Wedding%20Nasheed%20-%20Mohammad%20Al%20Muqit.mp3",
      "Ya%20Nabi%20Salam%20Alayka%20-%20Maher%20Zain.mp3",
      "Taweel%20Al%20Shawq%20-%20Ahmed%20Bukhater.mp3",
      "Love%20and%20Life%20-%20Baraa%20Masoud.mp3",
      "Assubhu%20Bada%20-%20Usaid%20Zahid%20Siddique.mp3",
      "My%20Hope%20-%20Muhammad%20al%20Muqit.mp3"
    ];

    let songul = document.querySelector(".songlist ul");

    for (const song of songs) {
        let songname = song.split('-')[0].replace('.mp3','');
        let artist = song.split('-')[1].replace('.mp3','');
        songul.innerHTML += `<li>
            <img class="invert li-img-1" src="images/music.svg" alt="Music icon">
            <div class="info">
                <div class="sn">${songname.replaceAll('%20',' ')}</div>
                <div>${artist.replaceAll('%20',' ')}</div>
            </div>
            <div class="player">
                <img class="invert li-img-2" src="images/play-svgrepo-com.svg" alt="play icon">
            </div>
        </li>`;
    }

    const listItems = songul.querySelectorAll('li');
    const playBtn = document.getElementById('play');
    const circle = document.querySelector('.seekbar .circle');
    const seekbar = document.querySelector('.seekbar');
    const songtime = document.querySelector('.songtime');

    listItems.forEach(e => {
        e.addEventListener('click', () => {
            const first = e.querySelector('.info div:first-child').innerHTML;
            const second = e.querySelector('.info div:last-child').innerHTML;
            const sound = `${first}-${second}.mp3`;

            playmusic(sound);
            document.querySelector('.songinfo').innerHTML = first;
            songtime.innerHTML = '00:00 / 00:00';

            playBtn.src = 'images/pause.svg';
            playBtn.classList.add('width');
            document.querySelector('.playbar').classList.remove('down');
        });
    });


    // Update time & circle position
    currentsong.addEventListener('timeupdate', () => {
        if (!isDragging && !isNaN(currentsong.duration)) {
            songtime.innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
            circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + '%';
            if (currentsong.currentTime == currentsong.duration) {
                playBtn.src = 'images/refresh.svg';
                playBtn.classList.remove('width');
            };
        }
    });

    // Function to update seekbar during drag or click
    function updateSeek(e) {
        const rect = seekbar.getBoundingClientRect();
        const offsetX = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
        const percent = offsetX / rect.width;
        circle.style.left = percent * 100 + '%';
        currentsong.currentTime = percent * currentsong.duration;
        songtime.innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
    }

    circle.addEventListener('mousedown', () => isDragging = true); // Drag start
    document.addEventListener('mousemove', e => { if (isDragging) updateSeek(e); }); // Drag move
    document.addEventListener('mouseup', e => { if (isDragging) { isDragging = false; updateSeek(e); } }); // Drag end

    // Click on seekbar to jump
    seekbar.addEventListener('click', e => { updateSeek(e); });

    playBtn.addEventListener('click', () => {
        if (currentsong.paused) {
            currentsong.play();
            playBtn.src = 'images/pause.svg';
            playBtn.classList.add('width');
        } else {
            currentsong.pause();
            playBtn.src = 'images/play-svgrepo-com.svg';
            playBtn.classList.remove('width');
        }
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    });
    document.querySelector('.spotifyplaylist').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });

    document.getElementById('previous').addEventListener('click', () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0]);
        if (index > 0) {
            playmusic(songs[index - 1]);
            document.querySelector('.songinfo').innerHTML = songs[index - 1].split('-')[0].replace('.mp3','').replaceAll('%20',' ');
            playBtn.src = 'images/pause.svg';
            playBtn.classList.add('width');
        }
    });
    document.getElementById('next').addEventListener('click', () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0]);
        if (index < songs.length - 1) {
            playmusic(songs[index + 1]);
            document.querySelector('.songinfo').innerHTML = songs[index + 1].split('-')[0].replace('.mp3','').replaceAll('%20',' ');
            playBtn.src = 'images/pause.svg';
            playBtn.classList.add('width');
        };
    });

    Array.from(document.getElementsByClassName('card')).forEach(e=>{
        e.addEventListener('click', () =>{
            let h = e.getElementsByTagName('h4')[0].innerHTML;
            let s = e.dataset.sn
            let decode = s.replaceAll(' ', '%20');
            playmusic(decode);

            playBtn.src = 'images/pause.svg';
            playBtn.classList.add('width');
            document.querySelector('.playbar').classList.remove('down');

            document.querySelector('.songinfo').innerHTML = h;
        });
    })
}

main();






