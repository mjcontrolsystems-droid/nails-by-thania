// ══════════════════════════════════════════════════════════════
//   NAILS BY THANIA – SCRIPT PRINCIPAL
// ══════════════════════════════════════════════════════════════

// ── CONFIGURACIÓN: cambiar SOLO aquí los datos del negocio ──
const CONFIG = {
    whatsapp: '50200000000',          // 502 + número de 8 dígitos, sin espacios ni +
    horario: 'Lunes a sábado con cita previa.',
    ubicacion: 'Guatemala.',
    facebook: '#',                    // ej: https://www.facebook.com/...
    instagram: '#',                   // ej: https://www.instagram.com/...
    tiktok: '#',                      // ej: https://www.tiktok.com/@...
    correoDev: 'josue0206.sagas@gmail.com' // correo del desarrollador (link del footer)
};

// ── FOTOS DE LA GALERÍA (categoría + ruta) ──
const GALERIA = [
    ...[9, 3, 11, 5, 13, 1, 8, 12, 4, 15, 2, 7, 10, 14, 6, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
        .map(n => ({ cat: 'unas', src: `images/unas/unas${n}.jpg` })),
    ...[2, 1, 3, 4].map(n => ({ cat: 'cejas', src: `images/cejas/cejas${n}.jpg` })),
    ...[1, 2].map(n => ({ cat: 'pestanas', src: `images/pestanas/pestanas${n}.jpg` }))
];

// Mezcla el orden en "Todos" para que no salgan todas las uñas primero
const ORDEN_TODOS = [0, 25, 1, 2, 29, 3, 26, 4, 5, 27, 6, 7, 30, 8, 9, 28, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

const linkWhatsApp = (texto) =>
    `https://api.whatsapp.com/send?phone=${CONFIG.whatsapp}&text=${encodeURIComponent(texto)}`;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Datos del negocio en la página
    document.getElementById('txtHorario').textContent = CONFIG.horario;
    document.getElementById('txtUbicacion').textContent = CONFIG.ubicacion;
    document.getElementById('anio').textContent = new Date().getFullYear();
    const saludo = linkWhatsApp('Hola Thania, quiero información sobre sus servicios.');
    document.getElementById('lnkWhatsapp').href = saludo;
    document.getElementById('waFlotante').href = saludo;
    document.getElementById('lnkFacebook').href = CONFIG.facebook;
    document.getElementById('lnkInstagram').href = CONFIG.instagram;
    document.getElementById('lnkTiktok').href = CONFIG.tiktok;

    // Link del desarrollador → abre Gmail con el correo listo para escribir
    document.getElementById('lnkDev').href =
        'https://mail.google.com/mail/?view=cm&fs=1' +
        `&to=${encodeURIComponent(CONFIG.correoDev)}` +
        `&su=${encodeURIComponent('Quiero una página web para mi negocio')}` +
        `&body=${encodeURIComponent('Hola Josué, vi la página de Nails by Thania y me interesa una página web. ')}`;

    // 2. Botones "Agendar" de cada servicio → WhatsApp
    document.querySelectorAll('.btn-agendar').forEach(btn => {
        btn.href = linkWhatsApp(`Hola Thania! Quiero agendar: ${btn.dataset.servicio}`);
        btn.target = '_blank';
        btn.rel = 'noopener';
    });

    // 3. Animación al hacer scroll
    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observador.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observador.observe(el));

    // 4. Sombra del navbar al bajar
    const navbar = document.getElementById('navbar');
    const sombraNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    sombraNavbar();
    window.addEventListener('scroll', sombraNavbar);

    // 5. Cerrar menú móvil al tocar un enlace
    const menu = document.getElementById('navMenu');
    const collapse = new bootstrap.Collapse(menu, { toggle: false });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        if (menu.classList.contains('show')) collapse.hide();
    }));

    // 6. Galería con filtros + visor
    const grid = document.getElementById('galeriaGrid');
    const visor = new bootstrap.Modal(document.getElementById('visorModal'));
    const visorImg = document.getElementById('visorImg');
    let visibles = [];
    let actual = 0;

    const pintarGaleria = (filtro) => {
        visibles = filtro === 'todos'
            ? ORDEN_TODOS.map(i => GALERIA[i])
            : GALERIA.filter(f => f.cat === filtro);
        grid.innerHTML = '';
        visibles.forEach((foto, i) => {
            const div = document.createElement('div');
            div.className = 'galeria-item';
            div.innerHTML = `<img src="${foto.src}" alt="Trabajo de Nails by Thania" loading="lazy">`;
            div.addEventListener('click', () => abrirVisor(i));
            grid.appendChild(div);
        });
    };

    const abrirVisor = (i) => {
        actual = (i + visibles.length) % visibles.length;
        visorImg.src = visibles[actual].src;
        visor.show();
    };

    document.getElementById('visorPrev').addEventListener('click', () => abrirVisor(actual - 1));
    document.getElementById('visorNext').addEventListener('click', () => abrirVisor(actual + 1));
    document.addEventListener('keydown', e => {
        if (!document.getElementById('visorModal').classList.contains('show')) return;
        if (e.key === 'ArrowLeft') abrirVisor(actual - 1);
        if (e.key === 'ArrowRight') abrirVisor(actual + 1);
    });

    document.querySelectorAll('.filtro').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filtro.activo').classList.remove('activo');
            btn.classList.add('activo');
            pintarGaleria(btn.dataset.filtro);
        });
    });
    pintarGaleria('todos');

    // 7. Formulario → WhatsApp
    const fecha = document.getElementById('fechaCliente');
    fecha.min = new Date().toISOString().split('T')[0]; // no permitir fechas pasadas

    document.getElementById('citaForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!this.checkValidity()) { this.classList.add('was-validated'); return; }

        const v = id => document.getElementById(id).value.trim();
        const hora = v('horaCliente');
        const texto =
            `*Nueva solicitud de cita* 💅\n\n` +
            `*Nombre:* ${v('nombreCliente')}\n` +
            `*Teléfono:* ${v('telefonoCliente')}\n` +
            `*Servicio:* ${v('servicioCliente')}\n` +
            `*Fecha:* ${v('fechaCliente')}${hora ? ' ' + hora : ''}\n` +
            `*Nota:* ${v('mensajeCliente') || 'Sin mensaje'}`;

        const btn = document.getElementById('btnCita');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Abriendo WhatsApp...';

        setTimeout(() => {
            window.open(linkWhatsApp(texto), '_blank');
            this.classList.add('d-none');
            document.getElementById('mensajeExito').classList.remove('d-none');
        }, 600);
    });
});
