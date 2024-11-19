import express from 'express';
import getCountries from './getCountries.js';

const router = express.Router();

router.use('/countries',getCountries);


export default router;