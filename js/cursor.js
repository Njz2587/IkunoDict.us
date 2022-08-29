
let cursor1 = document.getElementById("cursor1");
let cursor2 = document.getElementById("cursor2");
let toggle = true;

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