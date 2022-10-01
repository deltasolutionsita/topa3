import { Box, Button, Divider, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  AiOutlineArrowUp,
  AiOutlineCheckCircle,
  AiOutlineSync,
} from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTerminal, addOutput, TerminalState } from 'renderer/redux/terminalOutput';
import { committed, pushed, verboseError } from 'renderer/toasts';
import { GitterElement } from './GitterProvider';

interface GitterActionsProps {
  project: GitterElement;
}

function GitterActions({ project }: GitterActionsProps) {
  const [commitMessage, setCommitMessage] = useState('');
  const [canPush, setCanPush] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commitCounter, setCommitCounter] = useState(0);
  const dispatch = useDispatch();
  const gitTerminals = useSelector((state) => state as TerminalState[]) 

  useEffect(() => {
    const found = gitTerminals.find((terminal) => terminal.name === project.parsedDir + " (git)")
    found === undefined && dispatch(addNewTerminal({ name: project.parsedDir + ' (git)' }));

    window.electron.ipcRenderer.on('git-commit-output', (data) => {
      const { out, name } = data as { out: string; name: string };
      setLoading(false);

      dispatch(
        addOutput({
          projectName: name + ' (git)',
          terminalData: out,
        })
      );
    });

    window.electron.ipcRenderer.on('git-commit-error', (data) => {
      const { error } = data as { error: string; name: string };
      setLoading(false);
      verboseError(error);
    });

    window.electron.ipcRenderer.on('git-can-push', (data) => {
      const canPush = data as boolean;
      setCommitCounter((prev) => prev + 1);
      canPush ? setCanPush(true) : setCanPush(false);
    });

    window.electron.ipcRenderer.on('git-push-output', (data) => {
      const { out, name } = data as { out: string; name: string };
      setLoading(false);
      setCommitCounter(0);

      dispatch(
        addOutput({
          projectName: name + ' (git)',
          terminalData: out,
        })
      );
    });

    window.electron.ipcRenderer.on('git-push-success', (data) => {
      const { success } = data as { success: boolean };
      setLoading(false);
      success && pushed();
    });

    window.electron.ipcRenderer.on('git-push-error', (data) => {
      const { error } = data as { error: string; name: string };
      setLoading(false);
      verboseError(error);
    });

    window.electron.ipcRenderer.on('git-fp-out', (data) => {
      const { out, name } = data as { out: string; name: string };
      setLoading(false);
      dispatch(
        addOutput({
          projectName: name + ' (git)',
          terminalData: out,
        })
      );
    });

    window.electron.ipcRenderer.on('git-fp-error', (data) => {
      const { error } = data as { error: string };
      setLoading(false);
      verboseError(error);
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
          disabled={loading || commitMessage.length === 0}
          isLoading={loading}
          mt="5%"
          w="full"
          rounded={'2xl'}
          leftIcon={<AiOutlineCheckCircle />}
          onClick={() => {
            setLoading(true);
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
              });
          }}
        >
          Commit
        </Button>
        {canPush && (
          <Button
            disabled={loading}
            isLoading={loading}
            mt="5%"
            w="full"
            rounded={'2xl'}
            leftIcon={<AiOutlineArrowUp />}
            onClick={() => {
              setLoading(true);
              window.electron.ipcRenderer.invoke('git-push', [
                {
                  project: {
                    name: project.parsedDir,
                    dir: project.project.dir,
                  },
                },
              ]);
            }}
          >
            Push {commitCounter !== 0 && `(${commitCounter})`}
          </Button>
        )}
        <Divider my="10%" />
        <Button
          disabled={loading}
          isLoading={loading}
          w="full"
          rounded={'2xl'}
          leftIcon={<AiOutlineSync />}
          onClick={() => {
            setLoading(true);
            window.electron.ipcRenderer.invoke('git-fp', [
              {
                project: {
                  name: project.parsedDir,
                  dir: project.project.dir,
                },
              },
            ]);
          }}
        >
          Fetch & Pull
        </Button>
      </Box>
    </>
  );
}

export default GitterActions;
