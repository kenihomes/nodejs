let imgStr;
// getlogindetail = () => {
//   const loginEmail = $("#loginEmail").val();
//   const loginPassword = $("#loginPassword").val();
//   const email = loginEmail
//   const password = loginPassword
//   return { email, password };
// };

// for login auth

function getlogindetail() {
  const email = $("#loginEmail").val();
  const password = $("#loginPassword").val();

  //validation
  mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(mailformat)) {
    return alert("please enter a valid email"), (flag = 0);
  }
  if (password == null) {
    return alert("Please enter password"), (flag = 0);
  }
  return { email, password };
}

async function loginauth() {
  try {
    const loginData = getlogindetail();
    if (loginData == 0) {
      return;
    }
    // console.log(JSON.stringify(data))
    const response = await fetch("api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const user = await response.json();
    // console.log(user)
    role = user.role;
    token = user.token;
    // token = JSON.stringify(token)
    window.localStorage.setItem("token", token);
    // console.log(window.localStorage.getItem("token",token))
    // clearLoginInput()
    console.log(role);
    window.location = window.location = `./${role}.html`;
  } catch (err) {
    alert(err);
  }
}

//to make suer info list

// for converting img to string
// document.getElementById("profileImage").addEventListener("change", imgconvert);
// function imgconvert() {
//   if (this.files && this.files[0]) {
//     var FR = new FileReader();
//     FR.readAsDataURL(this.files[0]);
//     FR.addEventListener("load", function (e) {
//       $("#profileImageShow").attr("src", e.target.result)
//       $("#b64").html(e.target.result)
//       // console.log(e.target.result)
//       imgStr = e.target.result
//     });
//   }
// }

//for get user birthDate
getBirthdate = () => {
  var date = new Date($("#birthDate").val());
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
};

//for geting user input values
getUserSigningData = () => {
  userName = $("#userName").val();
  email = $("#signinEmail").val();
  password = $("#signinPassword").val();
  comfirmPassword = $("#comfirmPassword").val();
  firstName = $("#firstName").val();
  lastName = $("#lastName").val();
  profileImg = imgStr;
  birthDate = getBirthdate();
  var role = $("#role").children("option:selected").val();

  // validation
  if (userName.length < 3) {
    return alert("username must be at least 3 characters");
  }
  if (firstName.length < 3) {
    return alert("firstname must be at least 3 characters");
  }
  if (lastName.length < 3) {
    return alert("lastname must be at least 3 characters");
  }
  if (password == null) {
    return alert("Please enter password");
  }
  if (password != comfirmPassword) {
    return alert("password and comfirmPassword doesnot match");
  }
  if (birthDate == "Invalid Date") {
    return alert("date is invalid");
  }
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(mailformat)) {
    return alert("please enter a valid email");
  }
  console.log(birthDate);
  return {
    userName,
    email,
    password,
    firstName,
    lastName,
    profileImg,
    birthDate,
    role,
  };
};

// send post request to rout for save user data to db
async function signinSubmit() {
  signingData = getUserSigningData();
  // console.log(signingData)
  try {
    const response = await fetch("api/user/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signingData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    alert("user successfully registered");
  } catch (err) {
    alert(err);
  }
}

function showCreateUser() {
  $(`input`).prop("disabled", true);
  $("[id$=roleInput]").hide();
  $("[id$=role]").show();
  $("[id$=updateDiv]").hide();
  $("[id$=editDiv]").show();
  $("#createNewUser").show();
}

function hideCreateUser() {
  $("#createNewUser").hide();
}

// for display all user
async function showAllUsers() {
  try {
    const response = await fetch("api/user/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    body = await response.json();
    // console.log(body)

    for (i = 0; i < body.length; i++) {
      makeList(body[i]);
    }
  } catch (err) {
    alert(err);
  }
}

// function showedit(id) {
//   $(`#${id}updateDiv`).hide()
//   $(`#${id}editDiv`).show()
// }

function showUpdate(id) {
  hideCreateUser();
  $("[id$=updateDiv]").hide();
  $("[id$=editDiv]").show();
  $(`#${id}editDiv`).hide();
  $(`#${id}updateDiv`).show();
}
// const changeButton = (state,id) => {
//   if (state === "edit") {
//       $(`#${id}edit`).text("edit");
//       `#${id}edit`.onclick = editName;
//   }

//   else if (state === "update") {
//       $(`#${id}update`).text("update");
//       `#${id}update`.onclick = updateUser(this.id);
//   }
// }

//show update button and abel to write in user info
function editName(lid) {
  let id = lid.slice(0, lid.indexOf("edit"));
  $(`input`).prop("disabled", true);
  $("[id$=roleInput]").hide();
  $("[id$=role]").show();

  // $(`#${id}firstName`).prop("disabled", true);
  // $(`#${id}lastName`).prop("disabled", true);
  // $(`#${id}userName`).prop("disabled", true);
  // $(`#${id}birthDate`).show();
  // $(`#${id}birthDateInput`).hide();
  // $(`#${id}role`).show();
  // $(`#${id}roleInput`).hide();
  // console.log(id)
  // editId = id;
  // console.log(editId)
  $(`#${id}firstName`).prop("disabled", false);
  $(`#${id}lastName`).prop("disabled", false);
  $(`#${id}userName`).prop("disabled", false);
  $(`#${id}birthDate`).hide();
  $(`#${id}birthDateInput`).show();
  $(`#${id}birthDateInput`).prop("disabled", false);

  // $(function () {
  //   $("[id$=birthDateInput]").datepicker({ dateFormat: "yy-mm-dd" });
  // });

  // var now = new Date();
  var date = $(`#${id}birthDate`).val().toString();

  console.log(date);

  // var day = ("0" + now.getDate()).slice(-2);
  // var month = ("0" + (now.getMonth() + 1)).slice(-2);

  // var today = now.getFullYear() + "-" + month + "-" + day;

  $(`#${id}birthDateInput`).val(date);

  $(`#${id}role`).hide();
  $(`#${id}roleInput`).show();
  // $(`#${id}firstName`).prop('disabled', false);
  // $(`#${id}firstName`).prop('disabled', false);
  showUpdate(id);
}

getUpdateBirthdate = (id) => {
  let date = new Date($(`#${id}birthDateInput`).val());
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
};

function getUpdateUserData(id) {
  // for geting data that user update
  id = id.slice(0, id.indexOf("update"));
  console.log(id);
  userName = $(`#${id}userName`).val();
  firstName = $(`#${id}firstName`).val();
  lastName = $(`#${id}lastName`).val();
  // profileImg = imgStr
  birthDate = getUpdateBirthdate(id);
  if (birthDate == "Invalid Date") {
    return alert("date is invalid");
  }
  role = $(`#${id}roleInput`).children("option:selected").val();

  //validation
  let now = new Date();
  now.setFullYear(now.getFullYear() - 5);
  if (birthDate > now) {
    alert("date must be in 5 year older");
  }
  if (userName.length < 3) {
    return alert("username must be at least 3 characters");
  }
  if (firstName.length < 3) {
    return alert("firstname must be at least 3 characters");
  }
  if (lastName.length < 3) {
    return alert("lastname must be at least 3 characters");
  }
  console.log(userName, firstName, lastName, birthDate, role);
  return { userName, firstName, lastName, birthDate, role, id };
}

async function updateUserData(id) {
  data = getUpdateUserData(id);
  try {
    const response = await fetch("api/user", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    alert(data.userName + " user successfully update");
    location.reload();
  } catch (err) {
    alert(err);
  }
}

async function deleteName(id) {
  id = id.slice(0, id.indexOf("delete"));
  data = { id };
  try {
    const response = await fetch("api/user", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    alert(" user successfully deleted");
    window.location.reload();
  } catch (err) {
    alert(err);
    window.location.reload();
  }
}

//for products
function showproduct() {
  $(`input`).prop("disabled", true);
  $(`#createNewProduct`).show();
  $("[id$=updateProductDiv]").hide();
  $("[id$=editProductDiv]").show();
}

function hideproduct() {
  $(`#createNewProduct`).hide();
}

function getNewProductValue() {
  productName = $(`#productName`).val();
  company = $(`#compny`).val();
  quantity = $(`#quantity`).val();
  price = $(`#price`).val();
  productType = $(`#productType`).val();
  console.log("hello3");

  // validation
  if (productName.length < 3) {
    return alert("producutname must be at least 3 characters"), (flag = 0);
  }
  if (company.length < 3) {
    return alert("companyname must be at least 3 characters"), (flag = 0);
  }
  if (productType.length < 3) {
    return alert("type must be at least 3 characters"), (flag = 0);
  }
  if (price == null) {
    return alert("price must be not null"), (flag = 0);
  }
  if (quantity == 3) {
    return alert("quantity must be not null"), (flag = 0);
  }

  return { productName, company, quantity, price, productType };
}

async function createProduct() {
  try {
    productData = getNewProductValue();
    console.log(productData);

    response = await fetch("api/product/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    location.reload();
  } catch (err) {
    alert(err);
  }
}

// show all product
async function showAllProduct() {
  try {
    const response = await fetch("api/product", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    body = await response.json();
    // console.log(body)

    for (i = 0; i < body.length; i++) {
      makeProductList(body[i]);
    }
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

// function showproductEdit(id) {
//   $("[id$=updateProductDiv]").hide();
//   $("[id$=editProductDiv]").hide();
//   $(`#${id}updateProductDiv`).hide();
//   $(`#${id}editProductDiv`).show();
// }

function showProductUpdate(id) {
  hideproduct();
  $("[id$=updateProductDiv]").hide();
  $("[id$=editProductDiv]").show();
  $(`#${id}updateProductDiv`).show();
  $(`#${id}editProductDiv`).hide();
}

function editProduct(lid) {
  console.log("helo edit");
  let id = lid.slice(0, lid.indexOf("productEdit"));
  $(`input`).prop("disabled", true);
  $(`select`).prop("disabled", true);
  $("[id$=roleInput]").hide();
  $("[id$=role]").show();

  console.log(id);
  editId = id;
  // console.log(editId)
  $(`#${id}productName`).prop("disabled", false);
  $(`#${id}company`).prop("disabled", false);
  $(`#${id}quantity`).prop("disabled", false);
  $(`#${id}price`).prop("disabled", false);
  $(`#${id}productType`).prop("disabled", false);
  showProductUpdate(id);
}

// for geting data that productupdate update
function getUpdateProductData(id) {
  //  id = id
  const productName = $(`#${id}productName`).val();
  const company = $(`#${id}company`).val();
  const quantity = $(`#${id}quantity`).val();
  const price = $(`#${id}price`).val();
  const productType = $(`#${id}productType`).val();
  let flag = 1;

  if (productName.length < 3) {
    return alert("producutname must be at least 3 characters "), (flag = 0);
  }
  if (company.length < 3) {
    return alert("companyname must be at least 3 characters"), (flag = 0);
  }
  if (productType.length < 3) {
    return alert("type must be at least 3 characters"), (flag = 0);
  }
  if (price == "" || price < 0) {
    return alert("type must be not null or less then 0"), (flag = 0);
  }
  if (quantity == "" || quantity < 0) {
    return alert("type must be not null or less then 0"), (flag = 0);
  }
  console.log(productName, company, quantity, price, productType, id, flag);
  return { productName, company, quantity, price, productType, id, flag };
}

async function updateProductData(id) {
  id = id.slice(0, id.indexOf("productUpdate"));
  data = getUpdateProductData(id);
  if (data == 0) {
    return;
  }
  try {
    const response = await fetch("api/product", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    //   if (flag == 0){
    //     window.location.reload()
    // }
    window.location.reload();
  } catch (err) {
    alert("this" + err);
    window.location.reload();
  }
}

async function deleteProduct(id) {
  id = id.slice(0, id.indexOf("deleteProduct"));
  data = { id };
  try {
    const response = await fetch("api/product", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    alert(" product successfully deleted");
    window.location.reload();
  } catch (err) {
    alert(err);
    window.location.reload();
  }
}

async function gettoken() {
  try {
    response = await fetch("auth/xyz", {
      method: "GET",
    });
    const token = await response.json();
    console.log(token);
    window.localStorage.setItem("token", token);
    window.location = window.location = "./Customer.html";
  } catch (err) {
    console.log(err);
  }
}
// window.alert = function() { throw("alert called") }

function logout() {
  localStorage.removeItem("token");
  window.location = window.location = "./index.html";
}
