const mainobject= {
    raplaces :[],
    counter :0,
}
function censer(a,b=0){
    if(b !== 0) mainobject.raplaces.push([a,b])
    else 
    mainobject.raplaces.forEach(item=>a=a.replaceAll(item[0],item[1]));
    // return 1;
    return a;
};

const changeScene = censer;

changeScene('1','2');
changeScene('.','4');
changeScene('5','6');
// console.log('->>',mainobject.raplaces)
console.log('5.....1231223   5423512313123123..')
console.log(changeScene('5.....1231223   5423512313123123..'));
