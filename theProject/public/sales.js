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
        if(data[1] != "Sales")
        {
            alert("you are not Sales")
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

  //for loging out
  function logout(){
    localStorage.removeItem('token')
    window.location = window.location = './index.html';
}

function showproduct() {
    $(`#createNewProduct`).show()
}

function getNewProductValue() {
    productName = $(`#productName`).val()
    company = $(`#compny`).val()
    quantity = $(`#quantity`).val()
    price = $(`#price`).val()
    productType = $(`#productType`).val()
    console.log("hello3")
    return { productName, company, quantity, price, productType }
}

async function createProduct() {
    try {

        productData = getNewProductValue()
        console.log(productData)

        response = await fetch('api/product/product', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        alert("product added")
        location.reload()

    }
    catch (err) {
        alert(err);
    }
}

const makeProductList = (product) => {
    productList = `<li id="${product.id}" >
    <div class="row">
      <div class="form-group col-2">
          <input type="text" class="form-control" placeholder="first name" id="${product.id}productName" value="${product.productName}" disabled>
      </div>
      <div class="form-group col-2 ">
          <input type="text" class="form-control" placeholder="company" id="${product.id}company" value="${product.company}" disabled>
      </div>
      <div class="form-group col-2 ">
          <input type="number" class="form-control" placeholder="quantity" id="${product.id}quantity" value="${product.quantity}" disabled>
      </div>
      <div class="form-group col-2 ">
          <input type="number" class="form-control" placeholder="price" id="${product.id}price" value="${product.price}" disabled>
      </div>
      <div class="form-group col-2 ">
          <input type="text" class="form-control" placeholder="type" id="${product.id}productType" value="${product.productType}" disabled>
      </div> 
      <div class="form-group col-1" id="${product.id}editProductDiv">
          <button class="btn btn-primary" id="${product.id}productEdit" onclick="editProduct(this.id)">
              Edit
          </button>
      </div>
      <div class="form-group col-1" style="display:none" id ="${product.id}updateProductDiv">
          <button class="btn btn-primary" id="${product.id}productUpdate" onclick="updateProductData(this.id)">
              update
          </button>
      </div>
      </div>
    </li>`
    $("#productUl").append(productList);
}

// show all product
async function showAllProduct() {
    try {
        console.log("heloooooooo")
        const response = await fetch("api/product", {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        body = await response.json();
        // console.log(body)

        for (i = 0; i < body.length; i++) {
            makeProductList(body[i])
        }
    }
    catch (err) {
        console.log(err)
    }
}

function showproductEdit(id) {
    $(`#${id}updateProductDiv`).hide()
    $(`#${id}editProductDiv`).show()
}

function showProductUpdate(id) {
    $(`#${id}updateProductDiv`).show()
    $(`#${id}editProductDiv`).hide()
}

function editProduct(lid) {
    console.log("helo edit")
    let id = lid.slice(0, lid.indexOf("productEdit"));
    console.log(id)
    editId = id;
    // console.log(editId)
    $(`#${id}productName`).prop('disabled', false);
    $(`#${id}company`).prop('disabled', false);
    $(`#${id}quantity`).prop('disabled', false);
    $(`#${id}price`).prop('disabled', false);
    $(`#${id}productType`).prop('disabled', false);
    showProductUpdate(id)
}

// for geting data that productupdate update
function getUpdateProductData(id) {
    //  id = id
    const productName = $(`#${id}productName`).val();
    const company = $(`#${id}company`).val();
    const quantity = $(`#${id}quantity`).val();
    const price = $(`#${id}price`).val();
    const productType = $(`#${id}productType`).val();
    console.log("hello3....")
    console.log(productName, company, quantity, price, productType)
    return { productName, company, quantity, price, productType, id }
}

async function updateProductData(id) {
    id = id.slice(0, id.indexOf("productUpdate"));
    data = getUpdateProductData(id);
    try {
        const response = await fetch("api/product", {
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
        window.location.reload()
    }

    catch (err) {
        alert(err)
        window.location.reload()
    }
}
