let products = {
    list :[
        {
            "id":1,
            "name":"product 1",
            "cost": 200
        },
        {
            "id":3,
            "name":"product 3",
            "cost": 600
        },
        {
            "id":2,
            "name":"product 2",
            "cost": 400
        }
    ],
    basket : [],
    getlist (){
        let tmplist = this.list.sort((a,b) => a.cost - b.cost);
        return tmplist
    },
    putBasket (numProduct){
        this.basket.push(this.list.filter(item=>item.id === numProduct)[0]);
        let cost = products.getCost();
        let productsList ='';
        this.list.forEach(element => {
            let tmparr = this.basket.filter(item => item.name === element.name).length??0;
            if(tmparr > 0) {productsList += `<div> ${element.name +' x'+tmparr} <button onclick={products.deleteOneFromBasket(${element.id})}>-</button></div>`}           
        });
        console.log(this.basket);
        document.getElementById('basket').innerHTML = `<div> <b>Product List </b> ${productsList}</div><div><b>Cost</b>:${cost}</div>`;
    },
    deleteOneFromBasket(numProduct){
        console.log(numProduct)
        let tmpBasket_1 = this.basket.filter(item=>item.id !== numProduct)
        let tmpBasket_2 = [...this.basket.filter(item=>{ return Number(item.id) === Number(numProduct)})];
        tmpBasket_2.pop()
        this.basket = [...tmpBasket_1, ...tmpBasket_2];
        let productsList ='';
        let cost = products.getCost();
        this.list.forEach(element => {
            let tmparr = this.basket.filter(item => item.name === element.name).length??0;
            if(tmparr > 0) {productsList += `<div> ${element.name +' x'+tmparr} <button onclick={products.deleteOneFromBasket(${element.id})}>-</button></div>`}           
        });
        console.log(productsList);
        document.getElementById('basket').innerHTML = `<div> <b>Product List </b> ${productsList}</div><div><b>Cost</b>:${cost}</div>`;
    },
    getCost(){
        let cost = this.basket.reduce(
            (acc, item)=> {return acc+item.cost;}
            ,0)
        return cost??0;
    }
};

let getItem = (item) => {
    return `<div style=" display: inline-block;
                            outline: 1px ;
                            right-padding:3px;
                            outline-style: solid;
                            width: 100px;
                            text-align: center;
                            margin:3px">
                <div id='name' style="padding:3px">${item.name}</div>
                <div id='cost' style="padding:3px">${item.cost}</div>
                <button onclick={products.putBasket(${item.id});}>+</button>
            </div>`;
}
let renderList = ()=> {
    let list = products.getlist()
    let prodList = list.map(item=> getItem(item)).join('');
    prodList = `${prodList}`;
    document.getElementById('list').innerHTML = prodList;
    let cost = products.getCost();
    document.getElementById('basket').innerHTML = 'Cost : ' + cost;
}


renderList()