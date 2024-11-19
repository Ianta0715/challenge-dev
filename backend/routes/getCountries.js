import axios from "axios";
import express from 'express';

const router = express.Router()


router.get('/',async(req,res)=>{
    try {
        const response = await axios("https://date.nager.at/api/v3/AvailableCountries");
        res.json(response.data)
    } catch (error) {
        res.status(500).json({error:"Error fetching countries"})
    }
});

router.get('/info/:countryCode', async(req,res)=> {
    const { countryCode } = req.params;
    
    try {
        const borderCountriesResponse = await axios(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        const populationResponse = await axios('https://countriesnow.space/api/v0.1/countries/population',{
          params:{
            country:countryCode
          }  
        });
        const flagResponse = await axios('https://countriesnow.space/api/v0.1/countries/flag/images',{
            params:{
                country:countryCode
            }
        });
        const populationData = populationResponse.data.data || [];
        const flagUrl = flagResponse.data.data ? flagResponse.data.data[0]?.image : '';

        res.status(200).json({
            countryCode,
            borderCountries:borderCountriesResponse.data,
            population:populationData,
            flag:flagUrl
        });
    } catch (error) {
        res.status(500).json({error:'Error fetching contry info'})
    }
})

export default router;