const Person = ({ person, handleDelete }) => {
  return (
    <>
      <p>
        {person.name} {person.number}
        <button onClick={handleDelete}>delete</button>
      </p>
    </>
  );
};

const Persons = ({ personToShow, delPerson }) => {
  return (
    <>
      {personToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDelete={() => delPerson(person)}
        />
      ))}
    </>
  );
};

export default Persons;