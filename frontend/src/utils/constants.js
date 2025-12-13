// src/utils/constants.js

export const POSTULA_YEAR = 2025;

// Mapeo de Dificultad
export const DIFFICULTY_OPTIONS = [
    { value: "", label: "Selecciona una carrera", difficulty: 3 },
    { value: "FACULTAD_C", label: "Ingeniería Civil (Dif. 5)", difficulty: 5 },
    { value: "FACULTAD_I", label: "Ing. Sistemas/Industrial (Dif. 5)", difficulty: 5 },
    { value: "FACULTAD_M", label: "Ing. Mecánica (Dif. 5)", difficulty: 5 },
    { value: "FACULTAD_L", label: "Ing. Eléctrica/Telecom (Dif. 4)", difficulty: 4 },
    { value: "FACULTAD_G", label: "Ing. Minas/Metalúrgica (Dif. 4)", difficulty: 4 },
    { value: "FACULTAD_A", label: "Arquitectura (Dif. 3)", difficulty: 3 },
    { value: "FACULTAD_E", label: "Economía (Dif. 3)", difficulty: 3 },
    { value: "FACULTAD_Q", label: "Ing. Química (Dif. 2)", difficulty: 2 },
    { value: "FACULTAD_N", label: "Ciencias (Fís/Mat) (Dif. 2)", difficulty: 2 },
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