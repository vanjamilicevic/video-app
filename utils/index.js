
/*
  List of videos available in video_clips folder are read from config file
*/
const videos = [
    "./video_clips/clip1.mp4", 
    "./video_clips/clip2.mp4", 
    "./video_clips/clip3.mp4", 
    "./video_clips/clip4.mp4"
]

/*
    Opening full screen when full screen button is clicked
*/ 
function openFullscreen() {

  const videoContainer = document.getElementById("player")
  if (videoContainer.requestFullscreen) 
    videoContainer.requestFullscreen()
  else if (videoContainer.webkitRequestFullscreen) /* Safari */
    videoContainer.webkitRequestFullscreen()
  else if (videoContainer.msRequestFullscreen) /* IE11 */
    videoContainer.msRequestFullscreen()

  document.getElementById("full-screen").classList.add("not-visible")
  document.getElementById("exit-fullscreen").classList.remove("not-visible")
}

/*
    Closing full screen when minimize screen button is clicked
*/ 
function closeFullscreen() {
  
  if (document.exitFullscreen) 
    document.exitFullscreen()
  else if (document.webkitExitFullscreen) /* Safari */
    document.webkitExitFullscreen()
  else if (document.msExitFullscreen) /* IE11 */
    document.msExitFullscreen()
  
  document.getElementById("full-screen").classList.remove("not-visible")
  document.getElementById("exit-fullscreen").classList.add("not-visible")
}

/*
    Making visible/hidden video speed section on slick on three dots image
*/ 
document.getElementById("dots-image").addEventListener("click", function() {

  document.getElementById("video-speed").classList.toggle("not-visible")
})

/*
  Toggling icons when "Escape" is pressed when exiting fullscreen
*/ 
document.addEventListener("fullscreenchange", (e) => {

  if (document.fullscreenElement) {

    document.getElementById("exit-fullscreen").classList.remove("not-visible")
    document.getElementById("full-screen").classList.add("not-visible")
  } else {

    document.getElementById("exit-fullscreen").classList.add("not-visible")
    document.getElementById("full-screen").classList.remove("not-visible")
  }
})

/*
  When mouse is near bottom of the video, controls appear
*/
document.getElementById("player").addEventListener("mousemove", function(e) {

  if(e.y >= document.getElementById("player").offsetHeight-40){
      document.getElementById("player-controls").classList.remove("not-visible")
  } else {
      document.getElementById("player-controls").classList.add("not-visible")
  }
})

/*
  When mouse leaves video, controls are hidden
*/
document.getElementById("player").addEventListener("mouseleave", function() {

  document.getElementById("player-controls").classList.add("not-visible")
})

/*
  Adding play functionality on click
*/ 

let executed = false
function playVideo() { 

  document.getElementById("video").play()
    .then ( () => {
      document.getElementById("pause-video").classList.remove("not-visible")
      document.getElementById("play-video").classList.add("not-visible")
      if(!executed) {
        document.getElementById("video").muted = false
        executed = true
      }
    })
} 
  
/*
  Adding pause functionality on click
*/ 
function pauseVideo() { 
  
  document.getElementById("video").pause();  
  document.getElementById("pause-video").classList.add("not-visible")
  document.getElementById("play-video").classList.remove("not-visible")
} 

/*
  Function that paints left and right side of the slider for the video
*/
const styleProgressSlider = () => {

    let slider = document.getElementById("slider")
    let value = Number(slider.getAttribute("value")) / Number(slider.getAttribute("max")) * 100
    slider.style.background = 'linear-gradient(to right, #454747 0%, #454747 ' + value + '%, #ECF0FB ' + value + '%, #ECF0FB 100%)'
}

/*
  Function that paints left and right side of the slider for the sound
*/
const styleSoundSlider = () => {

  let soundSlider = document.getElementById("sound-slider")
  let value = (soundSlider.value - soundSlider.min) / (soundSlider.max - soundSlider.min) * 100
  soundSlider.style.background = 'linear-gradient(to right, #454747 0%, #454747 ' + value + '%, #ECF0FB ' + value + '%, #ECF0FB 100%)'
}

let executedMute = false;
const addVideo = (newSource) => {

  document.getElementById("video").setAttribute("src", newSource)
  if(!executed) {
    document.getElementById("video").muted = true
    executedMute = true
  }
  
  document.getElementById("video").play()

    .then ( () => {

      document.getElementById("video").pause()
      document.getElementById("video").currentTime = 0
      document.getElementById("video-duration").innerHTML = Math.round(document.getElementById("video").duration)
      document.getElementById("video-current-time").innerHTML = document.getElementById("video").currentTime
      document.getElementById("slider").setAttribute("min", 0)
      document.getElementById("slider").setAttribute("max", document.getElementById("video").duration)

      document.getElementById("pause-video").classList.add("not-visible")
      document.getElementById("play-video").classList.remove("not-visible")
      document.getElementById("slider").setAttribute("value", 0) 
      styleProgressSlider()  
    })
}

document.getElementById("previous-video").addEventListener("click", () => {

    const currentVideo = document.getElementById("video").src.replace(/(.*\/)(video_clips\/.+)/g, "./$2")
    if (currentVideo !== videos[0]) 
      addVideo(videos[videos.indexOf(currentVideo) - 1])
})

document.getElementById("next-video").addEventListener("click", () => {

    const currentVideo = document.getElementById("video").getAttribute("src").replace(/(.*\/)(video_clips\/.+)/g, "./$2")
    if (currentVideo !== videos[3]) 
      addVideo(videos[videos.indexOf(currentVideo) + 1])
})

/* Styling slider on load */
window.onload = () => {

  addVideo("./video_clips/clip1.mp4")

  document.getElementById("video").setAttribute("volume", 1)
  document.getElementById("sound-slider").setAttribute("value", 10)
  styleSoundSlider()
}

/*
  Creating progress bar to move while video is playing
*/   
  document.getElementById("video").addEventListener("timeupdate", () => {

    // Skipping call when new video is set
    if(document.getElementById("video").currentTime == 0)
      return 

    let progress = document.getElementById("video").currentTime
    document.getElementById("slider").setAttribute("value", progress)
    document.getElementById("video-current-time").innerHTML = Math.round(document.getElementById("video").currentTime)
    styleProgressSlider()
})

/*
  Updating video current time on change
*/
document.getElementById("slider").addEventListener("change", () => {

  let slider = document.getElementById("slider")
  document.getElementById("video").currentTime = slider.value
})

/*
  Setting volume on volume slider
*/ 
document.getElementById("sound-slider").oninput = function() {
  
  let soundSliderValue = document.getElementById("sound-slider").value
  let video = document.getElementById("video")
  video.volume = soundSliderValue/10
  styleSoundSlider()
}

/*
  Muting/unmuting video when sound image is clicked
*/ 
let sound = true
document.getElementById("sound-image").addEventListener("click", () => {

  if(sound) {

    document.getElementById("sound-image").src = "../images/mute.png"
    document.getElementById("video").muted = !document.getElementById("video").muted
    sound = false
  } else {

    document.getElementById("sound-image").src = "../images/volume.png"
    document.getElementById("video").muted = !document.getElementById("video").muted
    sound = true
  }
  
})

/*
  Adding functionality for playback rate
*/ 
const allRates = document.querySelectorAll(".reproduction-speed")
let video = document.getElementById("video")
for(let i = 0; i < allRates.length; i ++) {

  allRates[i].addEventListener("click", () => {
  video.playbackRate = Number(allRates[i].firstChild.innerHTML)
  document.getElementById("video-speed").classList.add("not-visible")
  })
}


