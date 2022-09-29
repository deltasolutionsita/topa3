import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

export const TSContext = React.createContext<
  [boolean, Dispatch<SetStateAction<boolean>>, boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}, false, () => {}]);

const TerminalShown: FC<{ children: ReactNode }> = ({ children }) => {
  const [terminalShown, setTerminalShown] = useState(false);
  const [drawerShown, setDrawerShown] = useState(false);

  return (
    <TSContext.Provider value={[terminalShown, setTerminalShown, drawerShown, setDrawerShown]}>
      {children}
    </TSContext.Provider>
  );
};

export default TerminalShown;
