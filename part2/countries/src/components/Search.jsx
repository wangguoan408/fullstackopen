const Search = ({ searchCountry, handleFnc }) => {
  return (
    <p>
      find countries
      <input value={searchCountry} onChange={handleFnc} />
    </p>
  );
};

export default Search;
