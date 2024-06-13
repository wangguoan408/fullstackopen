import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (name === '') {
      setCountry(null)
    } else {
      axios
        .get(`${baseUrl}/name/${name}`)
        .then(res => {
          const countryData = res.data
          setCountry({
            found: true,
            data: {
              name: countryData.name.common,
              capital: countryData.capital,
              population: countryData.population,
              flag: countryData.flags.png
            }
          })
        })
        .catch(e => {
          // console.error(e)
          setCountry({ found: false })
        })
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App