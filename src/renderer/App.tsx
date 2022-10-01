import {
  Box,
  ChakraProvider,
  Heading,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import DragBox from './components/DragBox';
import GitterProvider from './components/gitter/GitterProvider';
import Navbar from './components/Navbar';
import ProjectDashboard from './components/ProjectDashboard';
import TerminalOutput from './components/TerminalOutput';
import TodoProvider from './components/todo/TodoProvider';
import TerminalShown from './providers/TerminalShown';
import { store } from './redux';
import SplashScreen from './splashscreen/SplashScreen';

const Main = () => {
  const [projects, setProjects] = useState<boolean>();
  const { setColorMode } = useColorMode();
  const splash = new URLSearchParams(window.location.search).get('splash');
  const terminal = new URLSearchParams(window.location.search).get('terminal');

  const navigate = useNavigate();

  useEffect(() => {
    splash !== undefined && splash === 'true' && navigate('/splash');
    terminal !== undefined && terminal === 'true' && navigate('/terminal');
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
          <GitterProvider>
            <TodoProvider>
              <Navbar />
              <Box mt="-2%">
                <Heading textAlign={'left'} mt="5%" ml="5%">
                  I tuoi progetti
                </Heading>
                <ProjectDashboard />
                <TerminalOutput />
              </Box>
            </TodoProvider>
          </GitterProvider>
        </TerminalShown>
      </>
    );
  }
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/splash" element={<SplashScreen />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </ReduxProvider>
  );
}
