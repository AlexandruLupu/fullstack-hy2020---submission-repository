import React, { useEffect, useState } from "react";
import Numbers from "./components/numbers";
import PersonForm from "./components/personform";
import Filter from "./components/filter";
import personServices from "./services/backEndComm";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({messageData: null, color: null});

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().startsWith(filter.toLowerCase())
        );

  const checkUserName = (obj) => obj.name === newName;

  console.log(persons);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.some(checkUserName)) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewNumber("");
    } else {
      const createMessage = {
        messageData: `Added ${personObject.name}`,
        color: "green"
      }
      personServices.create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setMessage(createMessage);
        setTimeout(() => {
          setMessage({messageData: null, color: null});
        }, 5000);
      })
      .catch(error => {
        const errorMessage = {
          messageData: error.response.data.error,
          color: "red"
        }
        setMessage(errorMessage)
        setNewName("");
        setNewNumber("");
        setTimeout(() => {
          setMessage({messageData: null, color: null});
        }, 5000);
        console.log(error.response.data)
      })
      
    }
  };

  const handleDelete = (id, name) => {
    let confirm = window.confirm(`Delete ${name} ?`);
    if (confirm === true) {
      const deleteMessage ={
        messageData: `Deleted ${name}`,
        color: "green"
      }
      personServices.deletePerson(id);
      setPersons(persons.filter((person) => person.id !== id));
      setMessage(deleteMessage)
      setTimeout(() => {
        setMessage({messageData: null, color: null});
      }, 5000);
    } else {
      return;
    }
  };

  const handlePersonsChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  //console.log(persons);
  //console.log(persons.some(checkUserName));
  //console.log(personsToShow);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>Add a new </h3>
      <PersonForm
        addPerson={addPerson}
        handlePersonsChange={handlePersonsChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      {personsToShow.map((person) => {
        return (
          <Numbers
            persons={person}
            key={person.id}
            handleDelete={() => handleDelete(person.id, person.name)}
          />
        );
      })}
    </div>
  );
};

export default App;
