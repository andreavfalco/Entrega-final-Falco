//ejercicio 1
console.log("Ejercicio 1")
let num1 = prompt("Ingresa el primer número: ");
let num2 = prompt("Ingresa el segundo número: ");

console.log(typeof(num1));

num1 = parseInt(num1);
num2 = parseFloat(num2);

console.log("Suma: " + (num1 + num2));
console.log("Resta: " + (num1 - num2));
console.log("Multiplicación: " + (num1 * num2));
console.log("División: " + (num1 / num2));
console.log("Módulo: " + (num1 % num2));

//Ejercicio 2

console.log("")
console.log("Ejercicio 2")
let nommbre = prompt("Tu nombre: ");
let edad = prompt("Tu edad: ");

if(isNaN(edad)){
    console.log("Hola " + nommbre + "!" + "No ingresaste un valos válido para la edad");
    }
else {
    let edadNumber = parseInt(edad);
    if (edadNumber >= 18) {
        console.log("Hola " + nommbre + "!" + "sos mayor de edad");
        }
    else{
        console.log("Hola " + nommbre + "!" + "No sos mayor de edad");
    }

}

