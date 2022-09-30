import { Box, Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { addNewTerminal, addOutput } from 'renderer/redux/terminalOutput';
import { committed, verboseError } from 'renderer/toasts';
import { GitterElement } from './GitterProvider';

interface GitterActionsProps {
  project: GitterElement;
}

function GitterActions({ project }: GitterActionsProps) {
  const [commitMessage, setCommitMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    window.electron.ipcRenderer.on('git-commit-output', (data) => {
      const { out, name } = data as { out: string; name: string };

      dispatch(
        addOutput({
          projectName: name + ' (git)',
          terminalData: out,
        })
      );
    });

    window.electron.ipcRenderer.on('git-commit-error', (data) => {
      const { error } = data as { error: string; name: string };

      verboseError(error)
    });
  }, []);
  return (
    <>
      <Box p="10%">
        <Input
          colorScheme={'teal'}
          rounded="2xl"
          placeholder="Commit message..."
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
        />
        <Button
          mt="5%"
          w="full"
          rounded={'2xl'}
          leftIcon={<AiOutlineCheckCircle />}
          onClick={() => {
            dispatch(addNewTerminal({ name: project.parsedDir + ' (git)' }));
            window.electron.ipcRenderer
              .invoke('git-commit', [
                {
                  commitMessage,
                  project: {
                    name: project.parsedDir,
                    dir: project.project.dir,
                  },
                },
              ])
              .then(({ message, name }) => {
                if (message === 'ok') {
                  committed(name);
                }
              })
              .catch(() => console.error("errore dal catch di git-commit"))
          }}
        >
          Commit
        </Button>
      </Box>
    </>
  );
}

export default GitterActions;
