import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Stack,
  Switch
} from '@chakra-ui/react'

import { Sidebar } from '../../components/sidebar'
import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'

import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';

import { toast } from 'react-toastify';

//tipagem do haircut
interface HaircutProps {
  id: string
  name: string
  price:string | number
  status: boolean
  user_id: string
}
//tipagem da subscription
interface SubscriptionProps {
  id: string
  status: string
}
interface EditHaircutProps {
  haircut: HaircutProps
  subscription: SubscriptionProps | null
}


export default function EditHaircut({ subscription, haircut }: EditHaircutProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)")
 
  //estados do input / o que a api recebe,pede
  const [name, setName] = useState(haircut?.name)
  const [price, setPrice] = useState(haircut?.price)
  const [status, setStatus] = useState(haircut?.status)
  
  //estado so switch
  const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled" : "enabled")

  function handleChangeStatus(e:ChangeEvent<HTMLInputElement>) {
    if(e.target.value === "disabled") {
      setDisableHaircut("enabled")
      setStatus(false)
    }else{
      setDisableHaircut("disabled")
      setStatus(true)
    }

  }
  
  async function handleUpdate(){
    if(name === '' || price === ''){
      toast.error('Digite os Dados')
      return;
    }
    try{
      const apiClient = setupAPIClient()
      //req de update do corte 
      // params a serem passados
      await apiClient.put('/haircut',{
        name: name,
        price: Number(price),
        status: status,
        haircut_id: haircut?.id
      })
      toast.success('Corte Atualizado')

    }catch(err){
      console.error(err)
    }
  }

  return (
    <>
      <Head>
        <title>Editando modelo de corte - BarberPRO</title>
      </Head>
      <Sidebar>
        <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={isMobile ? 4 : 0}
          >
            <Link href="/haircuts">
              <Button _hover={{ bg: false }} bg="barber.400" mr={3} p={4} display="flex" alignItems="center" justifyContent="center">
                <FiChevronLeft size={24} color="#FFF" />
                <Text color="#FFF">Voltar</Text>
              </Button>
            </Link>

            <Heading fontSize={isMobile ? "22px" : "3xl"} color="white">
              Editar corte
            </Heading>
          </Flex>

          <Flex mt={4} maxW="700px" pt={8} pb={8} w="100%" bg="barber.400" direction="column" align="center" justify="center">
            <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4}>Editar corte</Heading>

            <Flex w="85%" direction="column">
              <Input
                placeholder="Nome do corte"
                mb={3}
                color="white"
                size="lg"
                type="text"
                w="100%"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Valor do seu corte ex 45.90"
                mb={3}
                color="white"
                size="lg"
                type="number"
                w="100%"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Stack mb={6} align="center" direction="row">
                <Text fontWeight="bold" color="white">Desativar corte ?</Text>
                <Switch
                  size="lg"
                  colorScheme="red"
                  //valor do state
                  value={disableHaircut}
                  //verificando o estado de check
                  isChecked={disableHaircut === 'disabled' ? false : true}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                />
              </Stack>

              <Button
                mb={6}
                w="100%"
                bg="button.cta"
                color="gray.900"
                _hover={{ bg: "#FFB13e" }}
                disabled={subscription?.status !== 'active'}
                onClick={handleUpdate}
              >
                Salvar
              </Button>
          
              {
                subscription?.status !== 'active' && (
                  <Flex direction="row" align="center" justify="center">
                    <Link href="/planos">
                      <Text cursor="pointer" fontWeight="bold" mr={1} color="#31fb6a">
                        Seja premium
                      </Text>
                    </Link>
                    <Text color="white">
                      e tenha todos acessos liberados.
                    </Text>
                  </Flex>
                )}

            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  //pegando o parametro(id)
  const { id } = ctx.params
  try {
    const apiClient = setupAPIClient(ctx)

    const check = await apiClient.get('/haircut/check')
    //pegando os detalhes do corte , passando params (haircut_id)
    const response = await apiClient.get('/haircut/detail', {
      params: {
        haircut_id: id,
      }
    })

    return {
      props: {
        haircut: response.data,
        subscription: check.data?.subscriptions
      }
    }


  } catch (err) {
    console.error(err)
    return {
      redirect: {
        destination: '/haircuts',
        permanent: false
      }
    }
  }
})