
import express from "express"
const app = express()
import SubjectRoute from './Routes/Subjects.Route'
import cors from 'cors'
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true
}))
app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

//route

app.use("/api/v1/subjects",SubjectRoute)
export {app}