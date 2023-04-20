//tipagens do lado do servidor
// ?
import { GetServerSideProps,GetServerSidePropsContext,GetServerSidePropsResult } from "next";
import {destroyCookie, parseCookies} from 'nookies'
import { AuthTokenError } from "../services/errors/AuthTokenError";

// funcao com generic <>
export function canSSRAuth<P>(fn:GetServerSideProps<P>) {

    //tipagem do contexto (ctx:GetServerSidePropsContext)
    return async(ctx:GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> =>{

        //pegando o cookie
        const cookies = parseCookies(ctx)

        const token = cookies['@barber.token']

        //verificao de token
        if(!token) {
            return{
                redirect:{
                    destination: '/login',
                    permanent: false
                }
            }
        }

        try {
            return await fn(ctx)

        }catch (err) {
            //se o erro for do tipo AuthTokenError
            if(err instanceof AuthTokenError){
                destroyCookie(ctx,'@barber.token',{ path: '/'})
                return{
                    redirect:{
                        destination : '/',
                        permanent:false
                    }
                }
            }   
        }

    }

}