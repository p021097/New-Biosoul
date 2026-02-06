import express from 'express';
import { listOrders, placeOrder, updateOrderStatus, usersOrder, verifyOrder } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';


const OrderRouter = express.Router();


OrderRouter.post('/place', authMiddleware, placeOrder);
OrderRouter.post('/verify',verifyOrder);
OrderRouter.post('/userorders', authMiddleware,usersOrder);
OrderRouter.get('/list',listOrders);
OrderRouter.post('/status', updateOrderStatus)



export default OrderRouter;