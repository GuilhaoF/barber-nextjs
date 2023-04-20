import Head from "next/head";
import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react'
import { Sidebar } from '../../components/sidebar'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { getStripeJs } from '../../services/stripe-js'
import { toast } from "react-toastify";

interface PlanosProps {
    premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {

    const [isMobile] = useMediaQuery('(max-width: 500px)')

    const handleSubscribe = async () => {
        if (premium) {
            return
        }
        try {
            const apiClient = setupAPIClient()
            const response = await apiClient.post('/subscribe')

            //pegando o session id do backend
            const { sessionId } = response.data

            const stripe = await getStripeJs()
            //redirecionando para o checkout com essa sessao de id
            await stripe.redirectToCheckout({ sessionId : sessionId })

        } catch (e) {
            console.error(e)
        }
    }
    /*funcao chamar,direcionar para portal de assinatura*/
    async function handleCreatePortal(){

        try{
            if(!premium){
                toast.error('Voce Nao e Premium!')
                return
            }
            const apiClient = setupAPIClient()
            const response = await apiClient.post('/create-portal')

            /* recebendo a sessionId para redirecionar o usuario*/
            const { sessionId } = response.data
            /* redirecionando o usuario para a url que ta recebendo do portal */
            window.location.href = sessionId

        }catch (e) {
            toast.error('Erro')
            console.error(e)
        }

    }

    return (
        <>
            <Head>
                <title>Planos</title>
            </Head>
            <Sidebar>

                <Flex w="100%" align="flex-start" justify="flex-start">
                    <Heading color="white" fontSize="3xl" mt={4} mb={4} mr={4}>
                        Planos
                    </Heading>
                </Flex>

                <Flex pb={8} maxW="800px" w="100%" align="flex-start" justify="flex-start" >

                    {/* Flex em Volta dos dois cards */}
                    <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"} >

                        {/** Card Plano Gratis */}
                        <Flex textAlign="center" rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                                color="gray.100"
                            >
                                Plano Grátis
                            </Heading>

                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Registrar cortes.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Criar apenas 3 modelos de corte.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Editar dados do perfil.</Text>
                        </Flex>

                        {/** Card Plano Premium **/}
                        <Flex textAlign="center" rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading
                                textAlign="center"
                                fontSize="2xl"
                                mt={2} mb={4}
                                color="#31fb6a"
                            >
                                Premium
                            </Heading>

                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Registrar cortes ilimitados.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Criar modelos ilimitados.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Editar modelos de corte.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Editar dados do perfil.</Text>
                            <Text color="white" fontWeight="medium" ml={4} mb={2}>* Receber todas atualizações.</Text>
                            <Text color="#31fb6a" fontWeight="bold" fontSize="2xl" ml={4} mb={2}>R$ 9.99</Text>

                            <Button
                                bg={premium ? "transparent" : "button.cta"}
                                m={2}
                                color="white"
                                onClick={handleSubscribe}
                                disabled={premium}
                            >
                                {premium ? ("Voce e Premium") : ("Assinar")}
                            </Button>

                            {premium && (
                                <Button
                                    m={2}
                                    bg="white"
                                    color="barber.900"
                                    fontWeight="bold"
                                    onClick={handleCreatePortal}
                                >
                                    Alterar Assinatura
                                </Button>

                            )}

                        </Flex>

                    </Flex>
                </Flex>
            </Sidebar>

        </>
    )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/me')

        return {
            props: {
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }
    }
    catch (err) {
        console.log(err)

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }

    }
})