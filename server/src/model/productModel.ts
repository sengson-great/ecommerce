import { model,Schema } from "mongoose";
export interface Iproducts{
    productName: string;
    price: number;
    image: string;
    description: string;
    stockQuantity: number;
    customerID: string;
    cartItems: any[];
}
const productSchema = new Schema<Iproducts>({
    productName: {type: String, required: true},
    price: {type: Number, required: true, min:[0,"price"]},
    image: {type: String, required: true},
    description: {type: String, required: true},
    stockQuantity: {type: Number, required: true, min:[0,"stock"]},
})
export default model<Iproducts>("product", productSchema);