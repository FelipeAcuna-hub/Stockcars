function mostrarResultado(auto) {
    // Actualizar HP y Torque en el HTML
    document.getElementById('hp-original').innerText = auto.specs.hp_orig;
    document.getElementById('hp-stage1').innerText = auto.specs.hp_stg1;
    
    // Actualizar precios de servicios extra
    document.getElementById('check-egr').dataset.price = auto.precios.egr_off;
    document.getElementById('check-dpf').dataset.price = auto.precios.dpf_off;
    
    // Si el auto no tiene DPF (ej. es bencinero), ocultar la opción
    const contenedorDPF = document.getElementById('contenedor-dpf');
    contenedorDPF.style.display = auto.precios.dpf_off > 0 ? 'flex' : 'none';

    updatePrice(); // Llamar a la función de suma que hicimos antes
}

const VEHICULOS = [
    {
        "marca": "Alfa Romeo",
        "modelo": "147",
        "año": "2001-2005",
        "motor": "2.0 TS",
        "combustible": "Bencina",
        "hp_orig": 150,
        "nm_orig": 181,
        "hp_stg1": 165,
        "nm_stg1": 200,
        "precio_st1": 200000,
        "precio_egr": 0,
        "precio_dpf": 0
    },
    {
        "marca": "Mitsubishi",
        "modelo": "ASX",
        "año": "2010-2015",
        "motor": "1.6 MIVEC",
        "combustible": "Bencina",
        "hp_orig": 115,
        "nm_orig": 154,
        "hp_stg1": 122,
        "nm_stg1": 160,
        "precio_st1": 180000,
        "precio_egr": 0,
        "precio_dpf": 0
    }
];
