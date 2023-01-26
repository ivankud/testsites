const mainobject= {
    raplaces :[],
    counter :0,
}
function censer(a,b=0){
    if(b !== 0) mainobject.raplaces.push([a,b])
    else 
    mainobject.raplaces.forEach(item=>{
            console.log(item[0],item[1]);
            a=a.replaceAll(item[0],item[1]);
            console.log(a);
        }
    );
    return 1;
    // return a;
};

const changeScene = censer;

changeScene('1','2');
changeScene('3','4');
changeScene('5','6');
console.log('->>',mainobject.raplaces)
console.log(changeScene('51231223   5423512313123123'));
