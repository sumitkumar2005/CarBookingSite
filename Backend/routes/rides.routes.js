import express from 'express';
import { body } from 'express-validator';
const router = express.Router();
router.post('/create',(req,res)=>{
    body('userId').isString().isLength({min : 24,max:24}).withMessage('Invalid user id')
    body('pickup').isString().withMessage('not valid pickup');
    body('dropoff').isString().withMessage('DropOff should be String');
    

})