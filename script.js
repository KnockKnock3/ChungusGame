const quotes = [
    '"A single death is a tragedy; a million deaths is a statistic."',
    '"Those who vote decide nothing. Those who count the vote decide everything."',
    '"In the Soviet army it takes more courage to retreat than advance."',
    '"Death is the solution to all problems. No man - no problem."',
    '"History has shown there are no invincible armies."',
    '"Quantity has a quality all its own."',
    '"University of Bristol iz bad init"',
    '"There is no hope."'
]

const death_messages = [
    "The Chungus got the better of you",
    "The Chungus where too big for you",
    "Who's the big chungus now?",
    "Big chungus chungused you out",
    "Chungus is too cool for school",
    "You got big chungused"
]

const wave_text = document.getElementById("wave_text")
const money_text = document.getElementById("money_text")
const turret_text = document.getElementById("turret_text")
const quote_text = document.getElementById("quote_text")
quote_text.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];

const chungi_holder = document.getElementById("chungi_holder")
const music = document.getElementById("music")

let money = 0;
let running = true;
let spawning_chungi = false;
let wave = 1;
let chungi_distance = 10
let turret_radius = 10

let mouse_position = [0, 0]

function get_turret_cost() {
    return 20 * (document.getElementsByClassName("turret").length + 1)
}

function reset_text() {
    wave_text.innerHTML = "Wave " + wave
    money_text.innerHTML = "Money " + money
    turret_text.innerHTML = "Turret Cost " + get_turret_cost()
}

function end_game() {
    if (running) {
        running = false
        music.loop = false
        money_text.style.visibility = "hidden"
        turret_text.style.visibility = "hidden"
        quote_text.innerHTML = death_messages[Math.floor(Math.random() * death_messages.length)];
        reset_text()
    }
}

function remove_chungus(chungus) {
    if (running) {
        chungus.remove()
        money += 1
        reset_text()

        let hit_audio = document.createElement("audio")
        hit_audio.src = "sounds/eep.wav"
        hit_audio.play()
        hit_audio.volume = 0.2
        hit_audio.addEventListener("ended", function() {
            hit_audio.remove()
        })
    }
}

function spawn_chungus(x_position) {
    let new_chungus_image = document.createElement("img")
    new_chungus_image.src = "images/big.png"
    new_chungus_image.alt = "Big Chungus"
    new_chungus_image.draggable = false
    new_chungus_image.className = "chungus"
    new_chungus_image.style.top = Math.floor(Math.random() * (100 - 15)) + "vh"
    new_chungus_image.style.left = x_position + "vw"

    chungi_holder.appendChild(new_chungus_image)

    new_chungus_image.addEventListener("mousedown", function() {
        remove_chungus(new_chungus_image)
    })
}

function spawn_chungi(number) {
    for (let index = 0; index < number; index++) {
        spawn_chungus(index/number * 100)
    }
}

function check_if_lost() {
    let chungi = document.getElementsByClassName("chungus")
    for (let index = 0; index < chungi.length; index++) {
        if (chungi.item(index).getBoundingClientRect().left < 0) {
            end_game()
        }
    }
}

function animate_bullet(turret, chungus) {

    startX = turret.getBoundingClientRect().left + (turret.getBoundingClientRect().right - turret.getBoundingClientRect().left) / 2
    startY = turret.getBoundingClientRect().top + (turret.getBoundingClientRect().bottom - turret.getBoundingClientRect().top) / 2
    endX = chungus.getBoundingClientRect().left + (chungus.getBoundingClientRect().right - chungus.getBoundingClientRect().left) / 2
    endY = chungus.getBoundingClientRect().top + (chungus.getBoundingClientRect().bottom - chungus.getBoundingClientRect().top) / 2

    let bullet = document.createElement("div")
    bullet.className = "bullet"
    turret_holder.appendChild(bullet)

    const duration = 50;
    const startTime = performance.now();

    function update(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        bullet.style.transform = `translate(${currentX}px, ${currentY}px)`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            bullet.remove()
        }
    }

    requestAnimationFrame(update);
}

window.addEventListener("mousemove", function(event) {
    mouse_position = [event.clientX, event.clientY]
})

window.addEventListener("keydown", function(event) {
    let turret_cost = get_turret_cost()
    if (event.key == "b" && money >= turret_cost) {
        money -= turret_cost
        
        let vw = turret_holder.getBoundingClientRect().right - turret_holder.getBoundingClientRect().left
        let vh = turret_holder.getBoundingClientRect().bottom - turret_holder.getBoundingClientRect().top

        let new_turret = document.createElement("div")
        new_turret.className = "turret"
        new_turret.style.left = Math.round((mouse_position[0] - turret_radius)/vw * 100) + "vw"
        new_turret.style.top = Math.round((mouse_position[1] - turret_radius)/vh * 100) + "vh"

        turret_holder.appendChild(new_turret)

        reset_text()

        let turret_id = setInterval(shoot, 1000)
        function shoot() {
            if (running == false) {
                clearInterval(turret_id)
            } else {
                let nearest_chugus = null
                let chungus_distance = 10000

                let chungi = document.getElementsByClassName("chungus")
                for (let index = 0; index < chungi.length; index++) {
                    let distance = Math.sqrt(Math.pow(new_turret.getBoundingClientRect().left - chungi.item(index).getBoundingClientRect().left, 2)
                                            + Math.pow(new_turret.getBoundingClientRect().top - chungi.item(index).getBoundingClientRect().top, 2))
                    if (distance < chungus_distance) {
                        chungus_distance = distance
                        nearest_chugus = chungi.item(index)
                    }
                }

                if (nearest_chugus) {
                    animate_bullet(new_turret, nearest_chugus)
                    nearest_chugus.remove()

                    let laser_audio = document.createElement("audio")
                    laser_audio.src = "sounds/laser.wav"
                    laser_audio.play()
                    laser_audio.volume = 0.2
                    laser_audio.addEventListener("ended", function() {
                        laser_audio.remove()
                    })
                }
            }
        }
    }
})

chungi_holder.addEventListener("animationiteration", function() {
    if (running) {
        wave++
        spawn_chungi(wave * 5)
        reset_text()
    }
})

spawn_chungi(5)

setInterval(check_if_lost, 20)

music.loop = true
music.volume = 0.2
music.play()