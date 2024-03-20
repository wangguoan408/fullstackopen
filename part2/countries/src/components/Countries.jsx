const Country = ({ country, handleShow }) => {
  return (
    <p>
      {country}
      <button onClick={handleShow}>Show</button>
    </p>
  );
};

const Countries = ({ countriesToShow, showByName }) => {
  return (
    <>
      {countriesToShow.map((country) => (
        <Country
          key={country}
          country={country}
          handleShow={() => showByName(country)}
        />
      ))}
    </>
  );
};

export default Countries;
