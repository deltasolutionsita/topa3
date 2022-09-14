import {
  Box,
  ChakraProvider,
  Heading,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import DragBox from './components/DragBox';
import Navbar from './components/Navbar';
import ProjectDashboard from './components/ProjectDashboard';
import TerminalOutput from './components/TerminalOutput';
import TerminalShown from './providers/TerminalShown';

const Main = () => {
  const [projects, setProjects] = useState<boolean>();
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
    window.electron.ipcRenderer
      .invoke('get-projects', [])
      .then((res: string) => {
        if (res === '') {
          setProjects(false);
        } else {
          setProjects(true);
        }
      });
  }, []);

  if (!projects) {
    return (
      <>
        <Box p="5%">
          <Heading textAlign={'center'}>
            Heyla! Sono <u>TOPA3</u> 👋🏼!
          </Heading>
          <Text textAlign={'center'} fontSize="xl" mt="2%">
            Sono il tuo assistente per tutto ciò che concerne lo sviluppo.
          </Text>
          <Text textAlign={'center'} fontSize="sm" mt="2%" opacity={0.55}>
            Inizia pure selezionando un progetto aperto recentemente o{' '}
            <u>importane uno nuovo</u>.
          </Text>
          <Text textAlign={'center'} fontSize="sm" mt="2%" opacity={0.55}>
            Se è la prima volta che usi questo software, ti consiglio di leggere
            la mia <u>documentazione</u>.
          </Text>
          <SimpleGrid placeItems={'center'}>
            <DragBox />
          </SimpleGrid>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <TerminalShown>
          <Navbar />
          <Box mt="-2%">
            <Heading textAlign={'center'} mt="5%">
              I tuoi progetti
            </Heading>
            <ProjectDashboard />
          </Box>
          <TerminalOutput />
        </TerminalShown>
      </>
    );
  }
};

export default function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
