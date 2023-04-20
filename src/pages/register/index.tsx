import { useContext, useState } from 'react'
import { Button, Center, Flex, Input, Text } from '@chakra-ui/react'
import Head from 'next/head'
import Image from 'next/image';
import logoImg from '../../../public/logo.svg'
import Link from 'next/link';
import { AuthContext } from '../../context/AuthContext';
import { canSSRGuest } from '../../utils/canSSRGuest';


export default function Register() {

    const { signUp } = useContext(AuthContext)

    //estados 
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleRegister() {
        if (name === '' && email === '' && password === '') {
            return;
        }
        //chamando funcao de cadastro
        await signUp({ name, email, password })
    }

    return (
        <>
            <Head>
                <title>Crie sua conta no BarberPro</title>
            </Head>
            <Flex bg="barber.900" justifyContent="center" alignItems="center" height="100vh">
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center p={4}>
                        <Image
                            src={logoImg}
                            quality={100}
                            width={240}
                            objectFit="fill"
                            alt="Logo barberpro"
                        />
                    </Center>

                    <Input
                        background="barber.400"
                        color="barber.100"
                        variant="filled"
                        size="lg"
                        placeholder="Nome da barbearia"
                        type="text"
                        mb={3}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        color="barber.100"
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="email@email.com"
                        type="email"
                        mb={3}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        color="barber.100"
                        background="barber.400"
                        variant="filled"
                        size="lg"
                        placeholder="********"
                        type="password"
                        mb={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        onClick={handleRegister}
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        size="lg"
                        _hover={{ bg: "#ffb13e" }}
                    >
                        Cadastrar
                    </Button>
                    <Center mt={2}>
                        <Link href="/login">
                            <Text color="barber.100" cursor="pointer">
                                Já possui uma conta?
                                <strong>Faça login</strong>
                            </Text>
                        </Link>
                    </Center>
                </Flex>
            </Flex>
        </>
    )

}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return{
      props: {}
    }
  })