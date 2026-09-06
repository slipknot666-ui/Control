export const CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Sueldo', 'Otros'] as const
export type Category = (typeof CATEGORIES)[number]