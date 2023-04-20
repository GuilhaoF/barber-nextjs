import { createContext, ReactNode, useEffect, useState } from 'react'
// destruir os cookies do usuario quando tambem for deslogar
//setCookie - atualizar e pegar ps cookies
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiClient'
import { toast } from 'react-toastify'



//tipagem dos dados do contexto
interface AuthContextData {
    user: UserProps
    isAuthenticated: boolean
    signIn: (credentials: SignInProps) => Promise<void>
    signUp: (credentials: SignUpProps) => Promise<void>
    logoutUser: () => Promise<void>
}
//tipagem dos dados do usuario que vira da api
interface UserProps {
    id: string
    name: string
    email: string
    endereco: string | null
    subscriptions?: SubscriptionProps | null
}
interface SubscriptionProps {
    id: string
    status: string
}
type AuthProviderProps = {
    children: ReactNode
}
//tipagem params da funcao
interface SignInProps {
    email: string
    password: string
}
interface SignUpProps {
    name: string
    email: string
    password: string
}
//exportando contexto e dizendo sua typagem(interface)
export const AuthContext = createContext({} as AuthContextData)

// funcao para deslogar e excluir cookie do usuario
export function signOut() {
    console.error('Error Logout')

    try {
        //destroindo cookie(mesmo nome passado na api) e token
        destroyCookie(null, '@barber.token', { path: '/' })
        //mandando para tela de login
        Router.push('/login')
    } catch (err) {
        toast.error(err)
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    //estado de usuario com sua tipagem da interface UserProps
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user

    //observando se existe o cookie e se e valido
    useEffect(() => {
        //pegando cookie(nome do cookie dado) e colocando na variavel token
        const { '@barber.token': token } = parseCookies()

        if (token) {
            api.get('/me').then(response => {
                //pegando os dados
                const { id, name, endereco, email, subscriptions } = response.data
                setUser({
                    id,
                    name,
                    email,
                    endereco,
                    subscriptions
                })
            })
                .catch(() => {
                    signOut()
                })
        }
    }, [])

    //funcao de login recebendo credentials email e password tipo SignInProps
    async function signIn({ email, password }: SignInProps) {

        try {
            //rota de login
            const response = await api.post("/session", {
                email, password
            })
            //desestruturando e pegando os dados da resposta
            const { id, name, token, subscriptions, endereco } = response.data

            //atualizando o cookie,salvar cookie
            //undefined porque nao tem contexto apenas no back
            //cookie - token
            setCookie(undefined, '@barber.token', token, {
                maxAge: 60 * 60 * 24 * 30,//expirar em um 1 mes
                path: '/' //todos os caminhos teram acesso a esse cookie
            })
            setUser({
                id,
                name,
                subscriptions,
                endereco,
                email
            })
            //headers vai receber o token do usuario do tipo autorization
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            toast.success(`Seja bem vindo ${name}`)

            //redirecionando usuario para tela de dashboard
            Router.push('/dashboard')

        } catch (err) {
            toast.error(err)
            console.error('erro ao entrar')
        }

    }

    //funcao de signUp
    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name, email, password
            })
            toast.success('Barbearia Cadastrada com Sucesso')
            Router.push('/login')
        }
        catch (err) {
            toast.error(err)
        }
    }
    //funcao de logout usuario
    async function logoutUser() {
        try {
            //destroindo cookie do usuario logado
            destroyCookie(null, '@barber.token', { path: '/' })
            toast.success('Deslogado!')
            Router.push('/login')
            setUser(null)
        }
        catch (err) {
            toast.error(err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}