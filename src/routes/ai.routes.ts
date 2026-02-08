import { Router } from "express";
import {
     startAIInterview,
     submitAIAnswer
    } from "../controllers/ai.controller";


const router = Router()

router.post('/start',startAIInterview)
router.post('/answer',submitAIAnswer)
export default router;