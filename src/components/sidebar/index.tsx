import { ReactNode } from 'react'
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useColorModeValue,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiScissors, FiClipboard, FiSettings, FiInfo, FiMenu } from 'react-icons/fi'
import Link from 'next/link'


interface LinkItemProps {
    name: string
    icon: IconType
    route: string
}

//criando um array de links 
//facil manutencao futuramente
const LinkItems: Array<LinkItemProps> = [
    { name: 'Agenda', icon: FiScissors, route: '/dashboard' },
    { name: 'Cortes', icon: FiClipboard, route: '/haircuts' },
    { name: 'Minha Conta', icon: FiSettings, route: '/profile' },
    { name: 'Sobre', icon: FiInfo, route: '/about' },
]

export function Sidebar({ children }: { children: ReactNode }) {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Box minH="100vh" bg="barber.900">

            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                size='full'
                onClose={onClose}
                closeOnEsc={true}
                onOverlayClick={onClose}
                returnFocusOnClose={false}
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p={4}>
                {children}
            </Box>
        </Box>
    )
}
//interface sidebarprops extendendo com as de boxprops + function onClose
interface SidebarProps extends BoxProps {
    onClose: () => void
}
//conteudo da sidebar
const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            bg="barber.400"
            borderRight="1px"
            //é um gancho React usado para alterar qualquer valor ou estilo com base no modo de cor
            //São necessários 2 argumentos: o valor no modo claro e o valor no modo escuro.
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos='fixed'
            h='full'
            {...rest}
        >
            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href="/dashboard">
                    <Flex cursor="pointer" userSelect='none' flexDirection="row">
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Barber</Text>
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">PRO</Text>
                    </Flex>
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color='white'/>
            </Flex>

            {LinkItems.map(link => (
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    {link.name}
                </NavItem>
            ))}

        </Box>
    )
}
//tipagem de Itens 
interface NavItemProps extends FlexProps {
    icon: IconType
    children: ReactNode
    route: string
}
const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
    return (
        <Link href={route} style={{ textDecoration: 'none' }}>
            <Flex
                alignItems="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                color="white"
                _hover={{
                    bg: 'barber.900',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr={4}
                        fontSize="16"
                        as={icon}
                        _groupHover={{
                            color: 'white'
                        }}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}
//tipagem mobile
interface MobileProps extends FlexProps {
    onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg='barber.400'
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                textColor='white'
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Flex flexDirection="row">
                <Text ml={8} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
                    Barber
                </Text>
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="button.cta">
                    PRO
                </Text>
            </Flex>
        </Flex>
    )
}
