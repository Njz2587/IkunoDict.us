// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application(600,600);
document.querySelector(".game").appendChild(app.view);
//document.querySelector(".game").style.width = "600px";
//document.querySelector(".game").style.height = "600px";

// constants
const sceneWidth = app.view.width; //Width of current application
const sceneHeight = app.view.height; //Height of current application	
const minObstacleSpeed = 8, maxObstacleSpeed = 7; //Variables relating to how fast obstacles come at the player

let bear, shield; //Game Objects
let isGrounded, hasLanded = false; //Jumping booleans
let oldAmt, start, millis; //Time related variables

// pre-load the images
PIXI.loader.
add(["images/explosions.png","images/bear.png", "images/Obstacles.png", "images/bearShield.png", "images/powerUps.png", "images/MenuBackgroundBlur.png", "images/GameTop.png", "images/GameBottom.png"]).
on("progress",e=>{document.querySelector("#gameP").innerHTML = `Progress:${e.progress}%`;}).
load(setup);
// aliases
let stage;

// game variables
let startScene, gameOverScene; //Application Scenes
let gameScene,scoreLabel,lifeLabel, hopSound, hitSound, jumpSound, landSound, powerupSound, selectSound, shieldHitSound, loseSound; //Game Sounds
let groundEnemies = [], skyEnemies = [], explosions = []; //GameObject arrays
let explosionTextures, obstacleTextures, powerUpTextures, bearTextures, bearShieldTextures; //GameObject Textures
let menuTextures, menuBackground, menuBackground2; //Menu Backgrounds
let gameTopTexture, gameBottomTexture, gameBackgroundTop, gameBackgroundBottom; //Game Backgrounds
let score = 0, highScore, highScoreLabel2, gameOverScoreLabel; //Score associated variables

//High score retrieve
if(localStorage.getItem('highScore'))
{
	highScore = localStorage.getItem('highScore');
}
else
{
	highScore = 0;
	localStorage.setItem('highScore', 0);
}

let life = 100; //Default life of the player
let initialHop = false; //Prevents the player from hopping when play is chosen
let paused = true; //Toggles if the game is in a scene considered as paused

//Main app function that contains all functions and operations for this application
function setup() {
	document.querySelector("p").innerHTML = ``;
	stage = app.stage;
	// #1 - Create the `start` scene
	startScene = new PIXI.Container();
	stage.addChild(startScene);
	
	// #2 - Create the main `game` scene and make it invisible
	gameScene = new PIXI.Container();
	gameScene.visible = false;
	stage.addChild(gameScene);
	
	// #3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
	gameOverScene.visible = false;
	stage.addChild(gameOverScene);
	
	// #4 - Create labels for all 3 scenes
	createLabelsAndButtons();
	
	// #5 - Create bear
	createPlayer(50,sceneHeight/2,178,178);
	
	// #6 - Load Sounds
	hopSound = new Howl({
		src: ['sounds/Hop.wav']
	});

	hitSound = new Howl({
		src: ['sounds/hit.wav']
	});

	jumpSound = new Howl({
		src: ['sounds/Jump.wav']
	});
	
	landSound = new Howl({
		src: ['sounds/Land.wav']
	});
	
	powerupSound = new Howl({
		src: ['sounds/Powerup.wav']
	});
	
	selectSound = new Howl({
		src: ['sounds/Select.wav']
	});
	
	shieldHitSound = new Howl({
		src: ['sounds/ShieldHit.wav']
	});
	
	loseSound = new Howl({
		src: ['sounds/ExplosionEcho.wav']
	});
	// #7 - Load sprite sheet
	explosionTextures = loadSpriteSheet("images/explosions.png", 64, 64, 16);
	obstacleTextures = loadSpriteSheet("images/Obstacles.png", 100, 100, 2);
	powerUpTextures = loadSpriteSheet("images/powerUps.png", 100, 100, 2);
	
	// #8 - Start update loop
	start = Date.now();
	app.ticker.add(gameLoop);
	
	// #9 - Start listening for click events on the canvas
	document.querySelector("body").addEventListener("click", playerJump);
	document.querySelector("body").addEventListener("touchend", playerJump);
	
	//Adds all the buttons and labels in all three scenes that will show up
	function createLabelsAndButtons(){
		
		menuTextures = loadSpriteSheet("images/MenuBackgroundBlur.png",1080,1080,8);
		menuBackground = new PIXI.extras.AnimatedSprite(menuTextures);
		menuBackground.scale.set(0.556);	
		menuBackground.animationSpeed = 0.5;
		menuBackground.loop = true;
		startScene.addChild(menuBackground);
		menuBackground.play();
		
		let buttonStyle = new PIXI.TextStyle({
			fontSize: 48,
			fill: 0xFFFFFF,
			fontFamily: 'Comic Sans MS',
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		
		let startLabel1 = new PIXI.Text("Polar Run");
		startLabel1.style = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 96,
			fontFamily: 'Comic Sans MS',
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		startLabel1.x = 90;
		startLabel1.y = 120;
		startScene.addChild(startLabel1);
		
		let startLabel2 = new PIXI.Text("Absolute Lad");
		startLabel2.style = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 32,
			fontFamily: "Comic Sans MS",
			fontStyle: "italic",
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		startLabel2.x = 190;
		startLabel2.y = 300;
		startScene.addChild(startLabel2);
		
		let highScoreLabel = new PIXI.Text("High Score: "+highScore);
		highScoreLabel.style = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 18,
			fontFamily: "Comic Sans MS",
			fontStyle: "italic",
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		highScoreLabel.x = 10;
		highScoreLabel.y = 10;
		startScene.addChild(highScoreLabel);
				
		let startButton = new PIXI.Text("Play");
		startButton.style = buttonStyle;
		startButton.x = sceneWidth/2 - 50;
		startButton.y = sceneHeight - 100;
		startButton.interactive = true;
		startButton.buttonMode = true;
		startButton.on("pointerup",startGame);
		startButton.on('pointerover',e=>e.target.alpha = 0.7);
		startButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
		startScene.addChild(startButton);
		
		gameTopTexture = loadSpriteSheet("images/GameTop.png",600,300,1);
		gameBackgroundTop = new PIXI.extras.AnimatedSprite(gameTopTexture);
		gameScene.addChild(gameBackgroundTop);
		
		gameBottomTexture = loadSpriteSheet("images/GameBottom.png",600,300,11);
		gameBackgroundBottom = new PIXI.extras.AnimatedSprite(gameBottomTexture);
		gameBackgroundBottom.y = 300;
		gameBackgroundBottom.animationSpeed = 0.3;
		gameBackgroundBottom.loop = true;
		gameScene.addChild(gameBackgroundBottom);
		gameBackgroundBottom.play();
		
		let textStyle = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 18,
			fontFamily: "Comic Sans MS",
			stroke: 0x4286F4,
			strokeThickness: 4,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		
		scoreLabel = new PIXI.Text();
		scoreLabel.style = textStyle;
		scoreLabel.x = 5;
		scoreLabel.y = 5;
		gameScene.addChild(scoreLabel);
		increaseScoreBy(0);
		
		lifeLabel = new PIXI.Text();
		lifeLabel.style = textStyle;
		lifeLabel.x = 5;
		lifeLabel.y = 26;
		gameScene.addChild(lifeLabel);
		decreaseLifeBy(0);
		
		menuBackground2 = new PIXI.extras.AnimatedSprite(menuTextures);
		menuBackground2.scale.set(0.556);	
		menuBackground2.animationSpeed = 0.5;
		menuBackground2.loop = true;
		gameOverScene.addChild(menuBackground2);
		menuBackground2.play();
		// 3 - set up `gameOverScene`
		// 3A - make game over text
		let gameOverText = new PIXI.Text("Game Over!");
		textStyle = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 64,
			fontFamily: "Comic Sans MS",
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		gameOverText.style = textStyle;
		gameOverText.x = 120;
		gameOverText.y = sceneHeight/2 - 160;
		gameOverScene.addChild(gameOverText);
		
	    gameOverScoreLabel = new PIXI.Text();
		textStyle = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 40,
			fontFamily: "Comic Sans MS",
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		gameOverScoreLabel.style = textStyle;
		gameOverScoreLabel.x = 120;
		gameOverScoreLabel.y = sceneHeight/2 + 50;
		gameOverScene.addChild(gameOverScoreLabel);
		
		highScoreLabel2 = new PIXI.Text("High Score: "+highScore);
		highScoreLabel2.style = new PIXI.TextStyle({
			fill: 0xFFFFFF,
			fontSize: 18,
			fontFamily: "Comic Sans MS",
			fontStyle: "italic",
			stroke: 0x4286F4,
			strokeThickness: 6,
			dropShadow : true,
			dropShadowBlur: 8,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 2,
			dropShadowDistance : 3,
			padding: 10
		});
		highScoreLabel2.x = 10;
		highScoreLabel2.y = 10;
		gameOverScene.addChild(highScoreLabel2);


		// 3B - make "play again?" button
		let playAgainButton = new PIXI.Text("Play Again?");
		playAgainButton.style = buttonStyle;
		playAgainButton.x = 180;
		playAgainButton.y = sceneHeight - 150;
		playAgainButton.interactive = true;
		playAgainButton.buttonMode = true;
		playAgainButton.on("pointerup",startGame); // startGame is a function reference
		playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
		playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
		gameOverScene.addChild(playAgainButton);
	}
	
	//Starts the game and sets all variables back to default values
	function startGame(){
		selectSound.play();
		initialHop = false;
		startScene.visible = false;
		gameOverScene.visible = false;
		gameScene.visible = true;
		score = 0;
		life = 100;
		increaseScoreBy(0);
		decreaseLifeBy(0);
		loadLevel();
	}
	
	//Increases the score of the player by a value
	function increaseScoreBy(value){
		score += value;
		scoreLabel.text = `Score ${score}`;
	}
	
	//Decreases the life of the player by a value
	function decreaseLifeBy(value){
		life -= value;
		life = parseInt(life);
		lifeLabel.text = `Life ${life}%`;
	}
	
	//Increases the life of the player by a value
	function increaseLifeBy(value){
		if(life < 100)
		{
			life += value;
		}
		life = parseInt(life);
		lifeLabel.text = `Life ${life}%`;
	}
	
	//Main Gameloop where movement, input, collision, and calulations are done
	function gameLoop()
	{
		if (paused) return; // keep this commented out for now
		
		// #1 - Calculate "delta time"
		let dt = 1/app.ticker.FPS;
		if (dt > 1/12) dt=1/12;						
			
		// #2 - Move bear
		let mousePosition = app.renderer.plugins.interaction.mouse.global;
		//bear.position = mousePosition;
		
		let amt = 6 * dt;		
		
		if(!isGrounded)
		{
			bear.vel += 25 * amt;
			bear.y += bear.vel * amt;	
			bear.animationSpeed = 0.4;
			if(shield)
			{
				shield.animationSpeed = 0.4;
			}
		}
		else
		{
			bear.animationSpeed = 1;
			if(shield)
			{
				shield.animationSpeed = 1;
			}
		}
						
		if(bear.y >= sceneHeight/2)
		{
			isGrounded = true;
			bear.y = sceneHeight/2;
			bear.vel = 0;
		}
		
		if(shield)
		{
			shield.x = bear.x;
			shield.y = bear.y;
		}
				
		let w2 = 178/2;
		let h2 = 178/2;
		
		//#5 - Check for Collisions
		for (let c of groundEnemies)
		{
			if (c.isAlive && rectsIntersect(c,bear))
			{

				if(c.isHealth)
				{
					increaseLifeBy(20);
					powerupSound.play();
				}
				else if(c.isShield)
				{
					if(bear.activeShield == false)
					{
						bear.activeShield = true;
						powerupSound.play();
						let bearShieldTextures = loadSpriteSheet("images/bearShield.png",178, 178, 13);
						shield = new PIXI.extras.AnimatedSprite(bearShieldTextures);
						shield.scale.set(0.5);
						shield.anchor.set(0.5,0.5);
						shield.x = bear.x;
						shield.y = bear.y;
						shield.animationSpeed = 1;
						shield.loop = true;
						gameScene.addChild(shield);
						shield.play();
					}
				}
				else
				{
					if(bear.activeShield == false)
					{
						decreaseLifeBy(20);
						createExplosion(c.x,c.y,64,64);
						hitSound.play();
					}
					else
					{
						bear.activeShield = false;
						shieldHitSound.play();
						gameScene.removeChild(shield);
					}
				}
				gameScene.removeChild(c);
				c.isAlive = false;
			}
		}
		for (let c of skyEnemies)
		{
			if (c.isAlive && rectsIntersect(c,bear))
			{

				if(c.isHealth)
				{
					increaseLifeBy(20);
					powerupSound.play();
				}
				else if(c.isShield)
				{
					if(bear.activeShield == false)
					{
						bear.activeShield = true;
						powerupSound.play();
						let bearShieldTextures = loadSpriteSheet("images/bearShield.png",178, 178, 13);
						shield = new PIXI.extras.AnimatedSprite(bearShieldTextures);
						shield.scale.set(0.5);
						shield.anchor.set(0.5,0.5);
						shield.x = bear.x;
						shield.y = bear.y;
						shield.animationSpeed = 1;
						shield.loop = true;
						gameScene.addChild(shield);
						shield.play();
					}
					
				}
				else
				{
					if(bear.activeShield == false)
					{
						decreaseLifeBy(20);
						hitSound.play();
						createExplosion(c.x,c.y,64,64);
					}
					else
					{
						bear.activeShield = false;
						shieldHitSound.play();
						gameScene.removeChild(shield);
					}
				}
				gameScene.removeChild(c);
				c.isAlive = false;
			}
		}
		
		
		for (let c of groundEnemies)
		{	
			c.x -= c.speed;
			if (c.isAlive && c.x <= -c.width)
			{
				gameScene.removeChild(c);
				c.isAlive = false;
			}
		}
		for (let c of skyEnemies)
		{	
			c.x -= c.speed;
			if (c.isAlive && c.x <= -c.width)
			{
				gameScene.removeChild(c);
				c.isAlive = false;
			}
		}
		
		// #6 - Now do some clean up
		groundEnemies = groundEnemies.filter(c=>c.isAlive);
		skyEnemies = skyEnemies.filter(c=>c.isAlive);
		explosions = explosions.filter(e=>e.playing);
		
		// #7 - Is game over?
		if (life <= 0){
			end();
			return;
		}
		
		if(bear.isAlive)
		{
			//Timing
			millis = Date.now() - start;
			if((oldAmt != Math.floor(millis/1000)))
			{
				increaseScoreBy(1);

			}
			if((oldAmt != Math.floor(millis/2000)))
			{
				if (!groundEnemies[groundEnemies.length-1])
				{
					if (!skyEnemies[skyEnemies.length-1])
					{
						if (Math.floor(Math.random()*10) + 1 > 9)
						{
							createPowerUp(1,Math.round(Math.random()));
						}	
						else	
						{
							createObstacle(1);
						}
					}
				}

				if (!skyEnemies[skyEnemies.length-1])
				{
					if (Math.floor(Math.random()*10) + 1 > 9)
					{
						if (Math.floor(Math.random()*10) + 1 > 9)
						{
							createPowerUp(2,Math.round(Math.random()));
						}	
						else	
						{
							createObstacle(2);
						}
					}
				}
			}
			
			//jumping
			for(let c of groundEnemies)			
			{
				if(c.jumper == true)
				{
					let jumpPoint = Math.floor(Math.random()*300) + 300;
					if(c.x == jumpPoint || c.x < jumpPoint+10 && c.x > jumpPoint-10 && c.speed > 11)
					{
						if (c.isGrounded) 
						{
							c.isGrounded = false;
							hopSound.play();
							c.vel = -85;
						}
					}
				}
				if(!c.isGrounded)
				{
					c.vel += 25 * amt;
					c.y += c.vel * amt;	
				}
			}
			//sinking
			for(let c of skyEnemies)			
			{
				if(c.sinker == true)
				{
					let sinkPoint = Math.floor(Math.random()*300) + 300;
					if(c.x == sinkPoint || c.x < sinkPoint+10 && c.x > sinkPoint-10 && c.speed > 11)
					{
						if (c.isGrounded) 
						{
							hopSound.play();
							c.isGrounded = false;
							c.vel = 90;
						}
					}
				}
				if(!c.isGrounded)
				{
					c.vel -= 25 * amt;
					c.y += c.vel * amt;	
				}
			}
			oldAmt = Math.floor(millis/1000);
		}	
	}
	
	//Once the player has died, this function will be called to show the end screen
	function end() {
		paused = true;
		if(score > highScore)
		{
			highScore = score;
			localStorage.setItem('highScore', highScore);
		}
		loseSound.play();
		
		groundEnemies.forEach(c=>gameScene.removeChild(c));
		groundEnemies = [];
		
		skyEnemies.forEach(c=>gameScene.removeChild(c));
		skyEnemies = [];		

		explosions.forEach(e=>gameScene.removeChild(e));
		explosions = [];
		
		gameOverScoreLabel.text = `Your Final Score: ${score}`;
		highScoreLabel2.text = "High Score: "+highScore;
		
		gameOverScene.visible = true;
		gameScene.visible = false;
	}
		
	//Makes the player perform a jump if they are on the ground or slam down to the ground if they are in the air
	function playerJump(e)
	{
		if(paused) return;
		
		if(!gameOverScene.visible && gameScene.visible)
		{
			if(initialHop)
			{
				if(bear)
				{
					if (isGrounded) 
					{
						isGrounded = false;
						hasLanded = false;
						bear.vel = -75;
						jumpSound.play();
					}
					else
					{
						bear.vel += 80;
						if(!hasLanded)
						{
							hasLanded = true;
							landSound.play();
						}
					}
				}
			}	
			else
			{
				bear.y = sceneHeight/2;
				 initialHop = true;
			}	
		}	
	}
	
	//Creates the obstacles that will come at the player
	function createObstacle(lineNum)
	{
		let obstacleTexture = obstacleTextures[Math.floor(Math.random() * obstacleTextures.length)];
		let c = new PIXI.Sprite(obstacleTexture);
		c.scale.set(0.5);
		c.anchor.set(0.5,0.5);
		c.isAlive = true;	
		c.isGrounded = true;
		if(lineNum == 1)
		{
			c.speed = Math.floor(Math.random() * Math.floor(maxObstacleSpeed))+minObstacleSpeed;
			c.x = sceneWidth + 50;
			c.y = sceneHeight/2;
			if (Math.floor(Math.random()*100) + 1 > 90)
			{
				c.jumper = true;
			}
			else
			{
				c.jumper = false;
			}
			groundEnemies.push(c);
		}
		else
		{
			if(groundEnemies[groundEnemies.length-1])			
			{
				c.speed = groundEnemies[groundEnemies.length-1].speed;
			}
			if (Math.floor(Math.random()*100) + 1 > 90)
			{
				c.sinker = true;
			}
			else
			{
				c.sinker = false;
			}
			c.x = sceneWidth + Math.floor(Math.random()*400) + 230;
			c.y = sceneHeight/2 - 100;
			skyEnemies.push(c);
		}		
		gameScene.addChild(c);
	}
	
	//Creates the powerups that will come at the player
	function createPowerUp(lineNum, textureNumber)
	{				
		let powerUpTexture = powerUpTextures[textureNumber];
		let c = new PIXI.Sprite(powerUpTexture);
		
		if(textureNumber == 0)
		{
			c.isHealth = true;
		}
		else
		{
			c.isShield = true;
		}

		c.scale.set(0.5);
		c.anchor.set(0.5,0.5);
		c.isAlive = true;	
		c.isGrounded = true;

		if(lineNum == 1)
		{
			c.jumper = false;
			c.speed = Math.floor(Math.random() * Math.floor(maxObstacleSpeed))+minObstacleSpeed;
			c.x = sceneWidth + 50;
			c.y = sceneHeight/2;
			groundEnemies.push(c);
		}
		else
		{
			c.sinker = false;
			if(groundEnemies[groundEnemies.length-1])			
			{
				c.speed = groundEnemies[groundEnemies.length-1].speed;
			}
			c.x = sceneWidth + Math.floor(Math.random()*400) + 230;
			c.y = sceneHeight/2 - 100;
			skyEnemies.push(c);
		}		
		gameScene.addChild(c);
	}
	
	//Loads an animated sprite
	function loadSpriteSheet(imageLocation, currentSpriteWidth, currentSpriteHeight, framesNum)
	{
		let spriteSheet = PIXI.BaseTexture.fromImage(imageLocation);
		let width = currentSpriteWidth;
		let height = currentSpriteHeight;
		let numFrames = framesNum;
		let textures = [];
		for (let i=0;i<numFrames;i++)
		{
			let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 0, width, height));
			textures.push(frame);
		}
		return textures;
	}
	
	//Creates an explosion at a given position
	function createExplosion(x,y,frameWidth,frameHeight)
	{
		let w2 = frameWidth/2;
		let h2 = frameHeight/2;
		let expl = new PIXI.extras.AnimatedSprite(explosionTextures);
		expl.x = x - w2;
		expl.y = y - h2;
		expl.animationSpeed = 1/2;
		expl.loop = false;
		expl.onComplete = e=>gameScene.removeChild(expl);
		explosions.push(expl);
		gameScene.addChild(expl);
		expl.play();
	}
	
	//Creates the player at a given position
	function createPlayer(x,y,frameWidth,frameHeight)
	{
		bearTextures = loadSpriteSheet("images/bear.png",178, 178, 13);
		bear = new PIXI.extras.AnimatedSprite(bearTextures);
		bear.scale.set(0.5);
		bear.anchor.set(0.5,0.5);
		bear.x = x
		bear.y = y;
		bear.activeShield = false;
		bear.isAlive = true;
		bear.vel = 0;
		bear.animationSpeed = 1;
		bear.loop = true;
		gameScene.addChild(bear);
		bear.play();
	}	
	
	//Unpauses the game after a loss
	function loadLevel()
	{	
		paused = false;
	}
		
}
