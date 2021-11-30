export function backGroundStart() {
  let c = document.getElementById('c');
  const ctx = c.getContext('2d');
  let w = c.width = window.innerWidth;
  let h = c.height = window.innerHeight;


  let space = 70;
  let baseSize = 25;
  let addSize = 20;


  let speed = 0;
  let rad = Math.PI / 6;
  let sin = Math.sin(rad);
  let cos = Math.cos(rad);
  let xs = [cos, 0, -cos, -cos, 0, cos];
  let ys = [-sin, -1, -sin, sin, 1, sin];

  function tick() {
  
    window.requestAnimationFrame(tick);
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
  
    speed = speed + 0.008;
  
    let difX = Math.sqrt(3) * space / 2;
    let difY = space * 3 / 2;
    let limitX = c.width + space;
    let limitY = c.height + space;
  
    for (let x = 0; x < limitX; x += difX * 2) {
      let i = 0;
    
      for (let y = 0; y < limitY; y += difY) {
        ++i;
			
        let x1 = x + difX * (i % 2);
        let size = baseSize + addSize * Math.sin((x1 + y * 2) * 0.01 + speed);
        ctx.fillStyle = 'rgba(100,100,100,0.15)';
        ctx.beginPath();
        ctx.moveTo(xs[0] * size + x1, ys[0] * size + y);
        for (let n = 1; n < xs.length; ++n)
          ctx.lineTo(xs[n] * size + x1, ys[n] * size + y);
        ctx.fill();
      }
    }
  }
  tick();

  window.addEventListener('resize', function () {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
  });
}
