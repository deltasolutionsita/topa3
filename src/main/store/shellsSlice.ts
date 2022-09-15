import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// export interface TOPA3Shell {
//   activity: string;
//   shell: ChildProcess;
// }

export interface TOPA3Shell {
  pid: number;
  name: string;
}

const slice = createSlice({
  name: 'shells',
  initialState: {
    shells: [] as TOPA3Shell[],
  },
  reducers: {
    addShell: (
      state,
      { payload: { name, pid } }: PayloadAction<TOPA3Shell>
    ) => {
      state.shells.push({
        name,
        pid,
      });
    },
    removeShell: (state, action: PayloadAction<TOPA3Shell>) => {
      state.shells = state.shells.filter(
        (shell) => shell.pid !== action.payload.pid
      );
    },
  },
});

export const { addShell, removeShell } = slice.actions;
export default slice.reducer;
