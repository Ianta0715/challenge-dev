"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useParams } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CountryInfo = () => {
  const params = useParams();
  const countryCode = params?.countryCode;
  const [countryInfo, setCountryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countryCode) return;

    const fetchCountryInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/countries/info/${countryCode}`);
        setCountryInfo(response.data);
      } catch (error) {
        console.error("Error fetching country info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryInfo();
  }, [countryCode]);
   

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-gray-700">Loading...</span>
      </div>
    );
  }

  if (!countryInfo) {
    return (
      <div className="text-center">
        <span className="text-xl text-red-600">Country information not found</span>
      </div>
    );
  }

  const countryPopulationData = countryInfo.population.find((data)=>
  data.iso3.slice(0,2) === countryCode.toUpperCase().slice(0,2));

  const filteredPopulation = countryPopulationData ? countryPopulationData.populationCounts : [];

 

  
 

  const populationData = {
    labels: filteredPopulation.map((data) => data.year),
    datasets: [{
      label: `Population of ${countryInfo.borderCountries.officialName}`,
      data: filteredPopulation.map((data) => data.value),
      borderColor: 'rgba(75,192,192,1)',
      fill: false,
    }],
  };

console.log(countryInfo);







  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-center items-center space-x-4">
        <h1 className="text-4xl font-bold">{countryInfo.borderCountries.officialName}</h1>
      </div>

      {countryInfo.borderCountries.borders && countryInfo.borderCountries.borders.length > 0 ? (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">Bordering Countries</h2>
    <ul className="space-y-2">
      {countryInfo.borderCountries.borders.map((borderCountry) => (
        <li key={borderCountry.countryCode} className="text-lg">
          <Link href={`/countries/${borderCountry.countryCode}`}>
            <p className="text-blue-500 hover:underline">{borderCountry.commonName}</p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="mt-8">
    <h2 className="text-2xl font-semibold mb-4">No Bordering Countries</h2>
  </div>
)}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Population Over Time</h2>
        <div className="h-96">
          <Line data={populationData} />
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;
