const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");

const showCadastro = document.getElementById("showCadastro");
const showLogin = document.getElementById("showLogin");

// Usuário e senha fixos para teste
const validUser = "admin";
const validPass = "1234";

// Alterna para o formulário de cadastro
showCadastro.addEventListener("click", () => {
  loginForm.style.display = "none";
  cadastroForm.style.display = "block";
});

// Alterna para o formulário de login
showLogin.addEventListener("click", () => {
  cadastroForm.style.display = "none";
  loginForm.style.display = "block";
});

// Simulação de login com validação
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(username === validUser && password === validPass){
    window.location.href = "index.html"; // login correto
  } else {
    alert("Usuário ou senha incorretos!");
  }
});

// Simulação de cadastro
cadastroForm.addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Cadastro realizado com sucesso!");
  cadastroForm.style.display = "none";
  loginForm.style.display = "block";
});
