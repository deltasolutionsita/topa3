import {
  Box,
  Button,
  Code,
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getWorkspaceFolderName } from './DragBox';
import { FiSettings } from 'react-icons/fi';
import { commandsExecuted, projectDeleted } from 'renderer/toasts';
import { sleep } from './consts';
import { motion } from 'framer-motion';

function ProjectDashboard() {
  const [projects, setProjects] = useState<{ dir: string; commands: string }[]>(
    []
  );
  const [isLaunchUIShown, setIsLaunchUIShown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState({ dir: '', commands: '' });
  // marcial & banega (?)
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-projects', []).then((res) => {
      if (res === '') return;
      const projects = res.split('---');
      projects.forEach((project: string) => {
        const projectInfos = project.split(':::');
        const dir = projectInfos[0];
        const commands = projectInfos[1];
        const o = {
          dir,
          commands,
        };
        setProjects((prevProjects) => [...prevProjects, o]);
      });
    });
  }, []);

  return (
    <>
      <Box mt="3%">
        <SimpleGrid columns={3} placeItems="center">
          {projects.map((project, i) => {
            const parsedDir = getWorkspaceFolderName(project.dir);
            if (i === projects.length - 1) return;

            const displayLaunchUIClause =
              isLaunchUIShown &&
              parsedDir === getWorkspaceFolderName(hoveredItem.dir);

            return (
              <motion.div
                style={{
                  width: displayLaunchUIClause ? '75%' : '50%',
                }}
                key={i}
                whileHover={{
                  scale: 1.1,
                }}
              >
                <Flex
                  rounded="lg"
                  onMouseEnter={() => {
                    setHoveredItem({
                      commands: project.commands,
                      dir: project.dir,
                    });
                    setIsLaunchUIShown(true);
                  }}
                  onMouseLeave={() => setIsLaunchUIShown(false)}
                  key={i}
                  borderWidth={'2px'}
                  p="8%"
                  // width={'200px'}
                  // height={'125px'}
                  alignItems="center"
                  justifyContent={'center'}
                >
                  {
                    // display launch ui if hovered item is the same as the current item shown
                    displayLaunchUIClause ? (
                      <>
                        <HStack spacing={'5'}>
                          <Button
                            colorScheme="teal"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.electron.ipcRenderer
                                .invoke('start-shell', [project])
                                .then((r) => {
                                  if (r.message === 'ok') {
                                    commandsExecuted();
                                  } else alert(r.message);
                                })
                                .catch((e) => alert(e));
                            }}
                          >
                            Avvia {parsedDir}
                          </Button>
                          <Button onClick={onOpen}>
                            <FiSettings />
                          </Button>
                        </HStack>
                      </>
                    ) : (
                      <h1>{parsedDir}</h1>
                    )
                  }
                </Flex>
              </motion.div>
            );
          })}
        </SimpleGrid>
      </Box>
      <Modal motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getWorkspaceFolderName(hoveredItem.dir)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack mb="5%" divider={<Divider />}>
              <HStack maxW={'300px'}>
                <Text>Directory: </Text>
                <Code maxW={'250px'}>{hoveredItem.dir}</Code>
              </HStack>
              <HStack maxW={'300px'}>
                <Text>Comandi: </Text>
                <Code maxW={'250px'}>{hoveredItem.commands}</Code>
              </HStack>
              <Button
                colorScheme={'red'}
                onClick={() => {
                  window.electron.ipcRenderer
                    .invoke('remove-project', [hoveredItem])
                    .then(async (r) => {
                      if (r === 'done') {
                        projectDeleted();
                        await sleep(1100);
                        window.location.reload();
                      } else {
                        alert(r);
                      }
                    });
                }}
              >
                Elimina Progetto
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant={'outline'}
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Chiudi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProjectDashboard;
