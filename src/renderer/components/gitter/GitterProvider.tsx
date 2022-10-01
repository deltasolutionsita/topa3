import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
} from 'react';

export interface GitterElement {
  project: { dir: string; commands: string };
  parsedDir: string;
  changedFiles: File[];
}

export const GitterContext = createContext<
  [GitterElement[], Dispatch<SetStateAction<GitterElement[]>>]
>([[], () => {}]);

const GitterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [openedProjects, setOpenedProjects] = React.useState<GitterElement[]>(
    []
  );

  return (
    <GitterContext.Provider value={[openedProjects, setOpenedProjects]}>
      {children}
    </GitterContext.Provider>
  );
};

export default GitterProvider;
