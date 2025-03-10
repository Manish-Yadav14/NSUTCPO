import {config} from 'dotenv'
config();
import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();

app.use(express.json());
app.use(cors('*'));

const BASE_URL = process.env.COMPANY_URL;

app.post('/api/companyDetails',async(req:any,res:any)=>{
    const {id} = req.body;
    const response = await axios.get(`${BASE_URL}/isadminalone/${id.toString()}`);
    const result = {...response.data , id};
    return res.send(result);
})

app.get('/api/totalCompaniesCount',async(req:any,res:any)=>{
    const response = await axios.get(`${BASE_URL}`);
    return res.send({total : response.data});
})

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is listening on Port ${PORT}...`)
})
