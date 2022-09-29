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
import { commandsExecuted, shellKilled } from 'renderer/toasts';
import { FiSettings } from 'react-icons/fi';
import { useContext, useState } from 'react';
import { GitterContext } from './gitter/GitterProvider';
import { deleteTerminal, voidState } from 'renderer/redux/terminalOutput';
import { useDispatch } from 'react-redux';
import { TSContext } from 'renderer/providers/TerminalShown';

interface ProjectCardProps {
  project: { dir: string; commands: string };
  parsedDir: string;
  openModal: () => void;
}

export default function ProjectCard({
  project,
  parsedDir,
  openModal,
}: ProjectCardProps) {
  const [gitterElements, setGitterElements] = useContext(GitterContext);
  const [, setTerminalShown, , setDrawerShown] = useContext(TSContext);
  const [isShellStarted, setIsShellStarted] = useState(false);
  const dispatch = useDispatch();

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
              <Text fontSize={'4xl'}>
                {parsedDir}
              </Text>
            </Stack>
          </Stack>

          <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
            <HStack>
              {!isShellStarted ? (
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
                          setIsShellStarted(true);
                          setGitterElements([
                            ...gitterElements,
                            {
                              changedFiles: [],
                              parsedDir,
                              project,
                            },
                          ]);
                        } else alert(r.message);
                      })
                      .catch((e) => alert(e));
                  }}
                >
                  Avvia
                </Button>
              ) : (
                <Button
                  w={'full'}
                  bg={'red.400'}
                  color={'white'}
                  rounded={'xl'}
                  boxShadow={'0 5px 20px 0px rgb(236 0 0 / 43%)'}
                  _hover={{
                    bg: 'red.500',
                  }}
                  _focus={{
                    bg: 'red.600',
                  }}
                  onClick={() => {
                    window.electron.ipcRenderer
                      .invoke('kill-shell', [parsedDir])
                      .then(({ message, length }) => {
                        if (message === 'ok') {
                          dispatch(deleteTerminal({ name: parsedDir }));
                          shellKilled(parsedDir);
                          setIsShellStarted(false);
                          setGitterElements((state) =>
                            state.filter(
                              (element) => element.parsedDir !== parsedDir
                            )
                          );

                          if (length === 0) {
                            dispatch(voidState());
                            setTerminalShown(false);
                            setDrawerShown(false);
                          }
                        }
                      });
                  }}
                >
                  Termina
                </Button>
              )}
              <IconButton
                icon={<FiSettings />}
                aria-label={'Impostazioni'}
                onClick={() => openModal()}
              />
            </HStack>
          </Box>
        </>
      </Box>
    </Center>
  );
}
