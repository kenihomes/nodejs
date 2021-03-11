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
      if(data[1] != "Management")
      {
          alert("you are not Management")
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

// showProductInit()
$( document ).ready(function() {
  showAllProduct()
}); 

const makeList = (user) => {
    list = `<li id="${user.id}" >
  <div class="row">
    <div class="form-group col-2">
        <input type="text" class="form-control" placeholder="first name" id="${user.id}firstName" value="${user.firstName}" disabled>
    </div>
    <div class="form-group col-2 ">
        <input type="text" class="form-control" placeholder="last name" id="${user.id}lastName" value="${user.lastName}" disabled>
    </div>
    <div class="form-group col-2 ">
        <input type="text" class="form-control" placeholder="user name" id="${user.id}userName" value="${user.userName}" disabled>
    </div>
    <div class="form-group col-2 ">
        <input type="text" class="form-control" placeholder="email" id="${user.id}email" value="${user.email}" disabled>
    </div>
    <div class="form-group col-1 ">
        <input type="text" class="form-control" placeholder="birthdate" id="${user.id}birthDate" value="${user.birthDate}" disabled>
        <input type="date" id="${user.id}birthDateInput" class="form-control" style="display:none">
    </div>
    <div class="form-group col-1 ">
        <input type="text" class="form-control" placeholder="role" id="${user.id}role" value="${user.role}" disabled>
        <select id='${user.id}roleInput' style="display:none">
                              <option> Admin </option>
                              <option> Management </option>
                              <option> Sales </option>
                              <option> Customer </option>
        </select>
    </div>
    </div>
  </li>`
    $("#userUl").append(list);
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
          <input type="number" min="0" class="form-control" placeholder="quantity" id="${product.id}quantity" value="${product.quantity}" disabled>
      </div>
      <div class="form-group col-2 ">
          <input type="number" min="0" class="form-control" placeholder="price" id="${product.id}price" value="${product.price}" disabled>
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
      <div class="form-group col-1">
          <button class="btn btn-danger" id="${product.id}deleteProduct" onclick="deleteProduct(this.id)">
              Delete
          </button>
      </div>
      </div>
    </li>`
      $("#productUl").append(productList);
    }
  
