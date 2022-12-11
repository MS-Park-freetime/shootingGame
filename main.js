let canvas;
let ctx;

//canvas
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;

//canvas html
document.body.appendChild(canvas);

let backgroundImage,iconImage,bulletImage,alienImage,gameoverImage;

let gameOver=false; //true=끝, false=진행
let score=0;
//캐릭터 좌표
let iconImageX = canvas.width/2-32;
let iconImageY = canvas.height-64;

//총알 저장
let bulletList = [];
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init=function(){
        this.x = iconImageX+20;
        this.y = iconImageY;
        this.live = true;//총알 생존여부

        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };

    //총알을 맞췄는지 확인
    this.checkHit = function(){
        for(let i=0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40){
                score++;
                this.live = false;//총알생존여부
                enemyList.splice(i, 1);//적 제거
            }
        }
    };
}    

function randomEnemyX(min, max){
    let random = Math.floor(Math.random() * (max-min+1))+min;
    return random;
}

//상대 대상체 호출
let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y=0;
        this.x=randomEnemyX(0, canvas.width-64);
        enemyList.push(this);
    };
    this.update=function(){
        this.y += 2;
        
        if(this.y >= canvas.height-48){
            gameOver = true;
        }
    };
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.jpg";

    iconImage = new Image();
    iconImage.src="images/icon.png";

    bulletImage = new Image();
    bulletImage.src="images/bullet.png";

    alienImage = new Image();
    alienImage.src="images/alien.png";

    gameoverImage = new Image();
    gameoverImage.src="images/gameover.png";
}

//방향키 이동
let keysDown={};
function setupKey(){
    document.addEventListener("keydown",function(event){
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup", function(event){
        delete keysDown[event.key];
        
        if(event.key == " "){
            shootBullet();
        }
    });
}

//총알발사
function shootBullet(){
    let a = new Bullet(); //총알한개
    a.init();
}

//적 생성
function createEnemy(){
    const interval = setInterval(function(){
        let b = new Enemy();
        b.init();
    } ,1000);
}

function update(){
    if('ArrowRight' in keysDown){//오른쪽
        iconImageX += 3;
    }
    if('ArrowLeft' in keysDown){
        iconImageX -= 3;
    }
    if(iconImageX <= 0){
        iconImageX = 0;
    }
    if(iconImageX >= canvas.width - 64){
        iconImageX = canvas.width-64;
    }

    //총알 위로 발사
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].live){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    //적 대상물 아래로 이동
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

//이미지 ui
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(iconImage, iconImageX, iconImageY);
    ctx.fillText(`Score:${score}`, 20, 30);
    ctx.fillStyle="white";
    ctx.font = "15px Arial";
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].live){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(alienImage, enemyList[i].x, enemyList[i].y);
    }
}

//배경 계속 호출
function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage, 50, 200, 300, 250);
    }
}

//함수호출
loadImage();
setupKey();
createEnemy();
main();







