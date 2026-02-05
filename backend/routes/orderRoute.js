import express from 'express';
import { placeOrder, verifyOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';


const OrderRouter = express.Router();


OrderRouter.post('/place', authMiddleware, placeOrder);
OrderRouter.post('/verify',verifyOrder)


export default OrderRouter;