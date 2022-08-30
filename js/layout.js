
let dictusSpin = document.getElementById("DictusSpin");
let getEquippedBanner = document.getElementById("GetEquippedWith");
let audioPlayer = document.getElementById("audioPlayer");

window.addEventListener('resize', function(event) {
   getEquippedBanner.style.top = DictusSpin.style.top + DictusSpin.style.height + 'px';
   audioPlayer.style.top = DictusSpin.style.top + DictusSpin.style.height + 'px';
}, true);