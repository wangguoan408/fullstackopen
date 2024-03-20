const PersonForm = ({
  onSubmitFunc,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={onSubmitFunc}>
      <div>
        name: <input id="name" value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input id="number" value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
