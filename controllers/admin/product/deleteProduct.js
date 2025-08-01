import mongoose from 'mongoose';
import Product from '../../../models/ProductModel.js';

export const deleteProduct = async (req, res) => {
   try{
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message : "Product Id is not valid"})
    }

    const product = await Product.findById(id);
    if(!product){
        res.status(404).json({message : "Product Not Found !"});
    }

    if(product.status === "deleted"){
        res.status(400).json({message : "Product already deleted"});
    }

    product.status = 'deleted';
    await product.save();

    return res.status(200).json({
        success : true,
        message : "Product marked as deleted",
    });
   }catch(error){
    console.log("Error while deleting product : ", error.message);
    return res.status(500).json({message : "Failed to delete product"})
   }
}