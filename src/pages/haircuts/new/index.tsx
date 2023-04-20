import { Button, Flex, Heading, Input, useMediaQuery, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { Sidebar } from "../../../components/sidebar";


import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";


interface NewHaircutProps {
    subscription: boolean;
    count: number
}

export default function NewHaircut({ subscription, count }: NewHaircutProps) {
    //hook de mediaquery
    const [isMobile] = useMediaQuery("(max-width: 500px)");

    /** estados */
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    
    async function handleRegister() {

        if (name === '' || price === '') {
            toast.info('Passe Todos os Dados')
            return;
        }
        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price),
            })

            Router.push("/haircuts")
            toast.success('Corte Cadastrado')

        } catch (err) {
            toast.error('Erro')
            console.log(err);
        }
    }

    return (
        <>
            <Head>
                <title>BarberPro -Novo Modelo de Corte</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex
                        direction={isMobile ? "column" : "row"}
                        w="100%"
                        align={isMobile ? "flex-start" : "center"}
                        mb={isMobile ? 4 : 0}
                    >
                        <Link href="/haircuts">
                            <Button
                                p={4}
                                display="flex"
                                alignItems="center"
                                justifyItems="center"
                                mr={4}
                                bg="barber.400"
                                _hover={{ bg: false }}
                            >
                                <FiChevronLeft size={24} color="#FFF" />
                                <Text color="#FFF">Voltar</Text>
                            </Button>
                        </Link>
                        <Heading
                            color="orange.900"
                            mt={4}
                            mb={4}
                            mr={4}
                            fontSize={isMobile ? "28px" : "3xl"}
                        >
                            Modelos de Corte
                        </Heading>
                    </Flex>
                    <Flex
                        maxW="700px"
                        color="white"
                        w="100%"
                        align="center"
                        justify="center"
                        pt={8}
                        pb={8}
                        direction="column"
                    >
                        <Heading
                            mb={4}
                            fontSize={isMobile ? "22px" : "3xl"}
                            color="white"
                        >
                            Cadastrar Corte
                        </Heading>

                        <Input
                            placeholder="Nome do corte"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={3}
                            value={name}
                            onChange={(e) => setName(e.target.value)}

                        />

                        <Input
                            placeholder="Valor do corte ex: 59.90"
                            size="lg"
                            type="text"
                            w="85%"
                            bg="gray.900"
                            mb={4}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}

                        />

                        <Button
                            onClick={handleRegister}
                            w="85%"
                            size="lg"
                            color="gray.900"
                            mb={6}
                            bg="button.cta"
                            _hover={{ bg: "#FFb13e" }}
                            disabled={!subscription && count >= 3}
                        >
                            Cadastrar
                        </Button>
                        {/** Renderizacao Condicional conforme os dados que vinher do servidor(ssr) */}
                        {!subscription && count >= 4 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text>
                                    Você atingiu seu limite de corte.
                                </Text>
                                <Link href="/planos">
                                    <Text fontWeight="bold" color="#31FB6A" cursor="pointer" ml={1}>
                                        Seja premium
                                    </Text>
                                </Link>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Sidebar>

        </>
    )
}
/** SSR AUTH */
export const getServerSideProps = canSSRAuth(async (ctx) => {
    //try - tentar fazer as requisicoes
    try {
        const apiClient = setupAPIClient(ctx)

        const response = await apiClient.get('/haircut/check')
        const count = await apiClient.get('/haircut/count')

        //retornar em forma de propriedade
        return {
            props: {
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
            }
        }
    } catch (err) {
        console.error(err)

        return {
            redirect: {
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})