const avatar = document.querySelector("#exampleAvatar");
const avatarImg = document.querySelector("#avatarImg");
avatar.addEventListener("input", function (e) {
  avatarImg.setAttribute("src", e.target.value);
});
