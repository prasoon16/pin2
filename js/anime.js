function init1() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvasWidth = 300;
    canvasHeight = 400;


    document.addEventListener('touchstart', handleTouchEvent, true);
    document.addEventListener('touchmove', handleTouchEvent, true);
    //player.push()
    game = true;
    score = 0;
    level = 1;
    velocity = 3;
    sp = new Image();
    sp.src = "space1.png";
    en_speed = 1000;
    enemies = new Array();
    player = new Array();
    powerups = new Array();
    wipeout = new Array();
    powerup1 = false;
    powerup2 = false;
    P3Anim = false;
    animate();
    countScore();
    levelCheck();
    enemySpawn();
    powerupspawn();

}
x = 0;
y = 350;

var Enemies = function(x, y) {
    this.x = x;
    this.y = y;
};
var Players = function(x, y) {
    this.x = x;
    this.y = y;
};
var Powerup = function(x, y) {
    this.x = x;
    this.y = y;
};
var Wipeout = function(x, y) {
    this.x = x;
    this.y = y;
};


function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "rgb(255, 0, 0)";
    if (x + 30 >= 300)
        x = 270;
    if (x - 30 <= 0)
        x = 0;
    ctx.drawImage(sp, x, y, 30, 30);
    enemyAnimate();
    poweranimate();
    if (game)
        setTimeout(animate, 1000 / 60);
}

function handleTouchEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.touches.length === 0) return;
    canvas = document.getElementById("canvas");
    var rect = canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left;
    var my = e.touches[0].clientY - rect.top;
    console.log(mx, my, x, y);
    if ((y <= my && my <= (y + 30)) && (x <= mx && mx <= (x + 30))) {

        x = mx;
    }
}

function enemySpawn() {
    if (level == 1 || level === 2) {
        enemies.push(new Enemies(Math.random() * 300, 0, 30, 30));
    } else if (level == 3) {
        enemies.push(new Enemies(Math.random() * 300, 0, 30, 30));
        enemies.push(new Enemies(Math.random() * 300, 0, 30, 30));
    }
    //enemies.push(new Enemies(Math.random() * 300, 0, 30, 30));
    //enemies.push(new Enemies(Math.random() * 300, 0, 30, 30));
    if (en_speed > 600 && level == 1) {
        en_speed -= 10;
        console.log(en_speed)
    } else if (en_speed > 300 && level == 2 && velocity > 10) {
        en_speed -= 5;
        console.log(en_speed)
    }
    if (game)
        setTimeout(enemySpawn, en_speed);
}

function powerupspawn() {

    powerups.push(new Powerup(/*Math.round(Math.random() * 270)*/0, 0, 30, 30));
    if (game)
        setTimeout(powerupspawn, Math.round(Math.random() * (30000 - 5000) + 5000));

}

function poweranimate() {
    var power_len = powerups.length;
    console.log(power_len);
    ctx.fillStyle = "rgb(0,255,0)";
    for (var i = 0; i < power_len; i++) {
        //var tmpEnemies = enemies[i];
        if (level == 1)
            powerups[i].y += 3;
        else if (level == 2)
            powerups[i].y += velocity;
        else
            powerups[i].y += velocity;
        var tmpPowerups = powerups[i];
        ctx.fillRect(powerups[i].x, powerups[i].y, 30, 30);
        if (!(tmpPowerups.x + 30 < x) &&
            !(x + 30 < tmpPowerups.x) &&
            !(tmpPowerups.y + 30 < y) &&
            !(y + 30 < tmpPowerups.y)) {
            var newPower = /*Math.round(Math.random() * (2 - 1) + 1)*/2;
            if (newPower == 1)
                powerup1 = true;
            else {
                powerup2 = true;
                wipeout.push(new Wipeout(0, 400, 300, 5));
                if (P3Anim == false) {
                    startWipeout();
                    P3Anim = true;
                }
            }
            for (var j = 0; j < powerups.length; j++) {
                if (powerups[i] == tmpPowerups) {
                    powerups.splice(powerups.indexOf(powerups[i]), 1);
                }
            }
        }
    }
}



function enemyAnimate() {

    var enemiesLength = enemies.length;
    ctx.fillStyle = "rgb(0, 0, 0)";
    for (var i = 0; i < enemiesLength; i++) {
        //var tmpEnemies = enemies[i];
        if (level == 1)
            enemies[i].y += 3;
        else if (level == 2)
            enemies[i].y += velocity;
        else
            enemies[i].y += velocity;
        var a = enemies[i].x,
            b = enemies[i].y;
        ctx.fillRect(enemies[i].x, enemies[i].y, 30, 30);
        if (!(a + 30 < x) &&
            !(x + 30 < a) &&
            !(b + 30 < y) &&
            !(y + 30 < b)) {
            console.log("Collision");
            game = false;
        }
        if (b > 400)
            ctx.clearRect(a, b, 30, 30);
    };

}

function countScore() {

    /*
     * Count our score
     */
    score += 1;
    console.log(score);

    if (game) {
        setTimeout(countScore, 500);
    }
}

function levelCheck() {

    if (score < 75) {
        level = 1;
    } else if (score < 130) {
        level = 2;
    } else if (score < 300) {
        level = 3;
    }


    if (level == 2 && velocity < 10) {
        velocity += 0.01;
    }

    if (game) {
        setTimeout(levelCheck, 33);
    }

}

function startWipeout() {

    if (wipeout.length < 1) {} else {

        var wipeoutLength = wipeout.length;
        for (var i = 0; i < wipeoutLength; i++) {
            var tmpWipeout = wipeout[i];
            if (tmpWipeout.y < -10) {
                wipeout.splice(wipeout.indexOf(powerups[i]), 1);
                P3Anim = false;

            } else {
                tmpWipeout.y -= 3;
                ctx.clearRect(tmpWipeout.x, tmpWipeout.y, 300, 5)
            }
        }

        ctx.fillStyle = "red";
        ctx.fillRect(tmpWipeout.x, tmpWipeout.y, 300, 5);

        if (game) {
            setTimeout(startWipeout, 1000/60);
        }

    }
}