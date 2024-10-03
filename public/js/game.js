// --------------------------- VARIABLES GLOBALES ---------------------------
// Variables principales del juego
let ejecutando = false
let dps = 1; // Valor por defecto en caso de que no haya nada en localStorage
let gold = 0;
let nivel = 1;
let enemyMaxHealth = 10; // Salud máxima del enemigo inicial
let enemyHealth = enemyMaxHealth;
let upgradeCost = 10;
const automaticCost = 50;
var user = "";
var pass = "";
var menuInicio = document.getElementById("menuIniciosesion");
var panelPrincipal = document.getElementById("game");
var ejecutando = false;
// Elementos del DOM
var enemyName = document.getElementById("enemy-name");
var enemyImage = document.getElementById("enemy-image");
const enemyHealthElement = document.getElementById('enemy-health');
const goldElement = document.getElementById('gold');
const dpsElement = document.getElementById('dps');
const upgradeCostElement = document.getElementById('upgrade-cost');
const resetButton = document.getElementById('reset-button');
const upgradeDpsButton = document.getElementById('upgrade-dps');
const automaticDps = document.getElementById('automatic-dps');
let randomNum = 1;

// --------------------------- FUNCIÓN DE INICIO Y CARGA DE LOCALSTORAGE ---------------------------
// Función que se ejecuta cuando se carga la página, para cargar datos desde localStorage

window.onload = function() {
    console.log(localStorage.getItem("max-health") + " Hola mundo");

    if (localStorage.getItem("dps") != null) {
        dps = parseInt(localStorage.getItem("dps"));
        console.log("DPS cargado correctamente: " + dps);
    } else {
        console.log("No se encontró DPS guardado, valor por defecto: " + dps);
    }

    if (localStorage.getItem("gold") != null) {
        gold = parseInt(localStorage.getItem("gold"));
        console.log("Oro cargado correctamente: " + gold);
    }

    if (localStorage.getItem("nivel")) {
        nivel = parseInt(localStorage.getItem("nivel"));
        console.log("Nivel cargado correctamente: " + nivel);
    }

    if (localStorage.getItem("upgradeCost")) {
        upgradeCost = parseInt(localStorage.getItem("upgradeCost"));
        console.log("Coste cargado correctamente: " + upgradeCost);
    }

    if (localStorage.getItem("max-health")) {
        enemyMaxHealth = parseInt(localStorage.getItem("max-health"));
        enemyHealth = enemyMaxHealth;
        console.log("Vida máxima cargada correctamente: " + enemyMaxHealth + " vida actual: " + enemyHealth);
    }

    updateEnemy();
    updateGame();
}

// --------------------------- INICIO Y REGISTRO DE SESIÓN ---------------------------
// Lógica para la gestión de inicio y registro de sesión Esto habrá que ajustarlo para FireBase 


//Loguearse, baby
document.getElementById("menuIniciosesion").addEventListener('submit', function(event) {
    event.preventDefault();

    // Usamos FormData para obtener los datos del formulario
    const formData = new FormData(event.target);
    const user = formData.get('textUser');
    const pass = formData.get('textPass');

    // Revisar si existen datos guardados en localStorage
    const storedUser = localStorage.getItem("userID");
    const storedPass = localStorage.getItem("passID");

    // Validar si el usuario ya existe
    if (storedUser && storedPass) {
        if (user === storedUser && pass === storedPass) {
            // Inicio de sesión exitoso
            ejecutando = true;
            menuInicio.style.visibility = "hidden";
            panelPrincipal.style.visibility = "visible";
            ejecutando = true;
        } else {
            // Error de autenticación
            showError("Usuario o contraseña incorrectos");
        }
    } else {
        // No hay datos almacenados, crear una cuenta
        showError("No se ha encontrado una cuenta. Por favor, regístrate.");
    }
});


//Crear cuenta 
document.getElementById("crearCuenta").addEventListener('click', function() {
    const user = document.getElementById("userID").value;
    const pass = document.getElementById("passID").value;

    // Verificamos si los campos no están vacíos
    if (user && pass) {
        // Comprobamos si el usuario ya existe en localStorage
        if (localStorage.getItem("userID") === user) {
            showError("El usuario ya existe. Por favor, elige otro nombre.");
        } else {
            // Guardamos el usuario y la contraseña en localStorage
            localStorage.setItem("userID", user);
            localStorage.setItem("passID", pass);
            ejecutando = true;
            alert("Cuenta creada exitosamente");

            // Opcional: Puedes redirigir a la pantalla de juego después del registro exitoso
            document.getElementById("menuIniciosesion").style.visibility = "hidden";
            document.getElementById("game").style.visibility = "visible";
            ejecutando = true;
        }
    } else {
        // Si uno de los campos está vacío, mostramos un error
        showError("Por favor, completa ambos campos de usuario y contraseña.");
    }
});

//Fin de la lógica de registro e inicio de sesión





// --------------------------- MECÁNICA DEL JUEGO ---------------------------


// Función para atacar al enemigo
function attackEnemy() {
    enemyHealth -= dps;
    if (enemyHealth <= 0) {
        let goldEarned = Math.round(10 * Math.pow(1.15, nivel)); // Oro ganado por nivel
        gold += goldEarned;
        localStorage.setItem("gold", gold);
        generateRandomNum();
        enemyImage.src = "img/enemies/" + randomNum + ".png";
        console.log("Enemigo: " + randomNum);
        nivel++; // Subimos de nivel
        localStorage.setItem("nivel", nivel);
        enemyMaxHealth = Math.round(10 * Math.pow(1.2, nivel)); // Salud del enemigo aumenta
        localStorage.setItem("max-health", enemyMaxHealth);
        enemyHealth = enemyMaxHealth; // Restablecemos la salud
        updateGame();
    }
    updateEnemy();
}



// Actualizar la salud del enemigo
function updateEnemy() {
    enemyHealthElement.textContent = Math.round(enemyHealth); // Redondeamos la salud
    enemyName.innerHTML = "Nivel enemigo: " + nivel;
    console.log("Nivel: " + nivel + " DPS: " + dps + " Vida máxima del enemigo: " + enemyMaxHealth);
}



// Actualizar el estado del juego (oro, DPS, costos)
function updateGame() {
    goldElement.textContent = gold;
    upgradeDpsButton.disabled = gold < upgradeCost;
    automaticDps.disabled = gold < automaticCost;
    dpsElement.textContent = dps;
    upgradeCostElement.textContent = upgradeCost;

    if (automaticDps.classList.contains('comprado')) {
        automaticDps.disabled = true;
    }
}





// --------------------------- MEJORAS Y DAÑO AUTOMÁTICO ---------------------------


// Función para mejorar el DPS
function upgradeDps() {
    if (gold >= upgradeCost) {
        gold -= upgradeCost;
        dps += Math.round(Math.pow(1.1, dps)); // Mejora el DPS
        upgradeCost = Math.round(10 * Math.pow(1.125, nivel)); // Aumenta el costo de mejora
        updateGame();

        // Actualizar localStorage
        localStorage.setItem("dps", dps);
        localStorage.setItem("upgradeCost", upgradeCost);
    }
}


// Daño automático por segundo
function automaticDamage() {
    if (enemyHealth > 0) {
        enemyHealth -= dps;
        if (enemyHealth <= 0) {
            let goldEarned = Math.round(10 * Math.pow(1.15, nivel)); // Oro ganado por nivel
            gold += goldEarned;
            nivel++; // Subimos de nivel
            enemyMaxHealth = Math.round(10 * Math.pow(1.2, nivel)); // Salud del enemigo aumenta
            enemyHealth = enemyMaxHealth; // Restablecemos la salud
            updateGame();
        }
        updateEnemy();
    }
}



// --------------------------- UTILIDADES ---------------------------

// Generar número aleatorio para elegir al siguiente enemigo
function generateRandomNum() {
    randomNum = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    return randomNum;
}

// Restablecer estadísticas del juego
function resetStats() {
    dps = 1;
    gold = 0;
    nivel = 1;
    enemyHealth = 10;
    enemyMaxHealth = 10;
    upgradeCost = 10;
    localStorage.setItem("nivel", nivel);
    localStorage.setItem("dps", dps);
    localStorage.setItem("upgradeCost", upgradeCost);
    localStorage.setItem("max-health", enemyMaxHealth);
    localStorage.setItem("gold", gold);
    automaticDps = dps;
    updateGame();
}

// --------------------------- EVENT LISTENERS ---------------------------


// Botón de reinicio de estadísticas
resetButton.addEventListener('click', resetStats);



// Detectar clic en cualquier parte del documento para atacar al enemigo
document.addEventListener('click', attackEnemy);



// Mejorar DPS
upgradeDpsButton.addEventListener('click', upgradeDps);



// Activar daño automático si el jugador compra la mejora
automaticDps.addEventListener('click', (ev) => {
    automaticDps.classList.add('comprado');
    automaticDps.innerText = 'COMPRADO';
    setInterval(automaticDamage, 50);
    gold -= automaticCost;
    updateGame();
});



// --------------------------- BUCLE DEL JUEGO ---------------------------
// Iniciar el ciclo del juego
function gameLoop() {
    if(ejecutando)
    {
        updateEnemy();
        updateGame();
    }
   
}



// Función para mostrar mensajes de error
function showError(message) {
    const errorElement = document.getElementById('zonaBaja');
    errorElement.innerHTML = `<p class="error">${message}</p>`;
    errorElement.style.color = 'red'; // Mostrar el mensaje en rojo
}

// Comenzar el bucle del juego
gameLoop();
