import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import stripAnsi from "strip-ansi"

export type TerminalState = { name: string, out: string[] }

const slice = createSlice({
  name: "terminalOutput",
  initialState: [] as TerminalState[],
  reducers: {
    addNewTerminal: (state, { payload: { name } }: PayloadAction<{ name: string }>) => {
      const existing = state.find((terminal) => terminal.name === name)
      console.log(existing)
      if (!existing) {
        state.push({
          name,
          out: []
        })
      }
    },
    addOutput: (state, { payload: { projectName, terminalData } }: PayloadAction<{ projectName: string, terminalData: string }>) => {
      const terminal = state.find((terminal) => terminal.name === projectName)
      if (terminal) {
        terminal.out.push(stripAnsi(terminalData))
      }
    },
    deleteTerminal: (state, { payload: { name } }: PayloadAction<{ name: string }>) => {
      return state.filter((terminal) => terminal.name !== name)
    }
  }
})

export const { addNewTerminal, addOutput, deleteTerminal } = slice.actions
export default slice.reducer

export const getTerminalState = createSelector(
  (a: any) => a,
  (b: any) => b
)