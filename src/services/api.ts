import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../context/AuthContext";

export function setupAPIClient(ctx = undefined) {
    //pegar os cookies
    let cookies = parseCookies(ctx);

    //criando conexao com api e passando metodos
    const api = axios.create({
        //pegando url do .env
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        //incluindo no cabecalho o token do usuario para acesso das rotas logadas
        headers: {
            //pegar cookie e incluir no autorization
            //inclui o token do usuario nas rotas
            // cookies [ nome do cookie ]
            Authorization: `Bearer ${cookies["@barber.token"]}`,
        },
    });
    //midllewares
    api.interceptors.response.use((response) => {
        return response;
        //se der erro ele executa uma funcao
        // funcao de signOut que vem do context api
    }),
        (error: AxiosError) => {
            //verifica se status do erro e 401(not autorization)
            //se for chama a funcao de deslogar
            if (error.response.status === 401) {
                if (typeof window !== undefined) {
                    signOut();
                } else {
                    //retornando erro do token de autenticacao
                    return Promise.reject(new AuthTokenError());
                }
            }
            return Promise.reject(error);
        };

    return api;
}
