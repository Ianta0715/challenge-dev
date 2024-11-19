"use client"
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Country {
 countryCode: string; 
  name: string;
 
}

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>('http://localhost:3000/countries');
        if (Array.isArray(response.data)) {
          setCountries(response.data); 
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-600 mb-8">Countries</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {countries.map((country) => (
          <li key={country.name} className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <Link href={`/countries/${country.countryCode}`} passHref>
              <p className="text-xl font-semibold text-gray-600 hover:text-xxl">{country.name}</p>
              <p className="text-xl font-semibold text-gray-600 hover:text-xxl">{country.countryCode}</p>
           
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Countries;
