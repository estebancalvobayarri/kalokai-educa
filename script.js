// Kalokai Educa — comportamiento mínimo de la página

(function () {
  // Al abrir una página sin ancla (#...), empezar siempre desde arriba
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  // ------------------------------------------------------------------
  // Menú para móvil y tablet. Para cambiar los enlaces, edita PAGINAS.
  // ------------------------------------------------------------------
  var PAGINAS = [
    ['index.html', 'Inicio'],
    ['formaciones.html', 'Formaciones'],
    ['index.html#programas', 'Programas'],
    ['index.html#metodo', 'Cómo trabajamos']
  ];
  var cabecera = document.querySelector('.header-inner');
  if (cabecera) {
    var actual = location.pathname.split('/').pop() || 'index.html';
    var boton = document.createElement('button');
    boton.className = 'menu-toggle';
    boton.type = 'button';
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'menu-movil');
    boton.setAttribute('aria-label', 'Abrir menú');
    boton.innerHTML = '<span></span><span></span><span></span>';
    cabecera.appendChild(boton);

    var panel = document.createElement('nav');
    panel.className = 'mobile-menu';
    panel.id = 'menu-movil';
    panel.setAttribute('aria-label', 'Menú');
    panel.hidden = true;
    panel.innerHTML = '<ul class="wrap">' + PAGINAS.map(function (p) {
      return '<li><a href="' + p[0] + '"' + (p[0] === actual ? ' aria-current="page"' : '') + '>' + p[1] + '</a></li>';
    }).join('') + '</ul>';
    cabecera.parentNode.appendChild(panel);

    function abrirMenu(abierto) {
      panel.hidden = !abierto;
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      boton.classList.toggle('open', abierto);
    }
    boton.addEventListener('click', function () { abrirMenu(panel.hidden); });
    panel.addEventListener('click', function (e) { if (e.target.tagName === 'A') abrirMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrirMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) abrirMenu(false); });
  }

  // Línea bajo la cabecera al desplazarse
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ------------------------------------------------------------------
  // Formulario de solicitud (ventana emergente, igual en todas las páginas)
  // Se abre con cualquier enlace que tenga el atributo data-solicitud.
  // data-solicitud="programa" lo abre con «Un programa para el centro» marcado.
  // data-area="…" deja elegida esa área de interés.
  // El envío prepara un correo a DESTINO con los datos.
  // ------------------------------------------------------------------
  var DESTINO = 'hola@kalokai.es';

  var plantilla =
    '<dialog class="form-dialog" id="solicitud" aria-labelledby="solicitud-title">' +
    '  <button class="dialog-close" type="button" aria-label="Cerrar">&times;</button>' +
    '  <h2 id="solicitud-title" class="dialog-title">Hablemos de tu centro</h2>' +
    '  <p class="dialog-intro">Cuéntanos qué necesitáis y te responderemos en dos días laborables.</p>' +
    '  <form class="form" id="solicitud-form" novalidate>' +
    '    <fieldset class="field field-wide">' +
    '      <legend>¿Qué te interesa?</legend>' +
    '      <div class="chips">' +
    '        <label><input type="radio" name="motivo" value="formacion" checked> Una formación concreta</label>' +
    '        <label><input type="radio" name="motivo" value="programa"> Un programa para el centro</label>' +
    '        <label><input type="radio" name="motivo" value="otra"> Otra consulta</label>' +
    '      </div>' +
    '    </fieldset>' +
    '    <div class="field">' +
    '      <label for="s-nombre">Nombre</label>' +
    '      <input id="s-nombre" name="nombre" type="text" autocomplete="name" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-centro">Centro educativo</label>' +
    '      <input id="s-centro" name="centro" type="text" autocomplete="organization" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-email">Correo electrónico</label>' +
    '      <input id="s-email" name="email" type="email" autocomplete="email" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-telefono">Teléfono <span class="optional">(opcional)</span></label>' +
    '      <input id="s-telefono" name="telefono" type="tel" autocomplete="tel">' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-cargo">Tu papel en el centro</label>' +
    '      <select id="s-cargo" name="cargo">' +
    '        <option>Dirección</option><option>Orientación</option><option>Coordinación de bienestar y protección</option>' +
    '        <option>Profesorado</option><option>AMPA</option><option>Titularidad del centro</option><option>Otro</option>' +
    '      </select>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-tipo">Tipo de centro</label>' +
    '      <select id="s-tipo" name="tipo">' +
    '        <option>Concertado</option><option>Privado</option><option>Público</option>' +
    '      </select>' +
    '    </div>' +
    '    <div class="field field-wide" data-solo="formacion">' +
    '      <label for="s-area">Área de interés</label>' +
    '      <select id="s-area" name="area">' +
    '        <option>Aún no lo tengo claro</option>' +
    '        <option>Salud física</option><option>Salud mental</option>' +
    '        <option>Convivencia y clima</option><option>Protección y seguridad</option>' +
    '        <option>Aula y aprendizaje</option><option>Digital</option>' +
    '      </select>' +
    '    </div>' +
    '    <fieldset class="field field-wide">' +
    '      <legend>¿Para quién?</legend>' +
    '      <div class="chips">' +
    '        <label><input type="checkbox" name="publico" value="Profesorado y personal"> Profesorado y personal</label>' +
    '        <label><input type="checkbox" name="publico" value="Alumnado"> Alumnado</label>' +
    '        <label><input type="checkbox" name="publico" value="Familias"> Familias</label>' +
    '      </div>' +
    '    </fieldset>' +
    '    <div class="field field-wide">' +
    '      <label for="s-mensaje">¿Algo más que debamos saber? <span class="optional">(opcional)</span></label>' +
    '      <textarea id="s-mensaje" name="mensaje" rows="3" placeholder="Etapas, número de grupos, fechas que os interesan…"></textarea>' +
    '    </div>' +
    '    <label class="check field-wide"><input type="checkbox" id="s-acepto" name="acepto" required> <span>He leído la <a href="privacidad.html" target="_blank">política de privacidad</a> y acepto que Kalokai use estos datos para responder a mi solicitud.</span></label>' +
    '    <div class="field-wide form-foot">' +
    '      <button class="btn" type="submit">Enviar solicitud</button>' +
    '      <p class="form-status" id="solicitud-status" role="status" aria-live="polite"></p>' +
    '    </div>' +
    '    <p class="form-legal field-wide">Responsable: Esteban Calvo Bayarri (Kalokai). Finalidad: responder a tu solicitud. Legitimación: tu consentimiento. Destinatarios: no cedemos tus datos a terceros, salvo obligación legal. Derechos: acceso, rectificación, supresión y demás, en hola@kalokai.es. Más información en la <a href="privacidad.html" target="_blank">política de privacidad</a>.</p>' +
    '  </form>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', plantilla);

  var dialog = document.getElementById('solicitud');
  var form = document.getElementById('solicitud-form');
  var status = document.getElementById('solicitud-status');

  function motivoActual() {
    var marcado = form.querySelector('input[name="motivo"]:checked');
    return marcado ? marcado.value : 'formacion';
  }
  function actualizarCampos() {
    var motivo = motivoActual();
    form.querySelectorAll('[data-solo]').forEach(function (el) {
      el.hidden = el.getAttribute('data-solo') !== motivo;
    });
  }
  form.querySelectorAll('input[name="motivo"]').forEach(function (r) {
    r.addEventListener('change', actualizarCampos);
  });

  function abrir(motivo, area) {
    if (motivo) {
      var radio = form.querySelector('input[name="motivo"][value="' + motivo + '"]');
      if (radio) radio.checked = true;
    }
    if (area) document.getElementById('s-area').value = area;
    actualizarCampos();
    status.textContent = '';
    status.classList.remove('error');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.getElementById('s-nombre').focus();
  }
  function cerrar() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  document.querySelectorAll('[data-solicitud]').forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      abrir(el.getAttribute('data-solicitud'), el.getAttribute('data-area'));
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', cerrar);
  dialog.addEventListener('click', function (event) { if (event.target === dialog) cerrar(); });
  if (location.hash === '#solicitud') abrir();

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var faltan = [];
    ['s-nombre', 's-centro', 's-email'].forEach(function (id) {
      var input = document.getElementById(id);
      var valido = input.value.trim() !== '' && input.checkValidity();
      input.parentElement.classList.toggle('invalid', !valido);
      input.setAttribute('aria-invalid', String(!valido));
      if (!valido) faltan.push(input);
    });
    var acepto = document.getElementById('s-acepto');

    if (faltan.length || !acepto.checked) {
      status.textContent = faltan.length
        ? 'Revisa los campos marcados para poder enviar la solicitud.'
        : 'Marca la casilla de aceptación para poder enviar la solicitud.';
      status.classList.add('error');
      (faltan[0] || acepto).focus();
      return;
    }

    var d = new FormData(form);
    var motivo = motivoActual();
    var publicos = d.getAll('publico');
    var lineas = [
      'Nombre: ' + d.get('nombre'),
      'Centro: ' + d.get('centro') + ' (' + d.get('tipo') + ')',
      'Papel en el centro: ' + d.get('cargo'),
      'Correo: ' + d.get('email'),
      'Teléfono: ' + (d.get('telefono') || '—'),
      'Para quién: ' + (publicos.length ? publicos.join(', ') : 'Sin indicar')
    ];
    var asunto;
    if (motivo === 'formacion') {
      asunto = 'Kalokai Educa · Información sobre una formación · ' + d.get('centro');
      lineas.push('Área de interés: ' + d.get('area'));
    } else if (motivo === 'programa') {
      asunto = 'Kalokai Educa · Programa para el centro · ' + d.get('centro');
    } else {
      asunto = 'Kalokai Educa · Consulta · ' + d.get('centro');
    }
    lineas.push('', d.get('mensaje') || '');

    window.location.href = 'mailto:' + DESTINO +
      '?subject=' + encodeURIComponent(asunto) +
      '&body=' + encodeURIComponent(lineas.join('\n'));

    status.classList.remove('error');
    status.textContent = 'Hemos abierto tu correo con la solicitud preparada. Solo falta enviarla.';
  });
})();

// --------------------------------------------------------------------
// Página de formaciones: filtro por público (profesorado, alumnado, familias)
// y por formaciones bonificables por FUNDAE (las del profesorado y el personal)
// Cada ficha lleva data-publico con uno o varios valores separados por espacios.
// --------------------------------------------------------------------
(function () {
  var botones = document.querySelectorAll('.filtro');
  if (!botones.length) return;
  var fichas = document.querySelectorAll('.ficha');
  var vacio = document.querySelector('.catalogo-vacio');

  function filtrar(valor) {
    botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filtro === valor)); });
    fichas.forEach(function (f) {
      var publicos = (f.dataset.publico || '').split(' ');
      f.hidden = valor !== 'todas' && publicos.indexOf(valor) === -1;
    });
    // Oculta las áreas que se quedan sin fichas
    document.querySelectorAll('.catalogo-area').forEach(function (a) {
      a.hidden = !a.querySelector('.ficha:not([hidden])');
    });
    document.querySelectorAll('.catalogo-linea').forEach(function (l) {
      l.hidden = !l.querySelector('.catalogo-area:not([hidden])');
    });
    if (vacio) vacio.hidden = !!document.querySelector('.ficha:not([hidden])');
    var nota = document.querySelector('.filtro-nota');
    if (nota) nota.hidden = valor !== 'bonificable';
  }
  botones.forEach(function (b) {
    b.addEventListener('click', function () { filtrar(b.dataset.filtro); });
  });
})();
