// src/types/IUser.ts
// Interface de Usuario

/**
 * Define los posibles roles que un usuario puede tener en la aplicación.
 * Esto ayuda a TypeScript a garantizar que solo se usen estos valores.
 */
export type UserRole = 'admin' | 'cliente'; // Basado en la documentación 

/**
 * Interface que define la estructura de un objeto de Usuario.
 * Estos son los datos que se esperan del backend después del login
 * y que se almacenarán en localStorage. [cite: 130, 131, 132, 133]
 */
export interface IUser {
    /** Identificador único del usuario */
    id: number; // 
    
    /** Nombre completo del usuario */
    name: string; // 
    
    /** Correo electrónico del usuario (se usa para el login) */
    email: string; // 
    
    /** Rol del usuario ('admin' o 'cliente') */
    role: UserRole; // 
}

// Nota: Puedes exportar IUser y UserRole para usarlos en cualquier parte del proyecto.