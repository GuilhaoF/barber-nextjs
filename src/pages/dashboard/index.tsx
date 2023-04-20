import { Button, Flex, Heading, Text, useMediaQuery, Link as ChakraLink, useDisclosure, } from "@chakra-ui/react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";

import Link from 'next/link';
import { IoMdPerson } from 'react-icons/io'
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import { ModalInfo } from "../../components/modal";
import { toast } from "react-toastify";

export interface ScheduleItem {
    id: string;
    customer: string;
    haircut: {
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}

interface DashboardProps {
    schedule: ScheduleItem[]
}

export default function Dashboard({ schedule }: DashboardProps) {

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    //estado da lista de agendados(schedule)
    const [listSchedule, setListSchedule] = useState(schedule)

    const [service, setService] = useState<ScheduleItem>()

    //estados do modal,funcoes a passar
    const { isOpen, onOpen, onClose } = useDisclosure();

    //funcao de abrir o modal
    /* clica no item(schedules) e abre o modal,alterando estado com setService */
    function handleOpenModal(item: ScheduleItem) {
        setService(item);
        onOpen();
    }
    //funcao para finalizar servico 
    // recebe id para finalizar 
    async function handleFinishService(id: string) {
        try {
            const apiClient = setupAPIClient()
            //passando o params schedule_id que contem o id do cliente selecionado
            await apiClient.delete('/schedule', {
                params: {
                    schedule_id: id,
                }
            })

            //filtrando lista de agendados
            const filterItem = listSchedule.filter(item => {
                return (item?.id !== id)
            })
            //atualizando a lista de agendados
            setListSchedule(filterItem)
            onClose()


        } catch (err) {
            console.log(err);
            onClose();
            toast.error('Erro ao Finalizar');

        }
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex w="100%" direction="row" align="center" justifyContent="flex-start">
                        <Heading fontSize="3xl" mt={4} mb={4} mr={4} color='orange'>
                            Agenda
                        </Heading>
                        <Link href="/new">
                            <Button>Registrar Cliente</Button>
                        </Link>
                    </Flex>
                    {
                        listSchedule.map(item => (
                            <ChakraLink
                                key={item.id}
                                onClick={() => handleOpenModal(item)}
                                w="100%"
                                p={0}
                                m={0}
                                mt={1}
                                bg="transparent"
                                style={{ textDecoration: 'none' }}
                            >
                                <Flex
                                    w="100%"
                                    direction={isMobile ? "column" : "row"}
                                    p={4}
                                    rounded={4}
                                    mb={4}
                                    bg="barber.400"
                                    justify="space-between"
                                    align={isMobile ? "flex-start" : "center"}
                                >
                                    <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                        <IoMdPerson size={28} color="#f1f1f1" />
                                        <Text fontWeight="bold" ml={4} color='white' noOfLines={1}>{item?.customer}</Text>
                                    </Flex>
                                    <Text color="white" fontWeight="bold" mb={isMobile ? 2 : 0}>{item?.haircut?.name}</Text>
                                    <Text color="white" fontWeight="bold" mb={isMobile ? 2 : 0}>R$ {item?.haircut?.price}</Text>
                                </Flex>
                            </ChakraLink>
                        ))}

                </Flex>
            </Sidebar>

            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                //recebendo os dados do customer
                data={service}
                finishService={() => handleFinishService(service?.id)}
            />
        </>
    )
}

//roda do lado do servidor
// verificacao de token (server-side)
export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx)
        const response = await apiClient.get('/schedule')

        return {
            props: {
                schedule: response.data
            }
        }

    } catch (err) {
        //se der erro a lista na pagina aparecera vazia(schedule[])
        console.error(err)
        return {
            props: {
                schedule: []
            }
        }

    }

})
