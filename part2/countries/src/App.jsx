import { useState, useEffect } from "react";
import axios from "axios";

import Search from "./components/Search";
import Countries from "./components/Countries";
import Country from "./components/Country";

const App = () => {
  const [countries, setCountries] = useState("");
  const [search, setSearch] = useState("");
  const [showData, setShowData] = useState(null);

  const baseURL = "https://studies.cs.helsinki.fi/restcountries/api";

  useEffect(() => {
    axios
      .get(`${baseURL}/all`)
      .then((response) => response.data)
      .then((allCountries) =>
        setCountries(allCountries.map((country) => country.name.common))
      );
  }, []);

  const countriesToShow =
    search === ""
      ? []
      : countries.filter((country) => country.includes(search));

  const handleSearchChange = (event) => {
    // console.log(event.target.value);
    setSearch(event.target.value);
    setShowData(null); // 搜索的时候清除显示数据
  };

  const showByName = (country) => {
    axios
      .get(`${baseURL}/name/${country}`)
      .then((response) => setShowData(response.data));
  };

  useEffect(() => {
    if (countriesToShow.length === 1) showByName(countriesToShow[0]);
  }, [countriesToShow]);

  return (
    <div>
      <Search searchCountry={search} handleFnc={handleSearchChange} />
      <Countries countriesToShow={countriesToShow} showByName={showByName} />
      <Country country={showData} />
    </div>
  );
};

export default App;
