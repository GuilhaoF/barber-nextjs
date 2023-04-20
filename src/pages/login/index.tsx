import { Center, Flex, Input, Button, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Head from 'next/head'
import LogoImg from '../../../public/Logo.svg'
import Link from 'next/link'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from 'react'
import { canSSRGuest } from '../../utils/canSSRGuest'

export default function Login() {

    const { signIn } = useContext(AuthContext)

    //estados
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin() {

        if (email === '' || password === '') {
            return;
        }
        //chamando funcao do contexto e passando email e password
        await signIn({
            email, password
        })
    }

    return (
        <>
            <Head>
                <title>BarberPro - Login</title>
            </Head>
            <Flex bg="barber.900" justifyContent="center" alignItems="center" height="100vh">
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center p={4}>
                        <Image
                            src={LogoImg}
                            quality={100}
                            width={240}
                            objectFit='fill'
                            alt='logo barber'
                        />
                    </Center>
                    <Input
                        variant="filled"
                        type="email"
                        bg="barber.400"
                        color="barber.100"
                        placeholder="email@email.com"
                        mb={4}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        variant="filled"
                        type="password"
                        bg="barber.400"
                        placeholder="*******"
                        mb={3}
                        color="barber.100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        bg="button.cta"
                        mt={4}
                        color="button.gray"
                        size="lg"
                        _hover={{ bg: "#ffb13e" }}
                        onClick={handleLogin}
                    >
                        Acessar Sistema
                    </Button>
                    <Center mt={2}>
                        <Link href="/register">
                            <Text color="barber.100" cursor="pointer">
                                Ainda nao possui conta?
                                <strong>Cadastre-se</strong>
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