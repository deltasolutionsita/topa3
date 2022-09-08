import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"

function TerminalOutput() {
  const [terminalOutput, setTerminalOutput] = useState<any[]>([])
  useEffect(() => {
    window.electron.ipcRenderer.on("project-commands-output", (out) => {
      setTerminalOutput((prevTerminalOutput) => [...prevTerminalOutput, out])
    })
  }, [])
  return (
    <Box>
      {terminalOutput.map((outLine, i) => {
        return <p key={i}>{outLine}</p>
      })}
    </Box>
  )
}

export default TerminalOutput

/**
 * const line = out as string;
      const lineContainsHttp = line.includes("http://")

      if(lineContainsHttp) {
        const rx = /http:\/\/\S+/gm
        const url = rx.exec(line)
        if(url) {
          console.log(url)
        }
      }

 */