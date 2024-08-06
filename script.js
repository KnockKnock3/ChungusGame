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
const turret_holder = document.getElementById("turret_holder")
const chugus_hit = document.getElementById("hit")

let money = 0;
let running = true;
let spawning_chungi = false;
let wave = 0;

let turrets = 0
const turret_radius = 15

let mouse_position = [0, 0]

function get_turret_cost() {
    return 20 * (turrets + 1)
}

function reset_text() {
    wave_text.innerHTML = "Wave " + wave
    money_text.innerHTML = "Money " + money
    turret_text.innerHTML = "Turret Cost " + get_turret_cost()
}

function chungus_clicked(button_element) {
    if (running) {
        money += 100;
        reset_text()
        button_element.remove()
        chugus_hit.play()
    }
}

function end_game() {
    if (running) {
        running = false
        quote_text.innerHTML = death_messages[Math.floor(Math.random() * death_messages.length)];
        reset_text()
    }
}

function spawn_chungi(number) {
    let id = setInterval(spawn_chungus, 500, number)
    spawning_chungi = true
    function spawn_chungus() {
        if (number == 0 || running == false) {
            clearInterval(id)
            spawning_chungi = false
        } else {
            let new_chungus_button = document.createElement("button")
            new_chungus_button.classList.add("chungi", "prevent_select")
            new_chungus_button.draggable = false
            
    
            new_chungus_button.onclick = function() {
                chungus_clicked(new_chungus_button)
            }
    
            let new_chungus_image = document.createElement("img")
            new_chungus_image.src = "images/big.png"
            new_chungus_image.alt = "Big Chungus"
            new_chungus_image.draggable = false
            new_chungus_image.className = "prevent_select"
    
            new_chungus_button.appendChild(new_chungus_image)
    
            new_chungus_button.addEventListener("animationend", () => {
                end_game()
            })
    
            chungi_holder.appendChild(new_chungus_button)
    
            number--;
        }
    }
}

function place_turret() {
    let turret_cost = get_turret_cost()
    if (money >= turret_cost && running) {
        money -= turret_cost
        turrets++
        reset_text()

        let new_turret = document.createElement("div")
        turret_holder.appendChild(new_turret)
        new_turret.className = "turret"
        new_turret.style.left = (mouse_position[0] - turret_radius) + "px"
        new_turret.style.top = (mouse_position[1] - turret_radius) + "px"
    }
}

function check_wave() {
    if (spawning_chungi == false && running == true) {
        wave++
        reset_text()
        spawn_chungi(wave * 5)
    }
}

window.addEventListener("mousemove", function(event) {
    mouse_position = [event.clientX, event.clientY]
})

window.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "b": place_turret(); break;
    }
})

let wave_checker = setInterval(check_wave, 500)