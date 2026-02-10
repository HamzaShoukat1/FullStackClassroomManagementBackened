import express from "express"
import { getAllSubjects } from "../Controllers/subj.controller"


const  router = express.Router()

router.route("/").get(getAllSubjects)


export default router