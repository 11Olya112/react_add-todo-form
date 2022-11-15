import './App.scss';
import React, { useState } from 'react';
import { TodoList } from './components/TodoList/TodoList';

import { Todo } from './types/Todo';
import { User } from './types/User';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';

const preparedTodos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: usersFromServer.find(users => users.id === todo.userId) || null,
}));

const usersFromServerFilter = usersFromServer
  .find(users => todosFromServer
    .find(todo => users.id === todo.userId)) || null;

export const App = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState(usersFromServerFilter);
  const [todos, setTodos] = useState<Todo[]>([...preparedTodos]);

  const [formKey, setFormKey] = useState(10);
  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorUser, setIsErrorUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);

  const addTodo = (title: string, user: User | null) => {
    const newTodo = {
      id: preparedTodos.length + 1,
      userId: 1,
      title,
      user,
      completed: false,
    };

    setTodos([...todos, newTodo]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name === '') {
      setIsErrorName(true);
    }

    if (currentUserId === 0) {
      setIsErrorUser(true);
    }

    if (name !== '' && currentUserId !== 0) {
      addTodo(name, userName);
      setName('');
      setFormKey(formKey + 1);
    }
  };

  const errorTitle = <span className="error">Please enter a title</span>;
  const errorUser = <span className="error">Please choose a user</span>;

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        key={formKey}
        action=" /api/users "
        method=" POST "
        onSubmit={handleSubmit}
      >
        <div className="field">
          Name:
          {' '}

          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter a name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          {(isErrorName) && errorTitle}
        </div>

        <div className="field">
          User:
          <select
            name="users"
            id="0"
            onChange={(event) => {
              const { value } = event.target;
              const needUser = usersFromServer
                .find(item => item.name === value);

              setUserName(needUser || null);
              setCurrentUserId(1);
            }}
          >
            <option value={0}> Choose a user </option>

            { usersFromServer
              .map(users => (
                <>
                  <option
                    key={users.id}
                  >
                    {users.name}

                  </option>
                </>
              ))}

          </select>

          {(isErrorUser) && errorUser}
        </div>

        <button
          type="submit"
          data-cy="submitButton"
        >
          Add
        </button>

      </form>

      <section className="TodoList">
        <TodoList todos={todos} />
      </section>
    </div>
  );
};
