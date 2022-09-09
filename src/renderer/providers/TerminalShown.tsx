import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

export const TSContext = React.createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}]);

const TerminalShown: FC<{ children: ReactNode }> = ({ children }) => {
  const [terminalShown, setTerminalShown] = useState(false);

  return (
    <TSContext.Provider value={[terminalShown, setTerminalShown]}>
      {children}
    </TSContext.Provider>
  );
};

export default TerminalShown;
