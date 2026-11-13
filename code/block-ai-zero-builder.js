/* Сборщик нативных элементов Zero Block «Этот Advent мы сделали с помощью нейросетей».
   Запускается в редакторе Zero (tilda.ru/zero/?recordid=5778720201): берёт шаблоны элементов
   из localStorage 'adv_tpl', собирает элементы и вставляет их через буфер копирования Тильды.
   Координаты: сетка 1200 (Figma 1920 × 0.625); 960 = ПК × 0.8; телефон — сетка 360,
   480 = ×4/3, 640 = ×16/9. */
(function () {
  var IMG = 'https://dashkoy1.github.io/advent-calendar/assets/ai/';
  var tpl = JSON.parse(localStorage.getItem('adv_tpl'));
  var RES = { 960: 0.8 };
  var MRES = { 640: 640 / 360, 480: 480 / 360, 360: 1 };
  function r2(v) { return String(Math.round(v * 100) / 100); }
  function clean(t) {
    var p = JSON.parse(JSON.stringify(t.props));
    Object.keys(p).forEach(function (k) { if (/-res-/.test(k)) { delete p[k]; } });
    delete p.groupid;
    p.container = 'grid'; p.axisx = 'left'; p.axisy = 'top';
    p.leftunits = 'px'; p.topunits = 'px'; p.widthunits = 'px'; p.heightunits = 'px';
    p.rotate = '0'; p.flipvertical = ''; p.fliphorizontal = ''; p.opacity = '1'; p.hidden = 'n';
    return p;
  }
  function place(p, d, m, fs) {
    p.left = r2(d[0]); p.top = r2(d[1]); p.width = r2(d[2]);
    if (d[3] != null) { p.height = r2(d[3]); }
    if (fs) { p.fontsize = r2(fs[0]); }
    Object.keys(RES).forEach(function (r) {
      var k = RES[r];
      p['left-res-' + r] = r2(d[0] * k); p['top-res-' + r] = r2(d[1] * k); p['width-res-' + r] = r2(d[2] * k);
      if (d[3] != null) { p['height-res-' + r] = r2(d[3] * k); }
      if (fs) { p['fontsize-res-' + r] = r2(fs[0] * k); }
    });
    Object.keys(MRES).forEach(function (r) {
      var k = MRES[r];
      p['left-res-' + r] = r2(m[0] * k); p['top-res-' + r] = r2(m[1] * k); p['width-res-' + r] = r2(m[2] * k);
      if (m[3] != null) { p['height-res-' + r] = r2(m[3] * k); }
      if (fs) { p['fontsize-res-' + r] = r2(fs[1] * k); }
    });
    return p;
  }
  var out = [];
  var z = 1;
  function add(kind, props) {
    props.zindex = String(z++);
    out.push({ id: String(Date.now()) + String(out.length).padStart(6, '0'), index: out.length, type: 'element', isSelected: false, props: props });
  }
  function image(name, file, fw, fh, d, m, radius, fit) {
    var p = clean(tpl.image);
    p.img = IMG + file; p.filewidth = String(fw); p.fileheight = String(fh);
    p.imagefit = fit || 'cover'; p.imageposition = 'center center';
    p.borderradius = radius ? radius[0] + 'px ' + radius[0] + 'px ' + radius[0] + 'px ' + radius[0] + 'px' : '0px 0px 0px 0px';
    p.layer = name; p.name = name; p.widthmode = 'fixed'; p.heightmode = 'fixed';
    place(p, d, m);
    if (radius) {
      Object.keys(RES).forEach(function (r) { var v = Math.round(radius[0] * RES[r]); p['borderradius-res-' + r] = v + 'px ' + v + 'px ' + v + 'px ' + v + 'px'; });
      Object.keys(MRES).forEach(function (r) { var v = Math.round(radius[1] * MRES[r]); p['borderradius-res-' + r] = v + 'px ' + v + 'px ' + v + 'px ' + v + 'px'; });
    }
    add('image', p);
  }
  function chip(caption, d, m) {
    var p = clean(tpl.button);
    p.caption = caption; p.layer = caption; p.name = caption;
    p.bgcolor = '#f6e4d8'; p.bgcolorhover = '#f6e4d8'; p.color = '#102041'; p.colorhover = '#102041';
    p.fontweight = '400'; p.lettercase = ''; p.letterspacing = '-1'; p.lineheight = '1.5';
    p.borderradius = '100px 100px 100px 100px';
    p.shadows = ''; p.shadowopacity = '0'; p.shadowy = '0'; p.shadowblur = '0'; p.shadowspread = '0';
    p.link = ''; p.linktarget = '';
    place(p, d, m, [19.9, 15]);
    add('button', p);
  }

  /* 1. бежевая подложка под нижние скруглённые углы фото */
  var bg = clean(tpl.shape);
  bg.figure = 'rectangle'; bg.bgcolor = '#f6e4d8'; bg.borderwidth = '0px 0px 0px 0px'; bg.borderradius = '0px 0px 0px 0px';
  bg.layer = 'Подложка снизу'; bg.name = 'Подложка снизу';
  place(bg, [0, 875.6, 1200, 163.4], [0, 600, 360, 45]);
  add('shape', bg);

  /* 2. фото с ноутбуком */
  image('Фото с ноутбуком', 'laptop-tmp.webp', 1446, 918, [0, 276.9, 1200, 761.9], [0, 230, 360, 415], [56, 30], 'cover');
  /* 3. заголовок (вектор) и 4. Advent */
  image('Заголовок', 'title.svg', 1254, 318, [203.06, 113.9, 783.75, 198.75], [15, 70, 330, 83.7], null, 'contain');
  image('Advent', 'advent-outline.svg', 666, 386, [259.5, 37.4, 416.25, 241.25], [38.8, 37.8, 175.3, 101.6], null, 'contain');
  /* 5–8. нейросети */
  chip('ChatGpt', [175.6, 345.6, 139.5, 51.75], [35, 176, 130, 42]);
  chip('Claude Code', [383.9, 345.6, 167.9, 51.75], [175, 176, 150, 42]);
  chip('NanoBanana', [620.5, 345.6, 167.9, 51.75], [20, 228, 150, 42]);
  chip('Adobe FireFlay', [857.1, 345.6, 167.9, 51.75], [180, 228, 160, 42]);
  /* 9. карточка профиля */
  image('Карточка профиля', 'profile-card.webp', 590, 170, [510, 910, 180, 51.9], [105, 540, 150, 43.25], [7, 6], 'cover');
  /* 10. подпись */
  var tx = clean(tpl.text);
  tx.text = 'А еще в 2026 году <strong>благодаря ИИ набрали 20&nbsp;000+ аудитории,</strong><br>заработали&nbsp; 450&nbsp;000₽ только с одного ИИ-заказа и т.п.';
  tx.color = '#ffffff'; tx.align = 'center'; tx.fontweight = '400'; tx.lineheight = '1.3'; tx.letterspacing = '-0.69';
  tx.lettercase = ''; tx.layer = 'Подпись'; tx.name = 'Подпись'; tx.heightmode = 'auto';
  place(tx, [410, 971.9, 380, null], [20, 592, 320, null], [13.8, 11.5]);
  tx['letterspacing-res-360'] = '-0.4'; tx['letterspacing-res-480'] = '-0.53'; tx['letterspacing-res-640'] = '-0.71';
  add('text', tx);

  localStorage.setItem('tn_store_buffer__copy-paste', JSON.stringify({ res: 1200, data: out, timestamp: Date.now() }));
  window.__advBuilt = out.length;
})();
