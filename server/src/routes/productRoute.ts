import { Router, Response, Request } from "express";
import productModel, { Iproducts } from "../model/productModel";
import { verifyToken } from "./userRoute";
import userModel from "../model/userModel";
import { productErrors, userErrors } from "./errors";

const router = Router();

router.get("/", verifyToken, async (_, res:Response) => {
    try{
        const products = await productModel.find({});
        res.json(products);
    }catch(err){
        console.error(err);
        res.status(400).json({message: "Error fetching data."});
    }
})
router.post("/checkout", verifyToken, async (req: Request<{},{},Iproducts>, res:Response) => {
    const {customerID, cartItems}=req.body;
    try {
        const user = await userModel.findById(customerID);
        const productIDs=Object.keys(cartItems);
        const products=await productModel.find({_id:{$in:productIDs}});

        if(!user){
            return res.status(400).json({type:userErrors.USER_NOT_FOUND})
        }
        if(products.length!==productIDs.length){
            return res.status(400).json({type:productErrors.PRODUCT_NOT_FOUND})
        }
        let totalMoney=0;
        for(const item in cartItems){
            const product=products.find(product=>product._id.toString()===item);
            if(!product){
                return res.status(400).json({type:productErrors.PRODUCT_NOT_FOUND})
            }
            if(product.stockQuantity<cartItems[item]){
                return res.status(400).json({type:productErrors.INSUFFICIENT_STOCK})
            }
            totalMoney+=product.price*cartItems[item];
        }
        if(user.availableMoney<totalMoney){
            return res.status(400).json({type:productErrors.NO_AVAILABLE_MONEY});
        }
        user.availableMoney-=totalMoney;
        user.purchasedItems.push(...productIDs);
        await user.save();
        await productModel.updateMany({_id:{$in:productIDs}},{$inc:{stockQuantity:-1}})
    } catch (error) {
        res.status(500).json(error);
    }
})
export default router;