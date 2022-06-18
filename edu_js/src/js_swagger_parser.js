// getElement('http://172.16.50.42:9095/mes/swagger-ui/index.html')
// let test_elem = document.getElementById("operations-tag-Состояние");
// console.log(test_elem);
// let addr = new URL("http://172.16.50.42:9995/soup/swagger-ui/index.html");
// try {
//     gotoPage(addr);
//     // loginUser(addr.searchParams.get("sysadm"));
//     // gotoPage(addr.searchParams.get("sysadm"));
//     alert('Yo');
// } catch(err) {
//     alert(`Fail ${err}`)
//     // showErrorMessage(err);
// }


fetch('http://172.16.50.42:9995/soup/swagger-ui/index.html')
    .then(function (response) {
        switch (response.status) {
            // status "OK"
            case 200:
                return response.text();
            // status "Not Found"
            case 404:
                throw response;
        }
    })
    .then(function (template) {
        console.log(template);
    })
    .catch(function (response) {
        // "Not Found"
        console.log(response.statusText);
    });