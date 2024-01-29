import 'react-app-polyfill/ie11';
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import { StorageProvider, useStorage } from '../.';

interface FormState {
  name: string;
  lastName: string;
  age: number
}

const defaultForm = {
  name:"",
  lastName:"",
  age:0
}

function Example() {
  const [formState, setFormState] = React.useState<FormState>(defaultForm);
  const { getItem, setItem } = useStorage();

  const handleSet = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setItem("form", formState);
  }, [formState, setItem]);

  const handleGet = React.useCallback(() => {
    setFormState(getItem<FormState>("form") ?? defaultForm);
  }, [getItem]);

  return (
    <>
      <h1>@nathan-vm/use-storage</h1>
      <p className="code">yarn add @nathan-vm/use-storage</p>
      <p className="code">pnpm add @nathan-vm/use-storage</p>
      <p className="code">npm install @nathan-vm/use-storage</p>

      <div className="card">
        <form onSubmit={handleSet}>
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              value={formState.name}
              onChange={(e) => {
                setFormState((s) => ({ ...s, name: e.target.value }));
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              value={formState.lastName}
              onChange={(e) => {
                setFormState((s) => ({ ...s, lastName: e.target.value }));
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="age">Age:</label>
            <input
              id="age"
              value={formState.age}
              onChange={(e) => {
                setFormState((s) => ({ ...s, age: Number(e.target.value) }));
              }}
            />
          </div>

          <button type="submit">Save to useStorage</button>

          <button type="button" onClick={handleGet}>
            Get from useStorage
          </button>
        </form>
      </div>
    </>
  );
}

const App = () => {
  return (
    <StorageProvider>
      <Example />
    </StorageProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
