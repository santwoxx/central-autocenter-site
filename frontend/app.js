// Initialize Lucide Icons immediately (since app.js is executed at the bottom of the body)
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}


/* ==========================================================================
   1. BACKGROUND VIDEO ENGINE & SCROLL PARALLAX (Autoplay & 3D Parallax Move)
   ========================================================================== */
let currentTab = 'inicio';
const video = document.getElementById('bgVideo');
const video2 = null; // Removed from HTML, set to null to avoid ReferenceErrors
const heroContent = document.getElementById('heroContent');

// Set initial opacity to 0 to prevent sudden white visual flash
if (video) video.style.opacity = '0';

// Smooth 500ms fade-in animation
function fadeInVideoElement(v) {
  if (!v) return;
  const duration = 500;
  const startTime = performance.now();
  
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    v.style.opacity = progress.toString();
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// Trigger fade-in when the video starts playing
if (video) {
  video.addEventListener('playing', () => {
    fadeInVideoElement(video);
  }, { once: true });
}



// Autoplay trigger with click/touch fallback for browsers with strict policy
window.addEventListener('DOMContentLoaded', () => {
  if (video) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log("Autoplay blocked. Waiting for first interaction.");
        const playOnUserInteraction = () => {
          video.play().then(() => {
            fadeInVideoElement(video);
          }).catch(e => console.log(e));
          

          document.body.removeEventListener('click', playOnUserInteraction);
          document.body.removeEventListener('touchstart', playOnUserInteraction);
        };
        document.body.addEventListener('click', playOnUserInteraction);
        document.body.addEventListener('touchstart', playOnUserInteraction);
      });
    }
  }
});

// Butter-smooth scroll parallax animation for 3D depth and layout-splitting effect
let lastScrollY = 0;
let ticking = false;

function updateScrollAnimations(scrollY) {
  // Calculate relative scroll of heroContent (Início)
  const heroHeight = heroContent ? heroContent.offsetHeight : window.innerHeight;
  const heroScrollFraction = Math.min(Math.max(scrollY / heroHeight, 0), 1);

  // The tire video now lives in a normal-flow white card next to the hero
  // text, so it scrolls away with the page naturally — no manual transform.
  if (video) {
    if (heroScrollFraction < 1) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  }

  if (heroContent) {
    const textTranslateY = heroScrollFraction * 75;
    const textOpacity = 1 - heroScrollFraction * 0.1;
    heroContent.style.transform = `translateY(${textTranslateY}px)`;
    heroContent.style.opacity = textOpacity.toString();
  }
}

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollAnimations(lastScrollY);
      ticking = false;
    });
    ticking = true;
  }
});






/* ==========================================================================
   2. TIRE DATABASE & SEARCH ENGINE (WhatsApp Redirection)
   ========================================================================== */
const tiresDatabase = [
  { code: 'PNEU-1063', brand: 'Barum', model: 'Bravuris AT (Conti)', size: '225/65 R17', stock: '26 un', price: 910.00, details: 'Pneu robusto All-Terrain (A/T), ideal para asfalto e terra com alta durabilidade.' },
  { code: 'PNEU-1081', brand: 'General Tire', model: 'Altimax One', size: '185/70 R14', stock: '2 un', price: 421.00, details: 'Excelente escoamento de água e frenagem segura em pisos molhados.' },
  { code: 'PNEU-1114', brand: 'Maxtrek', model: 'Sierra S6', size: '225/65 R17', stock: '1 un', price: 570.00, details: 'Design otimizado para SUV, oferecendo rodagem macia e silenciosa.' },
  { code: 'PNEU-1122', brand: 'Aplus', model: 'All Terrain A929 LT', size: '265/75 R16', stock: '2 un', price: 917.00, details: 'Pneu off-road de alta resistência, tração superior em lama.' },
  { code: 'PNEU-1140', brand: 'Barum', model: 'Bravuris 4x4 (Conti)', size: '205/70 R15', stock: '5 un', price: 562.00, details: 'Pneu para SUV e comerciais leves, excelente tração e aderência.' },
  { code: 'PNEU-1183', brand: 'Barum', model: 'Eurovan 2', size: '195/70 R15', stock: '8 un', price: 978.00, details: 'Desenvolvido para vans e comerciais leves. Alta durabilidade e economia.' },
  { code: 'PNEU-1269', brand: 'Dunlop', model: 'SP Sport', size: '185/60 R14', stock: '2 un', price: 472.00, details: 'Design esportivo com ótima resposta de direção e aderência.' },
  { code: 'PNEU-1466', brand: 'Comforser', model: 'CF1100 A/T', size: '205/70 R15', stock: '2 un', price: 546.00, details: 'Pneu misto todo-terreno de alta durabilidade e excelente tração.' },
  { code: 'PNEU-1508', brand: 'Milever', model: 'MP270', size: '195/65 R15', stock: '1 un', price: 305.00, details: 'Pneu confortável de passeio com excelente custo-benefício.' },
  { code: 'PNEU-1510', brand: 'Forward', model: 'Barbrian', size: '175/75 R14', stock: '12 un', price: 273.00, details: 'Pneu reforçado de carga com ótima estabilidade nas estradas.' },
  { code: 'PNEU-1711', brand: 'Autogreen', model: 'Smart Chaser SC1', size: '195/55 R15', stock: '1 un', price: 281.00, details: 'Direção esportiva precisa e excelente estabilidade em curvas.' },
  { code: 'PNEU-1715', brand: 'Continental', model: 'VanContact AP', size: '205/75 R16', stock: '4 un', price: 1096.00, details: 'Pneu premium de carga para utilitários, máxima resistência e durabilidade.' },
  { code: 'PNEU-1802', brand: 'Continental', model: 'PowerContact 2', size: '195/55 R15', stock: '2 un', price: 507.00, details: 'Rodagem suave, alta quilometragem e economia de combustível.' },
  { code: 'PNEU-1880', brand: 'Zmax', model: 'Vanmejor C30', size: '205/75 R16', stock: '4 un', price: 512.00, details: 'Desenvolvido para utilitários comerciais, oferecendo robustez no transporte.' },
  { code: 'PNEU-1884', brand: 'Maxtrek', model: 'Maximus M2', size: '205/65 R15', stock: '4 un', price: 356.00, details: 'Excelente conforto acústico e ótimo desempenho em frenagens.' },
  { code: 'PNEU-1892', brand: 'General Tire', model: 'Altimax One S', size: '205/55 R16', stock: '3 un', price: 481.00, details: 'Desenho de banda de rodagem esportivo, oferecendo controle excelente.' },
  { code: 'PNEU-1898', brand: 'Barum', model: 'Bravuris 5 HM (Conti)', size: '225/50 R17', stock: '13 un', price: 578.00, details: 'Banda HM (High Mileage) focada em rodagem extra longa e conforto.' },
  { code: 'PNEU-2120', brand: 'Lanvigator', model: 'CatchFors A/T', size: '235/75 R15', stock: '2 un', price: 641.00, details: 'Excelente pneu para SUV e pick-ups, ótima tração off-road.' },
  { code: 'PNEU-2286', brand: 'Maxtrek', model: 'Maximus M1', size: '205/55 R16', stock: '10 un', price: 379.00, details: 'Ótimo custo-benefício, rodagem macia e estável para o dia a dia.' },
  { code: 'PNEU-2324', brand: 'Zmax', model: 'Vanmejor C30', size: '195 R14', stock: '2 un', price: 432.00, details: 'Pneu comercial de 8 lonas, alta capacidade de peso.' },
  { code: 'PNEU-2519', brand: 'Roadtrack', model: 'Terrena AS', size: '175/65 R14', stock: '25 un', price: 319.00, details: 'Pneu versátil all-season, ótima durabilidade para carros de passeio.' },
  { code: 'PNEU-2582', brand: 'Luistone', model: 'DK728', size: '235/60 R16', stock: '2 un', price: 550.00, details: 'Alto conforto de rodagem e excelente aderência.' },
  { code: 'PNEU-2634', brand: 'Barum', model: 'Bravuris 5', size: '185/60 R15', stock: '2 un', price: 481.00, details: 'Conforto acústico superior e ótima durabilidade.' },
  { code: 'PNEU-2663', brand: 'XBri', model: 'Forza F2 A/T', size: '175/80 R14', stock: '4 un', price: 445.00, details: 'Pneu todo-terreno Xbri, carcaça reforçada contra impactos.' },
  { code: 'PNEU-2672', brand: 'Maxtrek', model: 'Sierra S6', size: '235/70 R16', stock: '4 un', price: 593.00, details: 'SUV de alta performance, excelente estabilidade lateral.' },
  { code: 'PNEU-2759', brand: 'Roadtrack', model: 'Terrena AS', size: '185/65 R14', stock: '10 un', price: 313.00, details: 'Pneu de passeio confortável de longa durabilidade.' },
  { code: 'PNEU-3092', brand: 'Barum', model: 'Bravuris (Conti)', size: '185/65 R15', stock: '4 un', price: 433.00, details: 'Excelente escoamento de água e frenagem segura sob chuva.' },
  { code: 'PNEU-3111', brand: 'XBri', model: 'Brutus T/A 6PR', size: '31X10.50 R15', stock: '4 un', price: 1166.00, details: 'Pneu lameiro fora de estrada de visual agressivo e tração extrema.' },
  { code: 'PNEU-3179', brand: 'Barum', model: 'Bravuris 5 HM', size: '205/60 R15', stock: '9 un', price: 476.00, details: 'Combinação ideal de alta quilometragem e economia.' },
  { code: 'PNEU-3231', brand: 'BlackArrow', model: 'SP01', size: '185/65 R14', stock: '9 un', price: 308.00, details: 'Pneu comercial leve de ótimo rendimento e frenagem segura.' },
  { code: 'PNEU-3251', brand: 'XBri', model: 'Brutus A/T', size: '265/70 R16', stock: '4 un', price: 1244.00, details: 'Excelente durabilidade em condições severas de uso misto.' },
  { code: 'PNEU-3335', brand: 'Continental', model: 'PowerContact 2', size: '215/60 R16', stock: '4 un', price: 722.00, details: 'Economia e resistência de alto nível para carros compactos.' },
  { code: 'PNEU-3398', brand: 'Continental', model: 'VanContact AP', size: '225/70 R15', stock: '4 un', price: 1171.00, details: 'Reforço lateral de borracha contra calçadas.' },
  { code: 'PNEU-3403', brand: 'Roadstone', model: 'Roadian HT', size: '265/65 R17', stock: '1 un', price: 892.00, details: 'Conforto e estabilidade de rodagem excepcionais para SUVs.' },
  { code: 'PNEU-3422', brand: 'BlackArrow', model: 'AT02', size: '205/60 R15', stock: '8 un', price: 432.00, details: 'Excelente tração e frenagem sob chuva, com rodagem silenciosa.' },
  { code: 'PNEU-3468', brand: 'Aplus', model: 'A610', size: '205/50 R16', stock: '2 un', price: 471.00, details: 'Pneu esportivo de alta aderência lateral e estabilidade.' },
  { code: 'PNEU-3469', brand: 'Maxtrek', model: 'Maximus M2', size: '205/65 R16', stock: '8 un', price: 480.00, details: 'Excelente dirigibilidade e baixo ruído na estrada.' },
  { code: 'PNEU-3508', brand: 'Barum', model: 'Bravuris 4x4', size: '225/55 R18', stock: '2 un', price: 794.00, details: 'Excelente tração off-road leve, segurança em curvas.' },
  { code: 'PNEU-3540', brand: 'Continental', model: 'PowerContact 2', size: '185/55 R16', stock: '4 un', price: 658.00, details: 'Tecnologia alemã de alta quilometragem e economia.' },
  { code: 'PNEU-3602', brand: 'Maxzez', model: 'PeakGrip AT', size: '215/65 R16', stock: '2 un', price: 470.00, details: 'Todo-terreno robusto para SUVs compactos.' },
  { code: 'PNEU-3628', brand: 'Aplus', model: 'All Terrain A929', size: '265/65 R17', stock: '1 un', price: 878.00, details: 'Banda de rodagem agressiva autolimpante contra lama.' },
  { code: 'PNEU-3818', brand: 'Maxtrek', model: 'Maximus M1', size: '205/60 R16', stock: '1 un', price: 384.00, details: 'Pneu confiável de passeio com ótimo custo-benefício.' },
  { code: 'PNEU-3850', brand: 'Maxtrek', model: 'Maximus M1', size: '195/55 R16', stock: '17 un', price: 323.00, details: 'Excelente tração e durabilidade com ótimo custo-benefício.' },
  { code: 'PNEU-3913', brand: 'Barum', model: 'Bravuris 5 (Conti)', size: '225/45 R17', stock: '6 un', price: 548.00, details: 'Pneu reforçado XL, excelente aderência sob alta velocidade.' },
  { code: 'PNEU-3965', brand: 'Speedmax', model: 'WildWolf W01', size: '265/60 R18', stock: '4 un', price: 941.00, details: 'Pneu A/T de desenho robusto, alta tração em terrenos mistos.' },
  { code: 'PNEU-4003', brand: 'Aplus', model: 'A609', size: '185/65 R15', stock: '4 un', price: 283.00, details: 'Pneu de passeio macio, silencioso e muito econômico.' },
  { code: 'PNEU-4039', brand: 'Roadtrack', model: 'Terrena AS', size: '165/70 R14', stock: '4 un', price: 307.00, details: 'Desempenho estável no trânsito urbano.' },
  { code: 'PNEU-4156', brand: 'Dovroad', model: 'Zyphira', size: '205/55 R16', stock: '6 un', price: 328.00, details: 'Excelente custo-benefício com ótima tração.' },
  { code: 'PNEU-4309', brand: 'General Tire', model: 'Altimax One (Conti)', size: '185/60 R15', stock: '8 un', price: 416.00, details: 'Design inteligente de banda que sinaliza desgaste.' },
  { code: 'PNEU-4374', brand: 'Maxtrek', model: 'Maximus M2', size: '205/55 R16', stock: '1 un', price: 379.00, details: 'Pneu estável para o dia a dia, excelente escoamento de água.' },
  { code: 'PNEU-4406', brand: 'Sunset', model: 'Over Cargo R', size: '195/75 R16', stock: '3 un', price: 557.00, details: 'Resistência extra contra furos em utilitários.' },
  { code: 'PNEU-4415', brand: 'Onyx', model: 'NY-806', size: '185/65 R15', stock: '1 un', price: 334.00, details: 'Rodar macio e silencioso com ótima aderência.' },
  { code: 'PNEU-4421', brand: 'General Tire', model: 'Altimax One S', size: '195/55 R15', stock: '10 un', price: 433.00, details: 'Banda assimétrica que fornece excelente resposta direcional.' },
  { code: 'PNEU-4438', brand: 'Delmax', model: 'UltimaPro UPI', size: '195/60 R15', stock: '2 un', price: 301.00, details: 'Excelente aderência lateral sob chuva.' },
  { code: 'PNEU-4523', brand: 'Forward', model: 'Barbrian', size: '175/75 R13', stock: '4 un', price: 269.00, details: 'Pneu clássico reforçado com excelente estabilidade.' },
  { code: 'PNEU-4561', brand: 'Maxtrek', model: 'Sierra S6', size: '255/55 R19', stock: '2 un', price: 682.00, details: 'SUV premium de alta performance.' },
  { code: 'PNEU-4650', brand: 'Nexen', model: 'N\'Blue Eco SH01', size: '215/65 R16', stock: '1 un', price: 743.00, details: 'Reduz o consumo com menor resistência ao rolamento.' },
  { code: 'PNEU-4676', brand: 'Comforser', model: 'CF1100 A/T OWL', size: '215/75 R15', stock: '4 un', price: 579.00, details: 'Escrita branca na lateral (OWL). Excelente tração off-road.' },
  { code: 'PNEU-4725', brand: 'Aplus', model: 'A919', size: '265/70 R16', stock: '2 un', price: 851.00, details: 'SUV de rodagem suave, excelente frenagem sob chuva.' },
  { code: 'PNEU-4731', brand: 'Roadtrack', model: 'Terrena AS', size: '185/70 R14', stock: '2 un', price: 326.00, details: 'Pneu durável e macio para rodagem diária.' },
  { code: 'PNEU-4779', brand: 'Maxtrek', model: 'Sierra S6', size: '235/55 R18', stock: '4 un', price: 628.00, details: 'Pneu moderno para SUV, excelente aderência sob chuva.' },
  { code: 'PNEU-4880', brand: 'Maxtrek', model: 'Maximus M1', size: '215/45 R18', stock: '2 un', price: 480.00, details: 'Perfil esportivo de alta aderência lateral.' },
  { code: 'PNEU-4892', brand: 'Dovroad', model: 'Urban Primor', size: '265/65 R17', stock: '12 un', price: 684.00, details: 'Para SUVs de grande porte, alto conforto de rodagem.' },
  { code: 'PNEU-5042', brand: 'BlackArrow', model: 'AT02', size: '205/60 R16', stock: '8 un', price: 488.00, details: 'Misto A/T de alta estabilidade em asfalto e terra.' },
  { code: 'PNEU-5050', brand: 'General Tire', model: 'Altimax One (Conti)', size: '175/65 R14', stock: '4 un', price: 359.00, details: 'Pneu seguro de excelente custo-benefício.' },
  { code: 'PNEU-5127', brand: 'Maxtrek', model: 'Maximus M2', size: '225/45 R17', stock: '4 un', price: 435.00, details: 'UHP perfil baixo esportivo de alta performance.' },
  { code: 'PNEU-5145', brand: 'Comforser', model: 'CF1000 A/T', size: '235/70 R16', stock: '2 un', price: 672.00, details: 'Pneu todo-terreno clássico, excelente custo-benefício off-road.' },
  { code: 'PNEU-5166', brand: 'Barum', model: 'Eurovan 2', size: '225/70 R15', stock: '4 un', price: 1101.00, details: 'Estrutura reforçada de carga com alta resistência.' },
  { code: 'PNEU-5360', brand: 'Haida', model: 'HD927', size: '225/45 R18', stock: '1 un', price: 616.00, details: 'Pneu esportivo de ultra-alta performance.' },
  { code: 'PNEU-5425', brand: 'General Tire', model: 'Altimax One (Conti)', size: '185/65 R14', stock: '13 un', price: 414.00, details: 'Excelente durabilidade, rodagem macia e frenagem segura.' },
  { code: 'PNEU-5457', brand: 'Aplus', model: 'Comfort HP', size: '185/70 R14', stock: '1 un', price: 369.00, details: 'Rodar silencioso e confortável de passeio.' },
  { code: 'PNEU-5463', brand: 'BlackArrow', model: 'Tire 215/55', size: '215/55 R17', stock: '2 un', price: 461.00, details: 'Conforto e estabilidade de rodagem para sedans médios.' },
  { code: 'PNEU-5523', brand: 'Doublestar', model: 'WildWolf W01', size: '265/60 R18', stock: '4 un', price: 891.00, details: 'Pneu misto (A/T) com ombros reforçados.' },
  { code: 'PNEU-5526', brand: 'General Tire', model: 'Grabber GT Plus', size: '225/65 R17', stock: '2 un', price: 743.00, details: 'SUV de alta performance, aderência extraordinária.' },
  { code: 'PNEU-5601', brand: 'Maxtrek', model: 'Maximus M1', size: '185/55 R15', stock: '4 un', price: 284.00, details: 'Ótima resposta de frenagem e rodagem confortável.' },
  { code: 'PNEU-5723', brand: 'Zmax', model: 'Vanmejor C30', size: '185 R14', stock: '1 un', price: 419.00, details: 'Pneu reforçado para utilitários leves.' },
  { code: 'PNEU-5741', brand: 'Continental', model: 'PowerContact 2', size: '185/70 R14', stock: '2 un', price: 571.00, details: 'Quilometragem extra longa e excelente estabilidade.' },
  { code: 'PNEU-5775', brand: 'Maxtrek', model: 'Mud Trac M/T', size: '31X10.50 R15', stock: '2 un', price: 932.00, details: 'Pneu M/T para lama extrema, desenho autolimpante.' },
  { code: 'PNEU-5848', brand: 'Maxtrek', model: 'Maximus M2', size: '215/55 R17', stock: '2 un', price: 444.00, details: 'Conforto e estabilidade de rodagem para sedans e SUVs.' },
  { code: 'PNEU-5878', brand: 'XBri', model: 'CargoPlus W1', size: '225/65 R16', stock: '24 un', price: 642.00, details: 'Utilitário de alta resistência de carga.' },
  { code: 'PNEU-6003', brand: 'Continental', model: 'PowerContact 2 (Conti)', size: '175/70 R14', stock: '3 un', price: 471.00, details: 'Economia e resistência de alto nível para carros compactos.' },
  { code: 'PNEU-6110', brand: 'XBri', model: 'Brutus A/T 8PR', size: '245/70 R16', stock: '4 un', price: 1126.00, details: 'Pneu reforçado de 8 lonas de alta durabilidade.' },
  { code: 'PNEU-6147', brand: 'Barum', model: 'Bravuris 5 (Conti)', size: '165/70 R14', stock: '7 un', price: 364.00, details: 'Conforto e estabilidade de rodagem para compactos.' },
  { code: 'PNEU-6200', brand: 'Comforser', model: 'CF1000 A/T OWL', size: '245/70 R16', stock: '4 un', price: 667.00, details: 'Pneu misto clássico com escrita branca.' },
  { code: 'PNEU-6234', brand: 'Maxtrek', model: 'Maximus M1', size: '195/50 R16', stock: '1 un', price: 372.00, details: 'Perfil esportivo de alta aderência lateral.' },
  { code: 'PNEU-6241', brand: 'Barum', model: 'Bravuris 5 HM', size: '195/60 R15', stock: '10 un', price: 446.00, details: 'Focado em rodagem extra longa e economia.' },
  { code: 'PNEU-6307', brand: 'Linglong', model: 'Crosswind A/T XL', size: '225/65 R17', stock: '4 un', price: 634.00, details: 'Reforçado para carga extra, tração versátil off-road.' },
  { code: 'PNEU-6415', brand: 'Linglong', model: 'Crosswind A/T', size: '205/65 R15', stock: '1 un', price: 448.00, details: 'Tração confiável em asfalto e terra.' },
  { code: 'PNEU-6420', brand: 'Continental', model: 'UltraContact', size: '195/65 R15', stock: '4 un', price: 610.00, details: 'Quilometragem ultra-elevada, aderência e segurança.' },
  { code: 'PNEU-6440', brand: 'BlackArrow', model: 'P16', size: '215/45 R17', stock: '4 un', price: 387.00, details: 'Esportivo UHP de excelente resposta de direção.' },
  { code: 'PNEU-6550', brand: 'Continental', model: 'ContiPremiumContact 5', size: '185/65 R15', stock: '2 un', price: 594.00, details: 'Aderência perfeita em qualquer condição climática.' },
  { code: 'PNEU-6629', brand: 'Continental', model: 'ContiCrossContact LX2', size: '245/70 R16', stock: '1 un', price: 1064.00, details: 'Segurança extrema em estradas e off-road leve.' },
  { code: 'PNEU-6694', brand: 'Barum', model: 'Bravuris A/T', size: '265/60 R18', stock: '4 un', price: 1091.00, details: 'Misto SUV e caminhonetes, durabilidade e aderência.' },
  { code: 'PNEU-6715', brand: 'Continental', model: 'PowerContact 2', size: '185/60 R15', stock: '4 un', price: 574.00, details: 'Desenvolvido para estradas brasileiras, grande resistência.' },
  { code: 'PNEU-6746', brand: 'Barum', model: 'Eurovan 2', size: '215/75 R16', stock: '4 un', price: 1311.00, details: 'Reforçado para vans comerciais de carga.' },
  { code: 'PNEU-6798', brand: 'Maxtrek', model: 'Maximus M1', size: '185/55 R16', stock: '4 un', price: 351.00, details: 'Excelente rodagem estável diária para compactos.' },
  { code: 'PNEU-6959', brand: 'Dovroad', model: 'Zyphira', size: '215/65 R16', stock: '4 un', price: 444.00, details: 'Ótima estabilidade e tração para SUVs de passeio.' },
  { code: 'PNEU-6973', brand: 'Continental', model: 'ContiCrossContact LX2', size: '265/60 R18', stock: '2 un', price: 1106.00, details: 'Pneu premium de caminhonete com protetor de roda.' },
  { code: 'PNEU-6989', brand: 'Kumho', model: 'Crugen HP71', size: '235/50 R19', stock: '2 un', price: 1268.00, details: 'Pneu de ultra performance para SUVs premium, silêncio.' },
  { code: 'PNEU-6997', brand: 'Continental', model: 'UltraContact', size: '185/60 R15', stock: '3 un', price: 586.00, details: 'Frenagem perfeita e extrema resistência a rodagem.' },
  { code: 'PNEU-7010', brand: 'Maxtrek', model: 'SU-800 A/T OWL', size: '235/70 R16', stock: '1 un', price: 652.00, details: 'Desenho agressivo de uso misto com escrita branca.' },
  { code: 'PNEU-7069', brand: 'Continental', model: 'PowerContact 2', size: '205/55 R16', stock: '4 un', price: 533.00, details: 'Excelente dirigibilidade e segurança na chuva.' },
  { code: 'PNEU-7374', brand: 'Maxtrek', model: 'Maximus M1', size: '195/60 R15', stock: '32 un', price: 288.00, details: 'Durabilidade excepcional de passeio com excelente preço.' },
  { code: 'PNEU-7447', brand: 'Barum', model: 'Bravuris AT', size: '235/75 R15', stock: '10 un', price: 890.00, details: 'All-Terrain versátil, reforçado contra furos.' },
  { code: 'PNEU-7498', brand: 'Zmax', model: 'Vanmejor C30', size: '195/75 R16', stock: '3 un', price: 523.00, details: 'Pneu utilitário de excelente escoamento.' },
  { code: 'PNEU-7510', brand: 'Comforser', model: 'CF1100 A/T OWL', size: '225/65 R17', stock: '2 un', price: 675.00, details: 'Pneu misto off-road A/T de visual esportivo.' },
  { code: 'PNEU-7533', brand: 'Maxtrek', model: 'Maximus M2', size: '225/55 R17', stock: '4 un', price: 439.00, details: 'Rodagem muito confortável com excelente frenagem.' },
  { code: 'PNEU-7624', brand: 'Continental', model: 'UltraContact', size: '175/70 R14', stock: '4 un', price: 548.00, details: 'Quilometragem extra longa e excelente segurança.' },
  { code: 'PNEU-7642', brand: 'General Tire', model: 'Altimax One S', size: '225/50 R17', stock: '15 un', price: 576.00, details: 'Reforçado XL, ótima resposta em altas velocidades.' },
  { code: 'PNEU-7746', brand: 'Comforser', model: 'CF1100 A/T', size: '265/75 R16', stock: '1 un', price: 1248.00, details: 'Super reforçado, feito para terrenos extremos de carga.' },
  { code: 'PNEU-7749', brand: 'Linglong', model: 'AR200 XL', size: '195/45 R17', stock: '4 un', price: 389.00, details: 'Esportivo de perfil baixo e aderência superior.' },
  { code: 'PNEU-7789', brand: 'General Tire', model: 'Altimax One', size: '205/65 R15', stock: '1 un', price: 570.00, details: 'Excelente durabilidade e rodagem silenciosa.' },
  { code: 'PNEU-7793', brand: 'Austone', model: 'SP-801 Athenas', size: '205/70 R15', stock: '4 un', price: 375.00, details: 'Excelente tração e frenagem sob chuva.' },
  { code: 'PNEU-7850', brand: 'Maxtrek', model: 'Sierra S6', size: '225/55 R18', stock: '4 un', price: 547.00, details: 'Pneu moderno de alta estabilidade em retas e curvas.' },
  { code: 'PNEU-7913', brand: 'Roadtrack', model: 'Terrena AS', size: '175/70 R13', stock: '11 un', price: 296.00, details: 'Pneu durável e econômico para compactos.' },
  { code: 'PNEU-7937', brand: 'Maxtrek', model: 'Maximus M1', size: '195/65 R15', stock: '17 un', price: 294.00, details: 'Conforto e estabilidade de rodagem.' },
  { code: 'PNEU-8050', brand: 'Aptany', model: 'RA301 XL', size: '225/50 R17', stock: '4 un', price: 523.00, details: 'UHP esportivo com excelente custo-benefício.' },
  { code: 'PNEU-8098', brand: 'Comforser', model: 'CF1100 A/T', size: '265/65 R18', stock: '4 un', price: 1286.00, details: 'Pneu todo-terreno agressivo para SUVs grandes.' },
  { code: 'PNEU-8102', brand: 'Continental', model: 'PowerContact 2 (Conti)', size: '195/60 R15', stock: '6 un', price: 501.00, details: 'Economia e resistência de alto nível.' },
  { code: 'PNEU-8142', brand: 'Maxtrek', model: 'Maximus M1', size: '205/50 R17', stock: '3 un', price: 415.00, details: 'Estabilidade em alta velocidade e frenagem eficiente.' },
  { code: 'PNEU-8179', brand: 'Continental', model: 'UltraContact', size: '195/55 R16', stock: '1 un', price: 667.00, details: 'Durabilidade excepcional e rodagem confortável.' },
  { code: 'PNEU-8257', brand: 'Autogreen', model: 'Smart Chaser SC1', size: '185/65 R15', stock: '10 un', price: 283.00, details: 'Excelente escoamento de água e frenagem precisa.' },
  { code: 'PNEU-8290', brand: 'Barum', model: 'Bravuris 4x4', size: '205/60 R16', stock: '1 un', price: 584.00, details: 'Uso misto SUV leve, oferecendo ótima tração.' },
  { code: 'PNEU-8318', brand: 'Maxtrek', model: 'SU-800 A/T OWL', size: '225/70 R16', stock: '2 un', price: 729.00, details: 'Visual clássico off-road com letras brancas.' },
  { code: 'PNEU-8365', brand: 'Maxtrek', model: 'Maximus M1', size: '185/60 R14', stock: '6 un', price: 259.00, details: 'Pneu compacto de passeio com excelente custo-benefício.' },
  { code: 'PNEU-8374', brand: 'Sunset', model: 'Over Cargo B3', size: '225/75 R16', stock: '2 un', price: 703.00, details: 'Feito para utilitários de carga média.' },
  { code: 'PNEU-8433', brand: 'Barum', model: 'Bravuris 5 HM', size: '205/55 R16', stock: '3 un', price: 477.00, details: 'Conforto e estabilidade de rodagem.' },
  { code: 'PNEU-8486', brand: 'Aplus', model: 'Comfort HP', size: '175/70 R14', stock: '1 un', price: 339.00, details: 'Pneu de rodagem estável e segura.' },
  { code: 'PNEU-8552', brand: 'Maxtrek', model: 'Maximus M1', size: '195/50 R15', stock: '2 un', price: 294.00, details: 'Aderência esportiva superior e durabilidade.' },
  { code: 'PNEU-8556', brand: 'Maxtrek', model: 'Sierra S6', size: '225/60 R17', stock: '8 un', price: 481.00, details: 'SUV de rodagem suave, excelente aderência.' },
  { code: 'PNEU-8663', brand: 'Maxtrek', model: 'SU-800 A/T', size: '265/65 R17', stock: '1 un', price: 725.00, details: 'Pneu misto (A/T) robusto para pick-ups.' },
  { code: 'PNEU-8763', brand: 'Barum', model: 'Bravuris 5 HM (Conti)', size: '195/55 R15', stock: '14 un', price: 437.00, details: 'Banda HM (High Mileage) focada em rodagem extra longa.' },
  { code: 'PNEU-8784', brand: 'Maxtrek', model: 'SU-800 A/T', size: '215/75 R15', stock: '4 un', price: 664.00, details: 'Ótima estabilidade e escoamento de água.' },
  { code: 'PNEU-8909', brand: 'Continental', model: 'ContiCrossContact LX2', size: '265/70 R16', stock: '2 un', price: 1167.00, details: 'Segurança extrema em estradas e terra, alto conforto.' },
  { code: 'PNEU-8918', brand: 'Linglong', model: 'Radial 666', size: '225/75 R16', stock: '1 un', price: 628.00, details: 'Utilitário leve, resistência extra a furos.' },
  { code: 'PNEU-8944', brand: 'Maxtrek', model: 'Sierra S6', size: '265/60 R18', stock: '12 un', price: 756.00, details: 'SUV de alta performance, excelente aderência.' },
  { code: 'PNEU-9042', brand: 'Continental', model: 'PowerContact 2 (Conti)', size: '185/65 R15', stock: '9 un', price: 528.00, details: 'Economia e durabilidade extrema.' },
  { code: 'PNEU-9056', brand: 'Continental', model: 'UltraContact (Conti)', size: '205/60 R16', stock: '11 un', price: 627.00, details: 'Tecnologia alemã focada em durabilidade excepcional.' },
  { code: 'PNEU-9070', brand: 'Maxtrek', model: 'Sierra S6', size: '245/70 R16', stock: '4 un', price: 619.00, details: 'SUV de rodagem suave e silenciosa.' },
  { code: 'PNEU-9144', brand: 'Maxtrek', model: 'Maximus M1', size: '185/60 R15', stock: '16 un', price: 269.00, details: 'Excelente dirigibilidade no dia a dia com conforto.' },
  { code: 'PNEU-9150', brand: 'Maxtrek', model: 'SU-800 A/T', size: '265/70 R17', stock: '6 un', price: 829.00, details: 'Pneu todo-terreno de grande durabilidade e tração.' },
  { code: 'PNEU-9208', brand: 'Zmax', model: 'Vanmejor C30', size: '225/70 R15', stock: '2 un', price: 484.00, details: 'Estrutura reforçada de carga com alta resistência.' },
  { code: 'PNEU-9227', brand: 'XBri', model: 'Brutus T/A', size: '205/60 R16', stock: '1 un', price: 726.00, details: 'Pneu lameiro agressivo de alta tração off-road.' },
  { code: 'PNEU-9268', brand: 'Sunset', model: 'Enzo G1', size: '235/60 R16', stock: '2 un', price: 511.00, details: 'Conforto e estabilidade de rodagem.' },
  { code: 'PNEU-9292', brand: 'Zmax', model: 'Gallopro H/T', size: '265/70 R16', stock: '4 un', price: 672.00, details: 'Direção macia para SUV em asfalto.' },
  { code: 'PNEU-9294', brand: 'Maxtrek', model: 'Maximus M2', size: '225/50 R17', stock: '5 un', price: 507.00, details: 'Alto conforto acústico e ótimo desempenho.' },
  { code: 'PNEU-9318', brand: 'Maxtrek', model: 'Maximus M1', size: '175/70 R14', stock: '28 un', price: 327.00, details: 'Excelente durabilidade urbana para carros populares.' },
  { code: 'PNEU-9319', brand: 'Continental', model: 'UltraContact', size: '185/70 R14', stock: '5 un', price: 561.00, details: 'Quilometragem extra longa e excelente segurança.' },
  { code: 'PNEU-9359', brand: 'Gridmaster', model: 'G-Push', size: '205/40 R17', stock: '4 un', price: 410.00, details: 'Perfil esportivo UHP de alta performance.' },
  { code: 'PNEU-9405', brand: 'Maxtrek', model: 'Sierra S6', size: '225/60 R18', stock: '8 un', price: 576.00, details: 'SUV de rodagem silenciosa, excelente estabilidade.' },
  { code: 'PNEU-9449', brand: 'General Tire', model: 'Altimax One', size: '175/70 R14', stock: '2 un', price: 391.00, details: 'Design inteligente de banda que sinaliza desgaste.' },
  { code: 'PNEU-9512', brand: 'Maxtrek', model: 'SU-800 A/T', size: '265/70 R16', stock: '13 un', price: 768.00, details: 'Todo-terreno robusto com escrita branca.' },
  { code: 'PNEU-9532', brand: 'Forceland', model: 'Vitality H/T', size: '265/70 R16', stock: '6 un', price: 785.00, details: 'Conforto e estabilidade de rodagem para SUVs grandes.' },
  { code: 'PNEU-9706', brand: 'Barum', model: 'Bravuris 5 HM', size: '175/70 R13', stock: '3 un', price: 361.00, details: 'Focado em rodagem extra longa e excelente economia.' },
  { code: 'PNEU-9724', brand: 'BlackArrow', model: 'SP01', size: '175/65 R14', stock: '1 un', price: 308.00, details: 'Comercial leve de carga com ótima durabilidade.' },
  { code: 'PNEU-9744', brand: 'General Tire', model: 'Altimax One', size: '195/60 R15', stock: '2 un', price: 518.00, details: 'Frenagem perfeita e estabilidade superior.' },
  { code: 'PNEU-9787', brand: 'Dunlop', model: 'Grandtrek AT20', size: '225/70 R17', stock: '6 un', price: 1043.00, details: 'Misto SUV e utilitário, excelente robustez.' },
  { code: 'PNEU-9892', brand: 'Barum', model: 'Bravuris 5 HM (Conti)', size: '195/65 R15', stock: '9 un', price: 467.00, details: 'Banda HM (High Mileage) focada em rodagem extra longa.' },
  { code: 'PNEU-9918', brand: 'General Tire', model: 'Altimax One', size: '185/60 R14', stock: '5 un', price: 401.00, details: 'Excelente durabilidade e aderência sob chuva.' },
  { code: 'PNEU-9942', brand: 'Maxtrek', model: 'Maximus M1', size: '205/60 R15', stock: '6 un', price: 372.00, details: 'Excelente rodagem estável diária para passeio.' }
];

// Dynamic API Integration with Local Offline Fallback
let tiresData = tiresDatabase;
const API_URL = 'https://central-autocar-site.onrender.com';

async function fetchTiresFromBackend() {
  try {
    // Try to load fresh data from Render backend (defaulting to localhost in dev if needed)
    const url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001'
      : API_URL;
      
    const response = await fetch(`${url}/api/tires`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        tiresData = data;
        console.log(`[API] ${data.length} pneus carregados com sucesso do backend Render!`);
      }
    }
  } catch (error) {
    console.warn('[API] Falha ao conectar ao backend Render. Usando banco de dados local com sucesso:', error);
  }
}

// Init API Load
fetchTiresFromBackend();

const searchInput = document.getElementById('tireSearchInput');
const clearBtn = document.getElementById('clearSearchBtn');
const resultsDropdown = document.getElementById('resultsDropdown');
const searchTriggerBtn = document.getElementById('searchTriggerBtn');

/**
 * Searches and renders tire cards based on query input (space-insensitive)
 */
function performSearch() {
  const query = searchInput.value.toLowerCase().trim().replace(/[\s\/-]/g, '');
  
  if (query === '') {
    clearBtn.classList.add('hidden');
    resultsDropdown.classList.add('hidden');
    return;
  }
  
  clearBtn.classList.remove('hidden');
  
  // Filter tires matching query in size, brand, model or code (stripped of slashes, dashes, spaces)
  const matches = tiresData.filter(tire => {
    const cleanSize = tire.size.toLowerCase().replace(/[\s\/-]/g, '');
    const cleanBrand = tire.brand.toLowerCase();
    const cleanModel = tire.model.toLowerCase();
    const cleanCode = tire.code.toLowerCase();
    
    return cleanSize.includes(query) ||
           cleanBrand.includes(query) ||
           cleanModel.includes(query) ||
           cleanCode.includes(query);
  });

  renderResults(matches);
}

/**
 * Renders results to the dropdown container
 */
function renderResults(results) {
  resultsDropdown.innerHTML = '';
  
  if (results.length === 0) {
    resultsDropdown.innerHTML = `
      <div class="p-6 text-center text-zinc-500">
        <i data-lucide="info" class="w-8 h-8 mx-auto mb-2 text-zinc-700"></i>
        <p class="text-sm font-bold">Nenhuma medida ou marca encontrada.</p>
        <p class="text-xs mt-1">Podemos encomendar para você! Clique no botão abaixo para nos enviar uma mensagem direta.</p>
        <a 
          href="#" onclick="openSecureWA(event, ['55','73','99174','1441'], 'Olá! Não encontrei a medida de pneu que procuro no site. Gostaria de verificar a disponibilidade.')" target="_self"
          target="_blank"
          class="mt-4 inline-flex items-center gap-2 bg-black text-brand-green font-extrabold text-xs py-2.5 px-6 rounded-full transition-transform duration-300 hover:scale-105 shadow-md hover:bg-zinc-900"
        >
          <i data-lucide="message-circle" class="w-4 h-4 text-brand-green"></i>
          <span>Falar com Atendente</span>
        </a>
      </div>
    `;
    lucide.createIcons();
    resultsDropdown.classList.remove('hidden');
    return;
  }

  // Generate cards
  results.forEach(tire => {
    // Format price display
    const priceDisplay = (tire.price && !isNaN(tire.price)) 
      ? `R$ ${tire.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'Sob Consulta';
      
    const priceMsg = (tire.price && !isNaN(tire.price)) 
      ? ` por ${priceDisplay}` 
      : '';
      
    // Create WhatsApp pre-defined URL
    const message = `Olá Central Autocenter! Vi no site o pneu [Código: ${tire.code}] na medida ${tire.size}, modelo ${tire.model}${priceMsg}. Gostaria de consultar a disponibilidade para instalação.`;
    const whatsappUrl = `https://wa.me/${['55','73','99174','1441'].join('')}?text=${encodeURIComponent(message)}`;

    const card = document.createElement('a');
    card.href = whatsappUrl;
    card.target = '_blank';
    card.className = 'flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/[0.01] border border-black/5 hover:border-zinc-400 hover:bg-black/[0.03] transition-all duration-300 group cursor-pointer text-left block';
    
    card.innerHTML = `
      <div class="flex-1 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-[10px] uppercase font-black text-white bg-black px-2 py-0.5 rounded-md tracking-wider shadow-sm">${tire.code}</span>
          <span class="text-xs uppercase font-extrabold text-zinc-800 tracking-wider">${tire.brand}</span>
          <span class="text-[10px] uppercase font-bold text-zinc-600 px-2 py-0.5 rounded-full bg-black/5 border border-black/5">${tire.stock} em estoque</span>
        </div>
        <h4 class="text-base font-extrabold text-zinc-900 group-hover:text-black transition-colors">
          ${tire.model} — <span class="text-zinc-800 font-mono font-bold">${tire.size}</span>
        </h4>
        <p class="text-xs text-zinc-600 font-medium leading-relaxed">${tire.details}</p>
        
        <!-- Real Price Display -->
        <div class="pt-1 flex items-baseline gap-1.5">
          <span class="text-[10px] text-zinc-500 font-bold uppercase">Preço unitário:</span>
          <span class="text-sm md:text-base font-black text-black">${priceDisplay}</span>
        </div>
      </div>
      <div class="self-end md:self-center">
        <div 
          class="inline-flex items-center justify-center gap-2 bg-black text-brand-green font-black text-xs uppercase tracking-wider py-2.5 px-5 rounded-full transition-all duration-300 group-hover:scale-105 shadow-md hover:bg-zinc-900"
        >
          <i data-lucide="message-circle" class="w-4 h-4 text-brand-green"></i>
          <span>Consultar Preço</span>
        </div>
      </div>
    `;
    
    resultsDropdown.appendChild(card);
  });
  
  // Re-run Lucide to render newly injected icons
  lucide.createIcons();
  resultsDropdown.classList.remove('hidden');
}

// Event Listeners for Search Input
searchInput.addEventListener('input', performSearch);

// Show list when focus is on input (if not empty)
searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim() !== '') {
    resultsDropdown.classList.remove('hidden');
  }
});

// Clear input action
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.add('hidden');
  resultsDropdown.classList.add('hidden');
  searchInput.focus();
});

// Arrow Button Click Trigger
searchTriggerBtn.addEventListener('click', performSearch);

// Quick Tag click handlers
document.querySelectorAll('.quick-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    searchInput.value = tag.innerText;
    performSearch();
    searchInput.focus();
  });
});

// Click outside dropdown to close it
document.addEventListener('click', (e) => {
  const isClickInside = resultsDropdown.contains(e.target) || 
                        searchInput.contains(e.target) || 
                        clearBtn.contains(e.target) || 
                        searchTriggerBtn.contains(e.target) ||
                        e.target.classList.contains('quick-tag');
                        
  if (!isClickInside) {
    resultsDropdown.classList.add('hidden');
  }
});


/* ==========================================================================
   3. BACKGROUND PARTICLES SYSTEM (Soft charcoal/yellow specs floating specs)
   ========================================================================== */
const pCanvas = document.getElementById('particles-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];

function resizeParticles() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
  createParticles();
}

function createParticles() {
  particles = [];
  // Calculate quantity relative to screen size (minimalist density)
  const count = Math.floor((pCanvas.width * pCanvas.height) / 14000);
  for (let i = 0; i < count; i++) {
    // Beautiful luxury colors to overlay over white: grey, soft black, and brand green
    const colors = [
      'rgba(18, 18, 18, 0.08)',    // Soft Charcoal
      'rgba(72, 186, 7, 0.35)',    // Translucent Brand Green
      'rgba(142, 142, 147, 0.1)'   // Light Muted Grey
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particles.push({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      vx: (Math.random() - 0.5) * 0.2, // speed X
      vy: (Math.random() - 0.5) * 0.2, // speed Y
      size: Math.random() * 2.2 + 0.8, // size
      color: color
    });
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary wrapping
    if (p.x < 0) p.x = pCanvas.width;
    if (p.x > pCanvas.width) p.x = 0;
    if (p.y < 0) p.y = pCanvas.height;
    if (p.y > pCanvas.height) p.y = 0;
    
    // Draw
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = p.color;
    pCtx.fill();
  }
  
  requestAnimationFrame(animateParticles);
}

// Initialize particles engine
resizeParticles();
window.addEventListener('resize', resizeParticles);
animateParticles();


/* ==========================================================================
   4. SCROLL NAVIGATION SYSTEM (Início vs Serviços)
   ========================================================================== */
const btnTabInicio = document.getElementById('btnTabInicio');
const btnTabServicos = document.getElementById('btnTabServicos');
const btnTabFiliais = document.getElementById('btnTabFiliais');
const servicosContent = document.getElementById('servicosContent');
const filiaisContent = document.getElementById('filiaisContent');

let isTransitioning = false;
let servicesTimeoutId = null;

// Apply JS transition classes to elements for smooth cross-fading and spatial glides
const transitionStyle = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
if (heroContent) heroContent.style.transition = transitionStyle;
if (servicosContent) servicosContent.style.transition = transitionStyle;
if (filiaisContent) filiaisContent.style.transition = transitionStyle;

function switchTab(tabId) {
  if (currentTab === tabId || isTransitioning) return;
  isTransitioning = true;
  // Firebase: track tab navigation
  if (window.CA_Analytics) window.CA_Analytics.trackTabChange(tabId);
  
  // Clear any pending staggered animations timeout
  if (servicesTimeoutId) {
    clearTimeout(servicesTimeoutId);
    servicesTimeoutId = null;
  }
  
  const tabOrder = ['inicio', 'servicos', 'filiais'];
  const fromIndex = tabOrder.indexOf(currentTab);
  const toIndex = tabOrder.indexOf(tabId);
  const isForward = toIndex > fromIndex;
  
  let activeContent = null;
  if (currentTab === 'inicio') activeContent = heroContent;
  else if (currentTab === 'servicos') activeContent = servicosContent;
  else if (currentTab === 'filiais') activeContent = filiaisContent;

  const targetContent = tabId === 'inicio' ? heroContent : (tabId === 'servicos' ? servicosContent : filiaisContent);
  
  // 1. Slide and Fade out active content (video card rides along as a child of heroContent)
  if (activeContent) {
    activeContent.style.opacity = '0';
    activeContent.style.transform = isForward ? 'translateY(-30px)' : 'translateY(30px)';
  }

  setTimeout(() => {
    // 2. Swap tab content
    currentTab = tabId;
    
    // Hide all tabs first
    if (heroContent) {
      heroContent.classList.add('hidden');
      heroContent.style.opacity = '0';
    }
    if (servicosContent) {
      servicosContent.classList.add('hidden');
      servicosContent.classList.remove('services-active');
      servicosContent.style.opacity = '0';
    }
    if (filiaisContent) {
      filiaisContent.classList.add('hidden');
      filiaisContent.style.opacity = '0';
    }
    
    // Set target start state for slide-in entry
    if (targetContent) {
      targetContent.style.transform = isForward ? 'translateY(30px)' : 'translateY(-30px)';
    }
    
    // Show target tab
    if (tabId === 'inicio') {
      if (heroContent) heroContent.classList.remove('hidden');
      if (video) video.play().catch(e => {});
      // Pause frame animation when leaving services tab
      if (window._frameAnimPaused !== undefined) window._frameAnimPaused = true;
    } else if (tabId === 'servicos') {
      if (servicosContent) servicosContent.classList.remove('hidden');
      if (video) video.pause();
      // Resume frame animation when entering services tab
      if (window._frameAnimPaused !== undefined) window._frameAnimPaused = false;
      if (typeof window._updateFrameFromScroll === 'function') window._updateFrameFromScroll();
    } else if (tabId === 'filiais') {
      if (filiaisContent) filiaisContent.classList.remove('hidden');
      if (video) video.pause();
      if (window._frameAnimPaused !== undefined) window._frameAnimPaused = true;
      // Update interactive icons if needed
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    // Toggle active link styles
    const buttons = [
      { id: 'inicio', element: btnTabInicio },
      { id: 'servicos', element: btnTabServicos },
      { id: 'filiais', element: btnTabFiliais }
    ];
    
    buttons.forEach(btn => {
      if (btn.element) {
        if (btn.id === tabId) {
          btn.element.className = 'text-zinc-950 transition-colors text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider px-2 sm:px-2.5 md:px-4 py-1 sm:py-1.5 rounded-full bg-brand-green';
        } else {
          btn.element.className = 'text-zinc-400 hover:text-white transition-colors text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider px-2 sm:px-2.5 md:px-4 py-1 sm:py-1.5 rounded-full hover:bg-white/10';
        }
      }
    });
    
    // Reset scroll to top
    window.scrollTo(0, 0);
    
    // Force a browser layout reflow to register starting transform
    if (targetContent) void targetContent.offsetWidth;

    // 3. Fade and Slide in target content to center
    setTimeout(() => {
      if (targetContent) {
        targetContent.style.opacity = '1';
        targetContent.style.transform = 'translateY(0)';
      }

      // Trigger staggered card animations
      if (tabId === 'servicos' && servicosContent) {
        // Lazy-load do video da aba (11 MB): so baixa na primeira abertura
        const frameVideo = document.getElementById('frameVideo');
        if (frameVideo && !frameVideo.getAttribute('src') && frameVideo.dataset.src) {
          frameVideo.src = frameVideo.dataset.src;
          frameVideo.load();
          const playPromise = frameVideo.play();
          if (playPromise) playPromise.catch(() => {});
        }
        servicosContent.classList.remove('services-active');
        void servicosContent.offsetWidth; // force reflow
        const isMobileDevice = window.innerWidth < 768;
        const delayDuration = isMobileDevice ? 300 : 4500;
        servicesTimeoutId = setTimeout(() => {
          servicosContent.classList.add('services-active');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, delayDuration);
      }
      
      updateScrollAnimations(0);
      isTransitioning = false;
    }, 50);
    
  }, 450);
}

// Menu item tab switching (same instant hide/show on mobile and desktop,
// so going from one tab to another never requires scrolling through the
// other two tabs' full content first).
if (btnTabInicio && btnTabServicos && btnTabFiliais) {
  btnTabInicio.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('inicio');
  });
  btnTabServicos.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('servicos');
  });
  btnTabFiliais.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('filiais');
  });
}

// Logo click redirects to top (inicio)
const logoBtn = document.querySelector('header nav .group');
if (logoBtn) {
  logoBtn.addEventListener('click', () => switchTab('inicio'));
}

let bottomScrollCount = 0;
let topScrollCount = 0;
let lastScrollTime = 0;

// Reset counters when scrolling away from boundaries
// Also fire the trigger when stuck at bottom during scroll
window.addEventListener('scroll', () => {
  if (currentTab === 'inicio') {
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
    if (!isAtBottom) {
      bottomScrollCount = 0;
    } else {
      incrementScrollTrigger('down');
    }
  } else if (currentTab === 'servicos') {
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
    if (!isAtBottom) {
      bottomScrollCount = 0;
    } else {
      incrementScrollTrigger('down');
    }
    
    const isAtTop = window.scrollY <= 5;
    if (!isAtTop) {
      topScrollCount = 0;
    }
  } else if (currentTab === 'filiais') {
    const isAtTop = window.scrollY <= 5;
    if (!isAtTop) {
      topScrollCount = 0;
    }
  }
});

// Debounced increment function (requires debounced scrolls spaced by at least 300ms)
function incrementScrollTrigger(direction) {
  const now = Date.now();
  if (now - lastScrollTime < 300) return;
  lastScrollTime = now;
  
  if (direction === 'down') {
    bottomScrollCount++;
    if (bottomScrollCount >= 2) {
      bottomScrollCount = 0;
      if (currentTab === 'inicio') {
        switchTab('servicos');
      } else if (currentTab === 'servicos') {
        switchTab('filiais');
      }
    }
  } else if (direction === 'up') {
    topScrollCount++;
    if (topScrollCount >= 2) {
      topScrollCount = 0;
      if (currentTab === 'filiais') {
        switchTab('servicos');
      } else if (currentTab === 'servicos') {
        switchTab('inicio');
      }
    }
  }
}

// Wheel listener: scrolling up at top or down at bottom with debounce threshold
window.addEventListener('wheel', (e) => {
  if (resultsDropdown && !resultsDropdown.classList.contains('hidden') && resultsDropdown.contains(e.target)) {
    return;
  }
  if (currentTab === 'inicio') {
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
    if (isAtBottom && e.deltaY > 0) {
      incrementScrollTrigger('down');
    }
  } else if (currentTab === 'servicos') {
    if (window.scrollY === 0 && e.deltaY < 0) {
      incrementScrollTrigger('up');
    }
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
    if (isAtBottom && e.deltaY > 0) {
      incrementScrollTrigger('down');
    }
  } else if (currentTab === 'filiais') {
    if (window.scrollY === 0 && e.deltaY < 0) {
      incrementScrollTrigger('up');
    }
  }
});

// Touch swipe listener: swiping up at bottom or down at top on mobile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener('touchmove', (e) => {
  if (resultsDropdown && !resultsDropdown.classList.contains('hidden') && resultsDropdown.contains(e.target)) {
    return;
  }
  const touchEndY = e.touches[0].clientY;
  const diffY = touchEndY - touchStartY;
  
  if (currentTab === 'inicio') {
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 15;
    if (isAtBottom && diffY < -40) { // Swiping up moves page down
      incrementScrollTrigger('down');
      touchStartY = touchEndY;
    }
  } else if (currentTab === 'servicos') {
    if (window.scrollY === 0 && diffY > 40) { // Swiping down moves page up
      incrementScrollTrigger('up');
      touchStartY = touchEndY;
    }
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 15;
    if (isAtBottom && diffY < -40) {
      incrementScrollTrigger('down');
      touchStartY = touchEndY;
    }
  } else if (currentTab === 'filiais') {
    if (window.scrollY === 0 && diffY > 40) {
      incrementScrollTrigger('up');
      touchStartY = touchEndY;
    }
  }
});

/* ==========================================================================
   5. INTERSECTION OBSERVER FOR SCROLL ENTRANCE ANIMATIONS
   ========================================================================== */
const observerOptions = {
  root: null,
  threshold: 0.1
};

const entranceObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const animType = entry.target.dataset.anim || 'hero-fade';
      entry.target.classList.add('hero-anim', animType);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-scroll-anim]').forEach(el => {
  entranceObserver.observe(el);
});


/* ==========================================================================
   6. 3D CAROUSEL ENGINE FOR FILIAIS
   ========================================================================== */
const FILIAIS_DATA = [
  {
    name: 'Itabuna - Central Pneus',
    address: 'BR-415, 4249 - Centro Industrial, Itabuna - BA, 45613-000',
    phone: '(73) 99174-1441',
    whatsappUrl: 'https://www.google.com/maps/search/?api=1&query=Central%20Auto%20Center%20-%20BR-415%2C%204249%20-%20Centro%20Industrial%2C%20Itabuna%20-%20BA%2C%2045613-000',
    ghostText: 'MATRIZ',
    src: 'public/vipal.jpeg',
    bgColor: '#48ba07'
  },
  {
    name: 'Itabuna - Central Autocenter',
    address: 'BR-415, 4249 - Centro Industrial, Itabuna - BA, 45613-000',
    phone: '(73) 99174-1441',
    whatsappUrl: 'https://www.google.com/maps/search/?api=1&query=Central%20Auto%20Center%20-%20BR-415%2C%204249%20-%20Centro%20Industrial%2C%20Itabuna%20-%20BA%2C%2045613-000',
    ghostText: 'AUTOCENTER',
    src: 'public/autocenter.jpg',
    bgColor: '#F4F4F5'
  },
  {
    name: 'Santo Antonio de Jesus - Saj Pneus',
    address: 'Rua Pastor Aniel da Silva Costa, 245, Amparo – Santo Antônio de Jesus/BA',
    phone: '(73) 98153-6025',
    whatsappUrl: `https://wa.me/${['55','73','98153','6025'].join('')}?text=Olá! Gostaria de falar com a Saj Pneus de Santo Antônio de Jesus.`,
    ghostText: 'SAJ PNEUS',
    src: 'public/saj.jpeg',
    bgColor: '#e58903'
  },
  {
    name: 'Itabuna - Central Autocar',
    address: 'Av. Manoel Souza Chaves, 2528 - São Caetano, Itabuna - BA, 45608-401',
    phone: '(73) 98887-9617',
    whatsappUrl: 'https://www.google.com/maps/place/CENTRAL+AUTOCAR+-+ITABUNA+-+Pneus,+Oficina+mec%C3%A2nica+e+Troca+de+%C3%93leo/@-14.8071941,-39.2751762,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhDmi5JALkqoTqJFe67iyRrR!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FAPNQkAHWdfcdbfhxCO3GlMNKgXTBL040WB_Q-iKIaO_ZrulkzZJ79zoWFKlrqg5r3h1O7vHcdMSA44k-BMVWkeAcd_uGXvupsUCsmsODHuNQ0fqWyyMhFFYmGfUECeFkvhyz7Bts5vY7_3cjOAY%3Dw203-h114-k-no!7i1600!8i900!4m7!3m6!1s0x739ab54cfa1e1b3:0xfac8cf37ce8eec69!8m2!3d-14.8072971!4d-39.2751285!10e5!16s%2Fg%2F11z4b0lc_1?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D#',
    ghostText: 'ITABUNA',
    src: 'public/centralautocar.jpg',
    bgColor: '#FFFFFF'
  }
];

// Preload images
FILIAIS_DATA.forEach(item => {
  const img = new Image();
  img.src = item.src;
});

let filialActiveIndex = 0;
let carouselAnimating = false;

function updateCarouselUI() {
  const isMobile = window.innerWidth < 640;
  const container = document.getElementById('filiaisContent');
  const ghostText = document.getElementById('giantGhostText');
  const filialTitle = document.getElementById('filialTitle');
  const filialAddress = document.getElementById('filialAddress');
  const filialPhone = document.getElementById('filialPhone');
  const filialMap = document.getElementById('btnFilialMap');
  
  if (!container) return;

  const currentData = FILIAIS_DATA[filialActiveIndex];
  
  // Transition background color (Dynamic)
  container.style.backgroundColor = currentData.bgColor;
  
  // Transition texts
  if (ghostText) ghostText.textContent = currentData.ghostText;
  if (filialTitle) filialTitle.textContent = currentData.name;
  if (filialAddress) filialAddress.textContent = currentData.address;
  if (filialPhone) filialPhone.textContent = `WhatsApp: ${currentData.phone}`;
  if (filialMap) filialMap.href = currentData.whatsappUrl;

  // Calculate roles indices
  const total = FILIAIS_DATA.length;
  const center = filialActiveIndex;
  const right = (filialActiveIndex + 1) % total;
  const left = (filialActiveIndex + total - 1) % total;

  const items = document.querySelectorAll('.carousel-item');
  items.forEach(el => {
    const idx = parseInt(el.getAttribute('data-index'), 10);
    
    // Reset classes
    el.style.transition = 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1), filter 700ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms cubic-bezier(0.25, 1, 0.5, 1), left 700ms cubic-bezier(0.25, 1, 0.5, 1), bottom 700ms cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.willChange = 'transform, filter, opacity';

    if (idx === center) {
      el.style.transform = `translateX(-50%) scale(${isMobile ? 0.95 : 1.18})`;
      el.style.filter = 'blur(0px)';
      el.style.opacity = '1';
      el.style.zIndex = '20';
      el.style.left = '50%';
      el.style.bottom = isMobile ? '20%' : '8%';
    } else if (idx === left) {
      el.style.transform = `translateX(-50%) scale(${isMobile ? 0.68 : 0.85})`;
      el.style.filter = 'blur(2px)';
      el.style.opacity = '0.75';
      el.style.zIndex = '10';
      el.style.left = isMobile ? '22%' : '32%';
      el.style.bottom = isMobile ? '32%' : '14%';
    } else if (idx === right) {
      el.style.transform = `translateX(-50%) scale(${isMobile ? 0.68 : 0.85})`;
      el.style.filter = 'blur(2px)';
      el.style.opacity = '0.75';
      el.style.zIndex = '10';
      el.style.left = isMobile ? '78%' : '68%';
      el.style.bottom = isMobile ? '32%' : '14%';
    } else {
      // Off-stage items (when there are more filiais than visible slots)
      el.style.transform = `translateX(-50%) scale(${isMobile ? 0.5 : 0.6})`;
      el.style.filter = 'blur(6px)';
      el.style.opacity = '0';
      el.style.zIndex = '1';
      el.style.left = '50%';
      el.style.bottom = isMobile ? '32%' : '14%';
    }
  });
}

function navigateCarousel(direction) {
  if (carouselAnimating) return;
  carouselAnimating = true;
  const currentFilial = FILIAIS_DATA[filialActiveIndex];
  if (window.CA_Analytics) window.CA_Analytics.trackFilialView(currentFilial.name);
  
  const total = FILIAIS_DATA.length;
  if (direction === 'next') {
    filialActiveIndex = (filialActiveIndex + 1) % total;
  } else {
    filialActiveIndex = (filialActiveIndex + total - 1) % total;
  }
  
  updateCarouselUI();
  
  setTimeout(() => {
    carouselAnimating = false;
  }, 700);
}

// Click to switch active item
const carouselItems = document.querySelectorAll('.carousel-item');
carouselItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const idx = parseInt(item.getAttribute('data-index'), 10);
    if (idx !== filialActiveIndex) {
      e.preventDefault(); // Prevent opening link if not the active item
      if (carouselAnimating) return;
      
      const currentFilial = FILIAIS_DATA[idx];
      if (window.CA_Analytics) window.CA_Analytics.trackFilialView(currentFilial.name);
      
      filialActiveIndex = idx;
      updateCarouselUI();
      
      carouselAnimating = true;
      setTimeout(() => {
        carouselAnimating = false;
      }, 700);
    }
  });
});

// Nav Arrow Listeners
const btnPrev = document.getElementById('btnPrevFilial');
const btnNext = document.getElementById('btnNextFilial');
const btnFilialMap = document.getElementById('btnFilialMap');

if (btnPrev && btnNext) {
  btnPrev.addEventListener('click', () => navigateCarousel('prev'));
  btnNext.addEventListener('click', () => navigateCarousel('next'));
}

// Firebase: track WhatsApp/map click on filial
if (btnFilialMap) {
  btnFilialMap.addEventListener('click', () => {
    const currentFilial = FILIAIS_DATA[filialActiveIndex];
    if (window.CA_Analytics) window.CA_Analytics.trackWhatsappClick(`filial_${currentFilial.name}`);
  });
}

// Resize event
window.addEventListener('resize', updateCarouselUI);

// Initial call
// Initial call
updateCarouselUI();

/* ==========================================================================
   7. SECURITY: WHATSAPP OBFUSCATION
   ========================================================================== */
window.openSecureWA = function(e, contactChunks, msg) {
  if(e) e.preventDefault();
  const number = contactChunks.join(''); 
  const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
const faqBtns = document.querySelectorAll('.faq-btn');
faqBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    const isHidden = content.classList.contains('hidden');
    
    // Close all others
    document.querySelectorAll('.faq-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.faq-btn i').forEach(el => el.style.transform = 'rotate(0deg)');
    
    // Open clicked one if it was hidden
    if (isHidden) {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

/* ==========================================================================
   8. HOME BANNERS CAROUSEL (banner1 <-> banner2, auto-slide sideways)
   ========================================================================== */
(function initBannerCarousel() {
  const track = document.getElementById('bannerSlideTrack');
  if (!track) return;
  const dots = document.querySelectorAll('.banner-dot');
  const slideCount = track.children.length;
  let currentSlide = 0;
  let autoSlideId = null;

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * (100 / slideCount)}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-zinc-900', i === currentSlide);
      dot.classList.toggle('bg-zinc-900/25', i !== currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slideCount);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideId = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideId) clearInterval(autoSlideId);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startAutoSlide();
    });
  });

  goToSlide(0);
  startAutoSlide();
})();


/* ==========================================================================
   9. VIDEO ANIMATION (vd3.mp4)
   ========================================================================== */
(function initVideoAnimation() {
  const video = document.getElementById('frameVideo');
  const loader = document.getElementById('frameLoader');
  if (!video) return;

  // We must wait for the video to have enough data to play
  video.addEventListener('canplay', () => {
    // Hide loader if it exists
    if (loader) loader.classList.add('hidden-loader');
  });

  // Also catch loadeddata just in case
  video.addEventListener('loadeddata', () => {
    if (loader) loader.classList.add('hidden-loader');
  });

})();
