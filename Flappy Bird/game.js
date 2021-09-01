// Arkaplan kaydırma hızı
let move_speed = 3;
    
// Yerçekimi sabit değeri
let gravity = 0.5;
    
// Bird elemanına referans alma
let bird = document.querySelector('.bird');
    
// Bird elementi özelliklerini alma
let bird_props = bird.getBoundingClientRect();
let background =
    document.querySelector('.background')
            .getBoundingClientRect();
    
// Score elementine referans alma
let score_val =
    document.querySelector('.score_val');
let message =
    document.querySelector('.message');
let score_title =
    document.querySelector('.score_title');
    
// Başlangıç oyun durumu
let game_state = 'Start';
    
// Klavyedeki tuşlar için eventlistener ekle
document.addEventListener('keydown', (e) => {
    
  // Enter'a basılması durumunda oyunu başlat
  if (e.key == 'Enter' &&
      game_state != 'Play') {
    document.querySelectorAll('.pipe_sprite')
              .forEach((e) => {
      e.remove();
    });
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    play();
  }
});
function play() {
  function move() {
      
    // Oyun bittip bitmediğini tespit et
    if (game_state != 'Play') return;
      
    // Pipe elementlerine referans alma
    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
        
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();
        
      // Ekrandan çıkan boruları sil (bellekte alan kaplamaması için)
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Bird ve pipeların birbiri ile çarpışmasını tespit etme
        if (
          bird_props.left < pipe_sprite_props.left +
          pipe_sprite_props.width &&
          bird_props.left +
          bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top +
          pipe_sprite_props.height &&
          bird_props.top +
          bird_props.height > pipe_sprite_props.top
        ) {
            
          // Oyun durumunu değiştir ve çarpışma olursa oyunu bitir
          game_state = 'End';
          message.innerHTML = 'Press Enter To Restart';
          message.style.left = '28vw';
          return;
        } else {
          // Oyuncu bird'ü başarıyla atlattıysa puanı arttırma
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + 
            move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
          }
          element.style.left = 
            pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });
  
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);
  
  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy = bird_dy + gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -7.6;
      }
    });
  
    // Bird'ün ekranın üst ve altıyla çarpmasını tespit etme
  
    if (bird_props.top <= 0 ||
        bird_props.bottom >= background.bottom) {
      game_state = 'End';
      message.innerHTML = 'Press Enter To Restart';
      message.style.left = '28vw';
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);
  
  let pipe_seperation = 0;
    
  // İki pipe arasındaki boşluğun sabit değeri
  let pipe_gap = 35;
  function create_pipe() {
    if (game_state != 'Play') return;
      
    // İki pipe arasındaki boşluğun değeri önceden tanımlanmış değeri aşıyorsa başka bir pipe oluştur
    if (pipe_seperation > 115) {
      pipe_seperation = 0
        
      // Pipe'ların y eksenindeki rastgele konumunu hesapla
      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
        
      // Pipe elementini DOM'a ekle
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
        
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}