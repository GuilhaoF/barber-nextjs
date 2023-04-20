import { Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";



export default function About() {
    return (
        <>
            <Head>
                <title>About</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Heading color='orange'>
                        Sobre Aplicacao
                    </Heading>
                </Flex>
            </Sidebar>
        </>
    )
}