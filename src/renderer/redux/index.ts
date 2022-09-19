import { configureStore } from "@reduxjs/toolkit";
import terminalReducer from "./terminalOutput"

export const store = configureStore({
  reducer: terminalReducer
})