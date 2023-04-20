import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex,
} from '@chakra-ui/react'

import { FiUser, FiScissors } from 'react-icons/fi'
import { FaMoneyBillAlt } from 'react-icons/fa'

//importando a tipagem do item
import { ScheduleItem } from '../../pages/dashboard'

//typagem do modal
interface ModalInfoProps {
    isOpen: boolean
    onClose: () => void
    onOpen: () => void
    data: ScheduleItem //recebendo os dados do dashboard,tipagem schedule
    finishService: () => Promise<void>;
}

export function ModalInfo({ isOpen, onClose, data, finishService, onOpen }: ModalInfoProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            motionPreset='slideInBottom'
            closeOnEsc
        >
            <ModalOverlay />
            <ModalContent bg="barber.400">
                <ModalHeader textAlign='center' color='white'>Finalizar Servico</ModalHeader>
                <ModalCloseButton color='white' />
                <ModalBody style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    <Flex align="center" mb={3}>
                        <FiUser size={28} color="#FFB13e" />
                        <Text ml={3} fontSize="large" fontWeight="bold" color="white">
                            {data?.customer}
                        </Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FiScissors size={28} color="#FFF" />
                        <Text ml={3} fontSize="large" fontWeight="bold" color="white">
                            {data?.haircut?.name}
                        </Text>
                    </Flex>

                    <Flex align="center" mb={3}>
                        <FaMoneyBillAlt size={28} color="#46ef75" />
                        <Text ml={3} fontSize="large" fontWeight="bold" color="white">
                            R$ {data?.haircut?.price}
                        </Text>
                    </Flex>

                    <ModalFooter>
                        <Button
                            bg="button.cta"
                            _hover={{ bg: '#FFb13e' }}
                            color="#FFF"
                            mr={3}
                            onClick={() => finishService()}
                        >
                            Finalizar Serviço
                        </Button>
                    </ModalFooter>

                </ModalBody>
            </ModalContent>
        </Modal>
    )
}