import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const body = Buffer.concat([name, data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}
function makePng(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const cyan = [34, 211, 238, 255];
  const bg = [11, 21, 48, 255];
  const segments = [
    [0.25,0.70,0.25,0.30],[0.25,0.30,0.50,0.55],
    [0.50,0.55,0.75,0.30],[0.75,0.30,0.75,0.70]
  ];
  const thickness = size * 0.075;
  for (let y=0; y<size; y++) {
    const row = y * (size*4+1);
    raw[row] = 0;
    for (let x=0; x<size; x++) {
      const nx=(x+0.5)/size, ny=(y+0.5)/size;
      let color=bg;
      for (const [ax,ay,bx,by] of segments) {
        const px=nx-ax, py=ny-ay, dx=bx-ax, dy=by-ay;
        const t=Math.max(0,Math.min(1,(px*dx+py*dy)/(dx*dx+dy*dy)));
        const dist=Math.hypot(px-t*dx,py-t*dy);
        if (dist < thickness/size) { color=cyan; break; }
      }
      const i=row+1+x*4;
      raw[i]=color[0]; raw[i+1]=color[1]; raw[i+2]=color[2]; raw[i+3]=color[3];
    }
  }
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
  ihdr[8]=8; ihdr[9]=6;
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',ihdr), chunk('IDAT',deflateSync(raw)), chunk('IEND',Buffer.alloc(0))
  ]);
}
mkdirSync('public/icons',{recursive:true});
for (const size of [192,512]) writeFileSync(`public/icons/icon-${size}.png`,makePng(size));
