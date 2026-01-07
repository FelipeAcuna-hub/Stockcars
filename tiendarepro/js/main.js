/**
 * STOCKCARS - Lógica Maestra
 * Maneja Buscador, Carrito, LocalStorage y Navegación
 */

// --- 1. CONFIGURACIÓN INICIAL ---
const selectMarca = document.getElementById('select-marca');
const selectModelo = document.getElementById('select-modelo');
const selectAño = document.getElementById('select-año');
const selectMotor = document.getElementById('select-motor');
const btnBuscar = document.getElementById('btn-buscar');
const resultadoDiv = document.getElementById('resultado');

// Al cargar la página, inicializamos componentes
window.onload = () => {
    cargarMarcas();
    actualizarContadorCarrito();
};

// --- 2. LÓGICA DEL BUSCADOR (FILTRADO) ---

function cargarMarcas() {
    if (typeof VEHICULOS === 'undefined') return;
    const marcas = [...new Set(VEHICULOS.map(v => v.marca).filter(m => m !== ""))];
    llenarSelector(selectMarca, marcas, 'Marca');
}

function llenarSelector(selector, listaDatos, etiqueta) {
    selector.innerHTML = `<option value="">${etiqueta}</option>`;
    if (listaDatos.length > 0) {
        listaDatos.sort().forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selector.appendChild(option);
        });
        selector.disabled = false;
    } else {
        selector.disabled = true;
    }
}

// Eventos de cascada para los selectores
selectMarca?.addEventListener('change', (e) => {
    const modelos = [...new Set(VEHICULOS.filter(v => v.marca === e.target.value).map(v => v.modelo))];
    llenarSelector(selectModelo, modelos, 'Modelo');
});

selectModelo?.addEventListener('change', (e) => {
    const años = [...new Set(VEHICULOS.filter(v => v.marca === selectMarca.value && v.modelo === e.target.value).map(v => v.año))];
    llenarSelector(selectAño, años, 'Año');
});

selectAño?.addEventListener('change', (e) => {
    const motores = VEHICULOS.filter(v => v.marca === selectMarca.value && v.modelo === selectModelo.value && v.año === e.target.value).map(v => v.motor);
    llenarSelector(selectMotor, motores, 'Motor');
});

// --- 3. RENDERIZADO DE RESULTADOS ---

btnBuscar?.addEventListener('click', () => {
    const auto = VEHICULOS.find(v => 
        v.marca === selectMarca.value && v.modelo === selectModelo.value && 
        v.año === selectAño.value && v.motor === selectMotor.value
    );

    if (auto) {
        renderizarResultado(auto);
    } else {
        alert("Por favor, selecciona todas las opciones.");
    }
});

function renderizarResultado(auto) {
    resultadoDiv.classList.remove('hidden');
    
    // Inyectar Datos de Potencia
    document.getElementById('res-titulo').innerText = `${auto.marca} ${auto.modelo} ${auto.motor}`;
    document.getElementById('res-hp-orig').innerText = auto.hp_orig;
    document.getElementById('res-nm-orig').innerText = `${auto.nm_orig} Nm`;
    document.getElementById('res-hp-stg1').innerText = auto.hp_stg1;
    document.getElementById('res-nm-stg1').innerText = `${auto.nm_stg1} Nm`;

    // Inyectar Servicios
    const lista = document.getElementById('lista-servicios');
    lista.innerHTML = '';
    crearCheckbox(lista, "Reprogramación Stage 1", auto.precio_st1 || 0);
    if (auto.precio_egr > 0) crearCheckbox(lista, "Anulación EGR", auto.precio_egr);
    if (auto.precio_dpf > 0) crearCheckbox(lista, "Anulación DPF", auto.precio_dpf);

    actualizarPrecioUI();
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

function crearCheckbox(contenedor, nombre, precio) {
    const label = document.createElement('label');
    label.className = "flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-700 cursor-pointer hover:border-red-500 transition";
    label.innerHTML = `
        <div class="flex items-center">
            <input type="checkbox" class="servicio-check w-5 h-5 text-red-600 bg-gray-800 border-gray-600" 
                   data-precio="${precio}" data-nombre="${nombre}">
            <span class="ml-4 font-bold text-gray-200">${nombre}</span>
        </div>
        <span class="font-bold text-red-500">$${Number(precio).toLocaleString()}</span>
    `;
    label.querySelector('input').addEventListener('change', actualizarPrecioUI);
    contenedor.appendChild(label);
}

function actualizarPrecioUI() {
    let total = 0;
    document.querySelectorAll('.servicio-check:checked').forEach(c => total += parseInt(c.dataset.precio));
    document.getElementById('precio-total').innerHTML = `$${total.toLocaleString()} <span class="text-sm text-gray-500">CLP</span>`;
}

// --- 4. SISTEMA DE CARRITO (LOCALSTORAGE) ---

document.addEventListener('click', (e) => {
    // Botón Comprar .BIN
    if (e.target.innerText === "COMPRAR ARCHIVO .BIN") {
        const marca = selectMarca.value;
        const modelo = selectModelo.value;
        const motor = selectMotor.value;
        const precioTotal = parseInt(document.getElementById('precio-total').innerText.replace(/[^0-9]/g, ''));
        
        const servicios = [];
        document.querySelectorAll('.servicio-check:checked').forEach(c => servicios.push(c.dataset.nombre));

        if (servicios.length === 0) {
            alert("Selecciona al menos un servicio para comprar.");
            return;
        }

        const producto = {
            id: Date.now(),
            nombre: `${marca} ${modelo} (${motor})`,
            servicios: servicios,
            precio: precioTotal
        };

        agregarAlCarrito(producto);
    }
});

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert("¡Producto añadido al carrito!");
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('cart-count');
    if (contador) contador.innerText = carrito.length;
}