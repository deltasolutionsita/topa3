import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';
import { ReactNode } from 'react';

const { toast } = createStandaloneToast();

const toastGen = ({
  title,
  status,
}: {
  title: string | ReactNode;
  status: UseToastOptions['status'];
}) => {
  return toast({
    title,
    status,
    duration: 3000,
    isClosable: false,
    variant: 'left-accent',
    position: 'top',
  });
};

export const commandsExecuted = () => {
  return toastGen({
    title: 'Comandi eseguiti con successo',
    status: 'success',
  });
};

export const projectDeleted = () => {
  return toastGen({
    title: 'Progetto eliminato con successo',
    status: 'info',
  });
};

export const projectImported = () => {
  return toastGen({
    title: 'Progetto importato con successo',
    status: 'success',
  });
};

export const fileNotValid = () => {
  return toastGen({
    title: 'Il file non è valido',
    status: 'error',
  });
};

export const shellKilled = (name: string) => {
  return toastGen({
    title: `Shell ${name} terminata`,
    status: 'success',
  });
};

export const committed = (name: string) => {
  return toastGen({
    title: `Commit del progetto ${name} effettuato`,
    status: 'success',
  });
};

export const verboseError = (error: string) => {
  return toast({
    title: 'Errore',
    description: error,
    status: 'error',
    position: 'top-right',
    duration: 5000,
    isClosable: true
  });
};
