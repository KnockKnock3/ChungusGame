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

const wave_text = document.getElementById("wave_text")
const money_text = document.getElementById("money_text")
const turret_text = document.getElementById("turret_text")
const quote_text = document.getElementById("quote_text")
quote_text.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];

const chugus_hit = document.getElementById("hit")

let money = 0;
let running = true;
let wave = 1;
let wave_chungus_left = 0;

let turrets = 0

function get_turret_cost() {
    return 20 * (turrets + 1)
}

function reset_text() {
    wave_text.innerHTML = "Wave " + wave
    money_text.innerHTML = "Money " + money
    turret_text.innerHTML = "Turret Cost " + get_turret_cost()
}

function chungus_clicked(button_element) {
    money += 1;
    reset_text()
    button_element.remove()
    chugus_hit.play()
}

function spawn_chungi(number) {
    let id = setInterval(spawn_chungus, 500, number)
    function spawn_chungus() {
        if (number == 0) {
            clearInterval(id)
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
                console.log("Dead")
            })

            document.getElementById("chungi_holder").appendChild(new_chungus_button)

            number--;
        }
    }
}

spawn_chungi(10)