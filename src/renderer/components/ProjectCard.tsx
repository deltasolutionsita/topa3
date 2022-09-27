import {
  Box,
  Center,
  Text,
  Stack,
  Button,
  useColorModeValue,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { commandsExecuted } from 'renderer/toasts';
import { FiSettings } from "react-icons/fi";
import { useContext } from 'react';
import { GitterContext } from './gitter/GitterProvider';

interface ProjectCardProps {
  project: { dir: string; commands: string };
  parsedDir: string;
  openModal: () => void
}

export default function ProjectCard({ project, parsedDir, openModal }: ProjectCardProps) {
  const [gitterElements, setGitterElements] = useContext(GitterContext)

  return (
    <Center py={6}>
      <Box
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <>
          <Stack
            textAlign={'center'}
            p={6}
            color={useColorModeValue('gray.800', 'white')}
            align={'center'}
          >
            <Text
              fontSize={'sm'}
              fontWeight={500}
              bg={useColorModeValue('teal.50', 'teal.900')}
              p={2}
              px={3}
              color={'teal.500'}
              rounded={'full'}
            >
              JS
            </Text>
            <Stack direction={'row'} align={'center'} justify={'center'}>
              <Text fontSize={'4xl'} fontWeight={800}>
                {parsedDir}
              </Text>
            </Stack>
          </Stack>

          <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
            <HStack>
            <Button
              w={'full'}
              bg={'teal.400'}
              color={'white'}
              rounded={'xl'}
              boxShadow={'0 5px 20px 0px rgb(0 128 128 / 43%)'}
              _hover={{
                bg: 'teal.500',
              }}
              _focus={{
                bg: 'teal.600',
              }}
              onClick={() => {
                window.electron.ipcRenderer
                  .invoke('start-shell', [project])
                  .then((r) => {
                    if (r.message === 'ok') {
                      commandsExecuted();
                      setGitterElements([
                        ...gitterElements,
                        {
                          changedFiles: [],
                          parsedDir,  
                          project
                        }
                      ])
                    } else alert(r.message);
                  })
                  .catch((e) => alert(e));
              }}
            >
              Avvia
            </Button>
            <IconButton icon={<FiSettings />} aria-label={'Impostazioni'} onClick={() => openModal()} />
            </HStack>
          </Box>
        </>
      </Box>
    </Center>
  );
}
