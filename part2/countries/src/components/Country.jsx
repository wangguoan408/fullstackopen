const Country = ({ country }) => {
  if (country === null) return null;
  const name = country.name.common;
  const capital = country.capital;
  const area = country.area;
  const languages = Object.values(country.languages);
  const flag = country.flags.png;

  return (
    <>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((item) => (
          <li>{item}</li>
        ))}
      </ul>

      <img src={flag} />
    </>
  );
};

export default Country;
