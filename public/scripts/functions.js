anotherFunction = () => {
  nameField.style.maxHeight = "65px";
  title.innerHTML = "Sign Up";
  signinBtn.classList.add("disabled");
  signupBtn.classList.remove("disabled");
};

myFunction = () => {
  nameField.style.maxHeight = "0";
  title.innerHTML = "Sign In";
  signupBtn.classList.add("disabled");
  signinBtn.classList.remove("disabled");
};
module.exports = {myFunction}