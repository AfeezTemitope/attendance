import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as path from "node:path";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve()


console.log('mongo uri', process.env.MONGO_URI)
const app = express();
const port = process.env.PORT || 5000

connectDB()

app.use(cors())

app.use(express.json())

app.use('/api', apiRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/client/dist')))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
    });
}
app.listen(port, () => {
    console.log('server started sexily at http://localhost:' + port)
})