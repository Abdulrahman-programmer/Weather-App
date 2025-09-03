import { useEffect, useState } from 'react'
import './App.css'
import rain from './assets/image.png'
import sun from './assets/sunny.png'
import storm from './assets/storm.png'
import cloud from './assets/cloud.svg'


function App() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [img, setImg] = useState(null)

  const formatDescription = (desc) =>
    desc.split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const fetchWeather = async (lat, lon) => {
    try {
      const Api_Key = "7eebe76fd298c4390178c11162c08f0c";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key}&units=metric`
      );
      const data = await response.json();

      setWeather(data);

      let info = data.weather[0].description
        .split(" ")
        .map((word) => word.toLowerCase());

      if (info.some((word) => word.includes("cloud"))) {
        setImg(cloud);
      } else if (info.some((word) => word.includes("rain"))) {
        setImg(rain);
      } else if (info.some((word) => word.includes("clear") || word.includes("sunny"))) {
        setImg(sun);
      } else if (info.some((word) => word.includes("thunderstorm"))) {
        setImg(storm);
      }



    } catch (error) {
      setError(error.message);
    }
  };


  useEffect(() => {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Geoloctaion Error :" + err.message)
        })
    }
    else {
      setError("Geolocation not supported by this browser.");
    }

  }, [])

  return (
    <div className="box">
      <h1 className='text-5xl mb-10'>Weather App 🌤</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather ? (
        <div>
          <h2 className='text-3xl '>{weather.name}</h2>
          <img src={img} alt="Weather" className="h-70 p-0 m-auto" />
          <p className='text-5xl '>{weather.main.temp}°C</p>
          <p className='text-5xl pb-10'>{formatDescription(weather.weather[0].description)}</p>
        </div>
      ) : (
        !error && <p>Loading weather...</p>
      )}
    </div>

  )
}

export default App
