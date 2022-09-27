import {
  Box,
  Button,
  Code,
  Divider,
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
import { projectDeleted } from 'renderer/toasts';
import { sleep } from './consts';
import ProjectCard from './ProjectCard';

function ProjectDashboard() {
  const [projects, setProjects] = useState<{ dir: string; commands: string }[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState({ dir: '', commands: '' });
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
      <Box p="2%" mt="3%">
        <SimpleGrid columns={3} placeItems="center">
          {projects.map((project, i) => {
            const parsedDir = getWorkspaceFolderName(project.dir);
            if (i === projects.length - 1) return;

            const options = {
              parsedDir,
              project,
              openModal: () => {
                setSelectedItem(project);
                onOpen();
              }
            }

            return (
              <ProjectCard
                key={i}
                {...options}
              />
            );
          })}
        </SimpleGrid>
      </Box>
      <Modal motionPreset="slideInBottom" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getWorkspaceFolderName(selectedItem.dir)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack mb="5%" divider={<Divider />}>
              <HStack maxW={'300px'}>
                <Text>Directory: </Text>
                <Code maxW={'250px'}>{selectedItem.dir}</Code>
              </HStack>
              <HStack maxW={'300px'}>
                <Text>Comandi: </Text>
                <Code maxW={'250px'}>{selectedItem.commands}</Code>
              </HStack>
              <Button
                colorScheme={'red'}
                onClick={() => {
                  window.electron.ipcRenderer
                    .invoke('remove-project', [selectedItem])
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
