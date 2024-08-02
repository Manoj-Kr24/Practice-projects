console.log("Writing java Script!!");

let songs = [];

let currentSong = new Audio();

function formatTime(seconds) {

  if(isNaN(seconds)|| seconds<0){
    return '00:00';
  }
  // Round the total seconds to the nearest whole number
  let totalSeconds = Math.round(seconds);

  // Calculate minutes and remaining seconds
  let minutes = Math.floor(totalSeconds / 60);
  let remainingSeconds = totalSeconds % 60;

  // Format minutes and seconds to always be two digits
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Combine minutes and seconds
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/SpotifyClone/songs");

  let response = await a.text();
  // console.log(response);

  let div = document.createElement("div");

  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  // console.log(as);

  let songs = [];

  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href.split("/songs/")[1]);
    }
  }

  // console.log(songs);
  return songs;
}

function playMusic(name, artist, pause = false) {
  console.log("/songs/" + name + "-" + artist + ".mp3");
  let track = "songs/" + name + "-" + artist + ".mp3";

  currentSong.src = track;
  if (!pause) {
    // currentSong.src = decodeURI(songs[0]);
    currentSong.play();
    playBtn.src = "pause.svg";
  }

  // currentSong.paused=pause;

  document.querySelector(".songinfo").innerHTML = name + "-" + artist + ".mp3";
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}

async function main() {
  songs = await getSongs();
  console.log(songs);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  //   console.log(songUL);

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
    <li>
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div class="name">${
                    song
                      .replaceAll("%20", " ")
                      .replaceAll("%5B", "[")
                      .replaceAll("%5D", "]")
                      .split("-")[0]
                  }</div>
                  <div class="artist">${
                    song
                      .replaceAll("%20", " ")
                      .replaceAll("%5B", "[")
                      .replaceAll("%5D", "]")
                      .replaceAll(".mp3", " ")
                      .trim()
                      .split("-")[1]
                  }</div>
                  
                </div>
                <div class="playNow">
                  Play Now
                  <img class="invert" src="playsong.svg" alt="">
                </div>
                
              </li>`;
  }

  //   console.log(songUL);

  

  if (songs.length != 0) {
    let fname = document
      .querySelector(".songList")
      .getElementsByTagName("li")[0]
      .querySelector(".name").innerHTML;

    //   console.log(fname);
    let fartist = document
      .querySelector(".songList")
      .getElementsByTagName("li")[0]
      .querySelector(".artist").innerHTML;
    let track = "songs/" + fname + "-" + fartist + ".mp3";

    // console.log("hi............................",track)
    // currentSong.src = track;
    // console.log('hiiiiiiiiiiiiiiiiiiiii.....',decodeURI(songs[0]));
    playMusic(fname, fartist, true);
    
    // playMusic();
  }

  //   Attach event listener to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    // console.log(e);
    e.addEventListener("click", (ele) => {
      // console.log(e.querySelector(".name").innerHTML)
      // console.log(e.querySelector(".artist").innerHTML)

      playMusic(
        e.querySelector(".name").innerHTML,
        e.querySelector(".artist").innerHTML
      );
    });
  });

  //Attach event listener to previous ,play/pause and  next buttons
  let playBtn = document.getElementById("playBtn");

  playBtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      //   console.log('playing song....')
      playBtn.src = "pause.svg";
    } else {
      //   console.log('pausing song....')
      currentSong.pause();
      playBtn.src = "playsong.svg";
    }
  });

  //Listen for time update Event

  currentSong.addEventListener("timeupdate", () => {

    if(currentSong.currentTime===currentSong.duration){
      playBtn.src = "playsong.svg";

    }
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;

    document.querySelector(".seek-point").style.left =
      (currentSong.currentTime / currentSong.duration) * 99 + "%";
  });

  //Add event listener to seek bar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 99;
    document.querySelector(".seek-point").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });


//Attach event listener to hamburger
  document.querySelector('.hamburger').addEventListener('click',()=>{
    // document.querySelector('.left').style.zIndex='3';
    document.querySelector('.left').style.left='0%';

    // console.log('clickeddddddddddddddddddddd');
  })



  // let x=window.matchMedia('min-width: 1401px');
  // console.log(x);
  //   x.addEventListener('change',()=>{
  //     console.log(x.matches)

  //     if(x.matches){
  //       document.querySelector('.left').style.left='0%';
  //       console.log(x.matches)
  //     }
  //   })



  // Add event listener to close button

  document.querySelector('.close').addEventListener('click',()=>{

    
    document.querySelector('.left').style.left='-120%';

  })

  // Add event listener to prevBtn


  prevBtn.addEventListener('click',()=>{
    let index=0;
    for(let ind=0;ind<songs.length;ind++){
      if(currentSong.src.split('/songs/')[1]===songs[ind]){
        index=ind;
        break;
      }
    }

    if(index>0){
      // console.log(songs[index-1])
      currentSong.src=currentSong.src.split('/songs/')[0]+'/songs/'+songs[index-1];
      currentSong.play();
      playBtn.src = "pause.svg";

    }
    
  })




  // Add event listener to nextBtn

  nextBtn.addEventListener('click',()=>{
    let index=0;
    for(let ind=0;ind<songs.length;ind++){
      if(currentSong.src.split('/songs/')[1]===songs[ind]){
        index=ind;
        break;
      }
    }

    if(index+1<songs.length){
      // console.log(songs[index+1])
      currentSong.src=currentSong.src.split('/songs/')[0]+'/songs/'+songs[index+1];
      currentSong.play();
      playBtn.src = "pause.svg";

    }
    
  })



}

main();
