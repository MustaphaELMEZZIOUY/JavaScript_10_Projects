let  lengthpass = document.querySelector('.lengthpass');
let  uppercase = document.querySelector('.uppercase');
let  lowercase = document.querySelector('.lowercase');
let  number = document.querySelector('.numbers');
let  symbol = document.querySelector('.symbols');
let copy = document.querySelector('.copy');
let generate = document.querySelector('.generate');
let password = document.querySelector('.password');


let lower = 'abcdefghijklmnopqrstuvwxyz';
let upper = lower.toUpperCase();
let symbols = `&é"'(-è_çà=}{|[]#~$ù*!:/;})`;

function getLower() {
  return lower[Math.floor(Math.random() * lower.length)];
}

function getUpper() {
  return upper[Math.floor(Math.random() * upper.length)];
}

function getNumber() {
  return Math.floor(Math.random() * 10);
}

function getSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

generate.addEventListener('click', generatePassWord);

function generatePassWord() {
  let gets = new Array();
  let res = '';
  let n = 0;

  if(uppercase.checked) {
    gets.push(getUpper);
  }

  if(lowercase.checked) {
    gets.push(getLower);
  }

  if(number.checked) {
    gets.push(getNumber);
  }

  if(symbol.checked) {
    gets.push(getSymbol);
  }

  let getsLength = gets.length;

  if(getsLength){
    n = lengthpass.value;
    for(let i = 0; i < n; i++){
      res += gets[Math.floor(Math.random() * getsLength)]();
    }
  }

  password.value = res;
}

copy.addEventListener('click', copyPassword);

function copyPassword() {
  let res = password.value;
  
  if(res){
    console.log('we gonna copy the password now');
    // let password1 = document.getElementById('password');
    password.select();
    document.execCommand('copy');
  }
}
