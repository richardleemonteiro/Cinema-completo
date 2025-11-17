// ==== Carrossel de filmes ====
const container = document.querySelector('.carousel-container');
const images = document.querySelectorAll('.carousel-container img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const title = document.querySelector('.carousel-title');

let index = 0;

function showImage() {
  container.style.transform = `translateX(${-index * 100}%)`;
  title.textContent = images[index].dataset.title;
}

next.addEventListener('click', () => {
  index = (index + 1) % images.length;
  showImage();
});

prev.addEventListener('click', () => {
  index = (index - 1 + images.length) % images.length;
  showImage();
});

// Troca automática a cada 4 segundos
setInterval(() => {
  index = (index + 1) % images.length;
  showImage();
}, 4000);

// Inicializa com o primeiro filme
showImage();

// ==== Redirecionamento manual dos botões ====
const botoes = document.querySelectorAll('.ver-sessoes');

// Redireciona cada botão para uma página específica
botoes[0].addEventListener('click', () => {
  window.location.href = 'se 1.html?filme=f5.jpg&titulo=Formula 1';
});

botoes[1].addEventListener('click', () => {
  window.location.href = 'se 3.html?filme=q5.jpg&titulo=Quarteto Fantástico';
});

botoes[2].addEventListener('click', () => {
  window.location.href = 'se 2.html?filme=s2.jpg&titulo=Superman';
});

botoes[3].addEventListener('click', () => {
  window.location.href = 'se 4.html?filme=m2.jpg&titulo=Missão Impossível';
});
