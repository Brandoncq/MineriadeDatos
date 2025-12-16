// src/utils/constants.js

export const POSTULA_YEAR = 2025;

// Mapeo de Dificultad
export const DIFFICULTY_OPTIONS = [
    { value: "", label: "Selecciona tu Facultad / Carrera", difficulty: 0 },

    // --- NIVEL 5: "LAS DIFÍCILES" (Civil, Sistemas, Mecánica) ---
    { 
        value: "FACULTAD_C", 
        label: "FIC - Ingeniería Civil (Dif. 5)", 
        difficulty: 5 
    },
    { 
        value: "FACULTAD_I", 
        label: "FIIS - Ing. Sistemas / Industrial / Software (Dif. 5)", 
        difficulty: 5 
    },
    { 
        value: "FACULTAD_M", 
        label: "FIM - Ing. Mecánica / Mecatrónica / Naval (Dif. 5)", 
        difficulty: 5 
    },

    // --- NIVEL 4: ALTA EXIGENCIA (Electrónica, Minas) ---
    { 
        value: "FACULTAD_L", 
        label: "FIEE - Ing. Eléctrica / Electrónica / Telecom. (Dif. 4)", 
        difficulty: 4 
    },
    { 
        value: "FACULTAD_G", 
        label: "FIGMM - Ing. Minas / Geológica / Metalúrgica (Dif. 4)", 
        difficulty: 4 
    },

    // --- NIVEL 3: NIVEL MEDIO (Arquitectura, Eco, Ambiental) ---
    { 
        value: "FACULTAD_A", 
        label: "FAUA - Arquitectura (Dif. 3)", 
        difficulty: 3 
    },
    { 
        value: "FACULTAD_E", 
        label: "FIEECS - Ing. Económica / Estadística (Dif. 3)", 
        difficulty: 3 
    },
    { 
        value: "FACULTAD_S", 
        label: "FIA - Ing. Ambiental / Sanitaria / Higiene (Dif. 3)", 
        difficulty: 3 
    },

    // --- NIVEL 2: ACCESIBLES (Química, Ciencias, Petróleo) ---
    { 
        value: "FACULTAD_Q", 
        label: "FIQT - Ing. Química / Textil (Dif. 2)", 
        difficulty: 2 
    },
    { 
        value: "FACULTAD_N", 
        label: "FC - Física / Matem. / Comp. Científica / Ing. Fís. (Dif. 2)", 
        difficulty: 2 
    },
    { 
        value: "FACULTAD_P", 
        label: "FIP - Ing. Petróleo / Petroquímica (Dif. 2)", 
        difficulty: 2 
    },
];

// Mapeo de Asistencia (Visual -> Numérico)
export const ASISTENCIA_MAP = [
    { value: "BAJA", label: "Baja (< 70%)", numeric: 0.65 },
    { value: "MEDIA", label: "Media (70% - 85%)", numeric: 0.78 },
    { value: "ALTA", label: "Alta (85% - 95%)", numeric: 0.9 },
    { value: "PERFECTA", label: "Perfecta (> 95%)", numeric: 0.98 },
];

export const getNumericAssistance = (categoryValue) => {
    const item = ASISTENCIA_MAP.find((i) => i.value === categoryValue);
    return item ? item.numeric : 0.9;
};