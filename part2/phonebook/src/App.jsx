import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [personToShow, setPersonToShow] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("info");

  useEffect(() => {
    personService.getAll().then((initialData) => setPersons(initialData));
  }, []);

  // Filter
  useEffect(() => {
    setPersonToShow(
      filter === ""
        ? persons
        : persons.filter((person) => person.name.includes(filter))
    );
  }, [persons, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const updateStatus = (msg, msgType) => {
    setNewName("");
    setNewNumber("");
    setMessage(msg);
    setMsgType(msgType);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // Add
  const addPerson = (event) => {
    event.preventDefault();

    // 有重复名字
    const filtered = persons.filter((person) => person.name === newName);
    if (filtered.length > 0) {
      const confirmed = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (!confirmed) return;
      const person = filtered[0];
      const personObject = { ...person, number: newNumber };
      personService
        .update(person.id, personObject)
        .then((returnedPerson) => {
          console.log("something...");
          setPersons(
            persons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person
            )
          );
          updateStatus(`Updated ${person.name}`, "info");
        })
        .catch((error) => {
          updateStatus(error.response.data.error, "error");
        });
      return;
    }

    // 无重复名字
    const personObject = {
      name: newName,
      number: newNumber,
      // React 会自动生成 id
    };
    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        updateStatus(`Added ${newName}`, "info");
      })
      .catch((error) => {
        updateStatus(error.response.data.error, "error");
      });
  };

  const delPerson = (person) => {
    const confirmed = confirm(`Delete ${person.name}?`);
    // [Violation] 'click' handler took 869ms
    if (!confirmed) return;
    personService
      .deleteById(person.id)
      .then((status) => {
        console.log(`status: ${status}, type: ${typeof status}`);
        if (status === 204)
          setPersons(
            persons.filter((eachPerson) => person.id !== eachPerson.id)
          );
      })
      .finally(() => {
        setMessage(`Deleted ${person.name}`);
        setMsgType("info");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(`error: ${error}`);
        setMessage(
          `Information of ${person.name} has already been removed from server`
        );
        setMsgType("error");
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // HTML
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={msgType} />
      <Filter filter={filter} handleFunc={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        // key={crypto.randomUUID()} 不好使
        onSubmitFunc={addPerson}
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personToShow={personToShow} delPerson={delPerson} />
    </div>
  );
};

export default App;
