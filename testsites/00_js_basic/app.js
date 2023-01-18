let num = Math.floor(Math.random()*10);
console.log(num)
let trylimit = 5;
let trycount = 0;
let flag = false;

function resettrycount(){
    trycount=0;
}

function reset(){
    num = Math.floor(Math.random()*10);
    trylimit = 5;
    trycount = 0;
    flag = false;
    document.getElementById('counter').innerHTML=trycount;
    document.getElementById('message').innerHTML='';
}

function checkNum(number){
    if(trycount < trylimit && !flag) {        
        if(number == num){
            // trycount+=1;
            // document.getElementById('counter').innerHTML=trycount;
            flag = true
            document.getElementById('message').innerHTML='Отгадали число '+num;
        }
        else {
            trycount+=1;
             if(trycount >= trylimit)  { document.getElementById('message').innerHTML='Попытки кончились';}
            document.getElementById('counter').innerHTML=trycount;
        }
    }
    else {
            // trycount+=1;
            document.getElementById('counter').innerHTML=trycount;
            document.getElementById('message').innerHTML='Попытки кончились';
    }
}