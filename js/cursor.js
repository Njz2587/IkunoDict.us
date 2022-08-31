let audioPlayerClick = document.getElementById("AudioPlayerClick");
let audioPlayerRightRound = document.getElementById("audioPlayerRightRound");
let audioPlayerTakeOnMe = document.getElementById("audioPlayerTakeOnMe");
let audioPlayerCantGetEnough = document.getElementById("audioPlayerCantGetEnough");

let getEquipped = document.getElementById("GetEquippedWith");
let dictusSpin = document.getElementById("DictusSpin");
let dictusTakeOnMe = document.getElementById("DictusTakeOnMe");
let dictusCantGetEnough = document.getElementById("DictusCantGetEnough");

let cursor1 = document.getElementById("cursor1");
let cursor2 = document.getElementById("cursor2");
let toggle = true;
let toggleMusic = false;

var isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };

const onMouseMove = (e) =>
{	
	var xPos = e.pageX;
	var yPos = e.pageY;
	//console.log(xPos, yPos);
	
	cursor1.style.left = xPos + 'px';
	cursor1.style.top = yPos + 'px';
  
	cursor2.style.left = xPos + 'px';
	cursor2.style.top = yPos + 'px';
}

function ToggleVisibility()
{
	if(toggle)
	{
		cursor1.style.visibility = 'visible';
		cursor2.style.visibility = 'hidden';
	}
	else
	{
		cursor1.style.visibility = 'hidden';
		cursor2.style.visibility = 'visible';
	}
	toggle = !toggle;
}

if(isMobile.any() == null)
{	
	ToggleVisibility();
	setInterval(ToggleVisibility, 100);
	document.addEventListener('mousemove', onMouseMove);
}
else
{
	cursor1.style.visibility = 'hidden';
	cursor2.style.visibility = 'hidden';
}

function ToggleMusic()
{
	if(toggleMusic == false)
	{
		audioPlayerClick.style.visibility = 'hidden';
		getEquipped.style.visibility = 'visible';
		
		let randomPlay = Math.floor(Math.random() * 3);
		
		if(randomPlay == 0)
		{		
			audioPlayerRightRound.volume = 0.5;
			audioPlayerRightRound.play();
			dictusSpin.style.visibility = 'visible';
		}
		else if(randomPlay == 1)
		{		
			audioPlayerTakeOnMe.volume = 0.5;
			audioPlayerTakeOnMe.play();
			dictusTakeOnMe.style.visibility = 'visible';
		}
		else if(randomPlay == 2)
		{		
			audioPlayerCantGetEnough.volume = 0.5;
			audioPlayerCantGetEnough.play();
			dictusCantGetEnough.style.visibility = 'visible';
		}
	}
	else
	{
		audioPlayerRightRound.pause();
		audioPlayerTakeOnMe.pause();
		audioPlayerCantGetEnough.pause();
		
		audioPlayerClick.style.visibility = 'visible';
		getEquipped.style.visibility = 'hidden';
		
		dictusSpin.style.visibility = 'hidden';
		dictusTakeOnMe.style.visibility = 'hidden';
		dictusCantGetEnough.style.visibility = 'hidden';

	}
	
	toggleMusic = !toggleMusic;
}

dictusSpin.style.visibility = 'hidden';
dictusTakeOnMe.style.visibility = 'hidden';
dictusCantGetEnough.style.visibility = 'hidden';
getEquipped.style.visibility = 'hidden';
document.addEventListener('click', ToggleMusic);

