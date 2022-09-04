import {
  Box,
  ChakraProvider,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import DragBox from './components/DragBox';
import ProjectDashboard from './components/ProjectDashboard';

const Main = () => {
  const [projects, setProjects] = useState<boolean>();

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-projects', [])
      .then((res: string) => {
        if (res === '') {
          setProjects(false)
        } else {
          setProjects(true)
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
        <Heading textAlign={"center"} mt="5%">I tuoi progetti</Heading>
        <ProjectDashboard />
        <SimpleGrid placeItems={'center'}>
          <DragBox />
        </SimpleGrid>
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
