import { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Spacer,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import DragBox from './DragBox';

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'center'}>
          <IconButton
            size={'md'}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <NavLink>1</NavLink>
              <NavLink>2</NavLink>
              <NavLink>3</NavLink>
            </HStack>
          </HStack>
          <Spacer />
          <Button
            colorScheme={'teal'}
            leftIcon={<AiOutlinePlus />}
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            Importa un altro progetto
          </Button>
        </Flex>
      </Box>
      <Modal motionPreset="slideInBottom" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Importa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DragBox />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setIsModalOpen(false)}
            >
              Annulla
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
