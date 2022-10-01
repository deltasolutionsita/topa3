import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
} from 'react';

export interface Todos {
  project: { dir: string; commands: string };
  parsedDir: string;
  changedFiles: File[];
}

export const TodoContext = createContext<
  [Todos[], Dispatch<SetStateAction<Todos[]>>]
>([[], () => {}]);

const TodoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = React.useState<Todos[]>(
    []
  );

  return (
    <TodoContext.Provider value={[todos, setTodos]}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
