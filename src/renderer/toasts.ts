import { createStandaloneToast, UseToastOptions } from "@chakra-ui/react";

const { toast } = createStandaloneToast()

const toastGen = ({ title, status }: { title: string, status: UseToastOptions["status"] }) => {
  return toast({
    title,
    status,
    duration: 3000,
    isClosable: false,
    variant: "left-accent",
    position: "top"
  })
}

export const commandsExecuted = () => {
  return toastGen({
    title: "Comandi eseguiti con successo",
    status: "success",
  })
}

export const projectDeleted = () => {
  return toastGen({
    title: "Progetto eliminato con successo",
    status: "info",
  })
}

export const projectImported = () => {
  return toastGen({
    title: "Progetto importato con successo",
    status: "success",
  })
}

export const fileNotValid = () => {
  return toastGen({
    title: "Il file non è valido",
    status: "error",
  })
}