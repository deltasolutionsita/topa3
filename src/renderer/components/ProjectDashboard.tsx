import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getWorkspaceFolderName } from './DragBox';

function ProjectDashboard() {
  const [projects, setProjects] = useState<{ dir: string; commands: string }[]>(
    []
  );

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
    <Box mt="3%">
      <SimpleGrid columns={3} placeItems="center">
        {projects.map((project, i) => {
          const parsedDir = getWorkspaceFolderName(project.dir);
          if (i === projects.length - 1) return;
          return (
            <Button
              variant={'outline'}
              onClick={async () => {
                window.electron.ipcRenderer
                  .invoke('call-project-commands', [project])
                  .then((r) => alert(r.message))
                  .catch((e) => alert(e));
              }}
              key={i}
              borderWidth={'2px'}
              p="8%"
            >
              <h1>{parsedDir}</h1>
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export default ProjectDashboard;
