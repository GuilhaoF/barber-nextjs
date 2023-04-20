import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";

import Link from "next/link";
//verificador server side render
import { canSSRAuth } from "../../utils/canSSRAuth";
//contexto
import { AuthContext } from "../../context/AuthContext";
//setup da api
import { setupAPIClient } from "../../services/api";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

//typagem de user
interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string;
}
interface ProfileProps {
  user: UserProps;
  premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);

  //criando os estados e recebendo os dados do servidor,preenchendo os campos ja
  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(
    user?.endereco ? user?.endereco : ""
  );

  async function handleLogout() {
    await logoutUser();
  }
  //funcao para atualizar usuario
  async function handleUpdateUser() {
    if (name === "") {
      return;
    }
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/users", {
        name: name,
        endereco: endereco,
      });
      toast.success("Dados Alterados com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar dos dados");
      console.log(err);
    }
  }
  return (
    <>
      <Head>
        <title>Minha Conta - BarberPRO</title>
      </Head>
      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Minha Conta
            </Heading>
          </Flex>

          <Flex
            pt={8}
            pb={8}
            background="barber.400"
            maxW="700px"
            w="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Nome da barbearia:
              </Text>
              <Input
                w="100%"
                bg="barber.400"
                color="barber.100"
                placeholder="Nome da sua barbearia"
                size="lg"
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Endereço:
              </Text>
              <Input
                w="100%"
                bg="barber.400"
                color="barber.100"
                placeholder="Endereço da barbearia"
                size="lg"
                type="text"
                mb={3}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />

              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                Plano atual:
              </Text>

              <Flex
                direction="row"
                w="100%"
                mb={3}
                p={1}
                borderWidth={1}
                rounded={6}
                background="barber.900"
                alignItems="center"
                justifyContent="space-between"
              >
                {/* renderizacao condicional do plano */}
                <Text
                  p={2}
                  fontSize="lg"
                  color={premium ? "#fba931" : "#4dffb4"}
                >
                  Plano {premium ? "Premium" : "Gratis"}
                </Text>

                <Link href="/planos">
                  <Box
                    cursor="pointer"
                    p={1}
                    pl={2}
                    pr={2}
                    background="#00cd52"
                    rounded={4}
                    color="white"
                  >
                    Mudar plano
                  </Box>
                </Link>
              </Flex>

              <Button
                w="100%"
                mt={3}
                mb={4}
                bg="button.cta"
                size="lg"
                _hover={{ bg: "#ffb13e" }}
                onClick={handleUpdateUser}
              >
                Salvar
              </Button>

              <Button
                w="100%"
                mb={6}
                bg="transparent"
                borderWidth={2}
                borderColor="red.500"
                color="red.500"
                size="lg"
                _hover={{ bg: "transparent" }}
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    //trazendo api client e passando contexto
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    //pegando os dados de user da req e passando pro objeto
    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      endereco: response.data?.endereco,
    };
    //retornando as props no SSR
    return {
      props: {
        user: user,
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
