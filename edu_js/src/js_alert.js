let age = 6;
let welcome = (age > 18) ?
    () => alert('Здравствуйте') :
    (age<=3)?() => alert('под сюды!'):
        () => alert("Привет!");
debugger;
let str =`asdfasadfasdfasdfasdfassdfasdfasdfasdfsadfasdfasdfasdfasdfdfaasdfaasdfasdsffsadfasdfasdfasdfsadfasdfasdfasdfasdfasdf
asdfasdfasdfasdfaфывфывффывфыфsdfasdfasdfasdfsadfasdfasdfasdfasdfdfaasdfaasdfasdsffsadfasdfasdfasdfsadfasdfasdfasdfasdfasdfвasdf
asdfasdfasфывфывффывфыфвsdfasdfasdfasdfsadfasdfasdfasdfasdfdfaasdfaasdfasdsffsadfasdfasdfasdfsadfasdfasdfasdfasdfasdf
11231231asdfasdfasdfasdfsadfasdfasdfasdfasdfdfaasdfaasdfasdsffsadfasdfasdfasdfsadfasdfasdfasdfasdfasdf
фывфывффывфыфвsdfasdfasdfasdfsadfasdfasdfasdfasdfdfaasdfaasdfasdsffsadfasdfasdfasdfsadfasdfasdfasdfasdfasdf
123123123`;
console.log(str)
welcome();