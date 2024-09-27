let dps = 1; // Valor por defecto en caso de que no haya nada en localStorage


/* Función para el localstorage, guardar información en local
window.onload = function() {
    if(localStorage.getItem("dps")) {
        dps = parseInt(localStorage.getItem("dps"));
        console.log("DPS cargado correctamente: " + dps);
    } else {
        console.log("No se encontró DPS guardado, valor por defecto: " + dps);
    }

    
}

*/

let gold = 0;
let nivel = 1;
let enemyHealth = 10;
let enemyMaxHealth = 10; // Salud máxima del enemigo inicial
let upgradeCost = 10;
var enemyName = document.getElementById("enemy-name");
var enemyImage = document.getElementById("enemy-image");
const enemyHealthElement = document.getElementById('enemy-health');
const goldElement = document.getElementById('gold');
const dpsElement = document.getElementById('dps');
const upgradeCostElement = document.getElementById('upgrade-cost');
const upgradeDpsButton = document.getElementById('upgrade-dps');
const automaticDps = document.getElementById('automatic-dps');
const automaticCost = 700
let randomNum = 1;






// Función para atacar al enemigo, se puede cambiar por un event listener aquí directamente, funciona, pero le pasa algo raro de vez en cuando de esa forma
function attackEnemy() {
    enemyHealth -= dps;
    if (enemyHealth <= 0) {
        let goldEarned = Math.round(10 * Math.pow(1.15, nivel)); // Oro ganado por nivel, aumenta según el nivel que estás
        gold += goldEarned;
        generateRandomNum();
        enemyImage.src= "img/enemies/"+randomNum+".png";
        console.log("enemigo :"+randomNum);
        nivel++; // Subimos de nivel
        enemyMaxHealth = Math.round(10 * Math.pow(1.2, nivel)); // Salud del enemigo escala exponencialmente, aumenta ma o meno de un 20% por lvl
        enemyHealth = enemyMaxHealth; // Restablecemos la salud
        updateGame();
    }
    updateEnemy();
}


// Actualizar la salud del enemigo
function updateEnemy() {
    enemyHealthElement.textContent = Math.round(enemyHealth); // Redondeamos la salud
    enemyName.innerHTML="Nivel enemigo:"+nivel;
    console.log("Nivel:"+nivel+ " DPS:"+dps+" enemy max health:" +enemyMaxHealth);
}



// Actualizar el estado del juego
function updateGame() {
    goldElement.textContent = gold;
    upgradeDpsButton.disabled = gold < upgradeCost;
    automaticDps.disabled = gold < automaticCost;
    dpsElement.textContent = dps;
    upgradeCostElement.textContent = upgradeCost;

    if(automaticDps.classList.contains('comprado')){
        automaticDps.disabled = true;
    }
}



// Mejorar el DPS
function upgradeDps() {
    if (gold >= upgradeCost) {
        gold -= upgradeCost;
        dps += Math.round(Math.pow(1.1,dps)); // Mejora el DPS, que también aumenta exponencialmente
        upgradeCost = Math.round(10 * Math.pow(1.25, nivel)); // Coste de mejora, escala exponencialmente
        updateGame();
        
        /* actualizar local storage
        localStorage.setItem("dps",dps);
        if(localStorage.getItem("dps"))
        {
            console.log("dps guardado");
        }
        */
    }
}



// Función de daño automático por segundo, esto va bien, no he encontrado errores de momento :o
function automaticDamage() {
    if (enemyHealth > 0) {
        enemyHealth -= dps;
        if (enemyHealth <= 0) {
            let goldEarned = Math.round(10 * Math.pow(1.15, nivel)); // Oro ganado por nivel
            gold += goldEarned;
            nivel++; // Subimos de nivel
            enemyMaxHealth = Math.round(10 * Math.pow(1.2, nivel)); // Salud del enemigo escala exponencialmente
            enemyHealth = enemyMaxHealth; // Restablecemos la salud
            updateGame();
        }
        updateEnemy();
    }
}

//metodo para generar número random y elegir el siguiente enemigo
function generateRandomNum()
{
    randomNum = Math.floor(Math.random()* (4-1+1)) + 1;
    return randomNum;
}

// Event Listeners
document.addEventListener('click', attackEnemy); // Detecta clic en cualquier lugar del documento
upgradeDpsButton.addEventListener('click', upgradeDps); //pa mejorar
automaticDps.addEventListener('click', (ev) => {
    setInterval(automaticDamage, 1000);
    gold -= automaticCost;
    updateGame();
    automaticDps.classList.add('comprado');
    automaticDps.innerText = 'COMPRADO'
}); // Daño automatico si lo compra

// Iniciar el juego
function gameLoop() {
     // Daño automático cada segundo, se puede hacer una habilidad para reducir el tiempo que tarda en hacer el daño automatico
    updateEnemy();
    updateGame();
}

// Comienza el ciclo del juego, loop infinito cerdas.
gameLoop();