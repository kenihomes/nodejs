
//user varification by jwt token
async function userValidation(){
    // // check if jwt token is valid and present if not then redirect to login page
    // console.log(window.localStorage.getItem("token"))
    if(!window.localStorage.getItem("token")){
        alert("you dont have jwt token")
        window.location = window.location = './index.html';
    }

    if(window.localStorage.getItem("token")){
    try {
        //get token from local storage and fatch user detail
        token = window.localStorage.getItem("token")
        console.log(token)
        const response = await fetch("api/auth/me", {
            method: "GET",
            headers: {
                'x-auth-token': `${token}`  
            },          
        });
        const data = await response.json();
        console.log(data)
        $("#currentUser").append(data[0])
        if(data[1] != "Customer")
        {
            alert("you are not Customer")
            window.location = window.location = './index.html';
        }
        if (!response.ok) {
            throw new Error(await response.text());
        }      
    }
    catch (err) {
        alert("session expired" + err)
        logout()
        window.location = window.location = './index.html';
    }
}
}
userValidation()

$( document ).ready(function() {
    showAllProduct()
});

const makeProductList = (product) => {
    productList = `<li id="${product.id}">
    <div class="row">
        <div class="form-group col-2">
            <input type="text" class="form-control" placeholder="first name" id="${product.id}productName"
                value="${product.productName}" disabled>
        </div>
        <div class="form-group col-2 ">
            <input type="text" class="form-control" placeholder="company" id="${product.id}company"
                value="${product.company}" disabled>
        </div>
        <div class="form-group col-2 ">
            <input type="number" class="form-control" placeholder="quantity" id="${product.id}quantity"
                value="${product.quantity}" disabled>
        </div>
        <div class="form-group col-2 ">
            <input type="number" class="form-control" placeholder="price" id="${product.id}price"
                value="${product.price}" disabled>
        </div>
        <div class="form-group col-2 ">
            <input type="text" class="form-control" placeholder="type" id="${product.id}productType"
                value="${product.productType}" disabled>
        </div>
        <div class="form-group col-2" id="${product.id}buyThisProductDiv">
            <button class="btn btn-primary" id="${product.id}buyThis" onclick="buyThisProduct(this.id)">
                Buy This
            </button>
        </div>
        <div class="form-group col-4" id="${product.id}buyProductDiv" style="display:none">
            <input type="number" class="form-control" placeholder="how many" id="${product.id}buyInput" value="0">
            <button class="btn btn-primary" id="${product.id}buy" onclick="buyProduct(this.id)">
                Buy
            </button>
        </div>
    </div>
</li>`
    $("#productUl").append(productList);
}

// show all product
// async function showAllProduct() {
//     try {
//         console.log("heloooooooo")
//         const response = await fetch("api/product", {
//             method: "get",
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });
//         if (!response.ok) {
//             throw new Error(await response.text());
//         }
//         body = await response.json();
//         // console.log(body)

//         for (i = 0; i < body.length; i++) {
//             makeProductList(body[i])
//         }
//     }
//     catch (err) {
//         console.log(err)
//     }
// }



function buyThisProduct(id){
    console.log("you buying")
    id = id.slice(0, id.indexOf("buyThis"));
    console.log(id)
    $(`#${id}buyThisProductDiv`).hide()
    $(`#${id}buyProductDiv`).show()
}

async function buyProduct(id){
    id = id.slice(0, id.indexOf("buy"));
    productBuy = $(`#${id}buyInput`).val()
    quantity = $(`#${id}quantity`).val()
    price = $(`#${id}price`).val()

    if( 0>(quantity-productBuy)){ return alert("we dont have that much")}
    quantity = quantity-productBuy
    $(`#${id}quantity`).val(quantity)
    alert("you have to pay " + (price*productBuy))
    $(`#${id}buyInput`).val("")

    $(`#${id}buyThisProductDiv`).show()
    $(`#${id}buyProductDiv`).hide()

    data = {quantity , id };
    try {
        const response = await fetch("api/product/customer", {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        alert(" product successfully update")
        // window.location.reload()
    }
    catch (err) {
        alert(err)
        // window.location.reload()
    }
}
