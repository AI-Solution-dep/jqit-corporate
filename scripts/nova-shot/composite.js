// NOVA製品モックアップ（ノートPC＋スマホ）を生成する
// 使い方: NODE_PATH=<playwright入りnode_modules> node composite.js <画面キャプチャ(16:9推奨)> <出力png>
// 出力: 748x438 CSS px を @2x で描画（1496x876, 透過PNG） — public/nova-product.png と同じ縦横比
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const [,, screenPath, outPath] = process.argv;
if (!screenPath || !outPath) { console.error("usage: node composite.js <screen.png> <out.png>"); process.exit(1); }
const b64 = (p) => `data:image/png;base64,${fs.readFileSync(p).toString("base64")}`;
const screen = b64(screenPath);
const logo = b64(path.join(__dirname, "nova-logo.png"));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;background:transparent}
  .stage{position:relative;width:748px;height:438px;overflow:hidden}
  /* laptop */
  .lid{position:absolute;left:118px;top:0;width:626px;height:364px;background:#15171a;border-radius:18px 18px 4px 4px;
       box-shadow:0 18px 40px rgba(0,0,0,.28);}
  .lid::after{content:"";position:absolute;left:50%;top:7px;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#2c2f34}
  .screen{position:absolute;left:18px;top:18px;right:18px;bottom:14px;border-radius:6px;overflow:hidden;background:#f7f9fb}
  .screen img{display:block;width:100%;height:100%;object-fit:fill}
  .base{position:absolute;left:96px;top:364px;width:652px;height:22px;background:linear-gradient(#2b2e33,#1a1c20);border-radius:0 0 14px 14px}
  .base::before{content:"";position:absolute;left:50%;top:0;width:96px;height:6px;margin-left:-48px;background:#0e0f11;border-radius:0 0 6px 6px}
  .base::after{content:"";position:absolute;left:0;right:0;top:22px;height:10px;background:linear-gradient(#121316,rgba(18,19,22,0));border-radius:0 0 40px 40px;opacity:.9}
  /* phone */
  .phone{position:absolute;left:0;top:112px;width:176px;height:326px;background:#101214;border-radius:26px;
         box-shadow:0 16px 32px rgba(0,0,0,.35);border:1px solid #2a2d31}
  .phone::before{content:"";position:absolute;left:50%;top:10px;width:64px;height:16px;margin-left:-32px;background:#101214;border-radius:0 0 10px 10px;z-index:2}
  .pscreen{position:absolute;left:9px;top:9px;right:9px;bottom:9px;border-radius:19px;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center}
  .pscreen img{width:118px;height:auto}
</style></head><body>
<div class="stage">
  <div class="lid"><div class="screen"><img src="${screen}"></div></div>
  <div class="base"></div>
  <div class="phone"><div class="pscreen"><img src="${logo}"></div></div>
</div></body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 748, height: 438 }, deviceScaleFactor: 2 });
  await p.setContent(html);
  await p.waitForTimeout(400);
  await p.locator(".stage").screenshot({ path: outPath, omitBackground: true });
  await b.close();
  const buf = fs.readFileSync(outPath);
  console.log("written:", outPath, buf.readUInt32BE(16) + "x" + buf.readUInt32BE(20), "colorType=" + buf[25], Math.round(buf.length / 1024) + "KB");
})();
