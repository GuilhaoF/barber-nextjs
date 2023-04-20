//erro de token e mostrando a mensagem
export class AuthTokenError extends Error {
    constructor(){
        super('Error with authentication token');
    }
}