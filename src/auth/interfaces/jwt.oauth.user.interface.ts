enum UserRole {
    ADMINISTRADOR = 'ADMINISTRADOR',
    EMPLEADO = 'EMPLEADO',
}

export interface JwtOAuthUser {
    id: string;
    email: string;
    names: string;
    lastNames: string;
    role: UserRole;
}
