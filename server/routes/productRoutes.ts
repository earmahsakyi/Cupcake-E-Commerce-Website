import { Router } from "express";
import { getAllProducts,getProductById, createProduct,updateProduct,deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
const router = Router();


// Admin only
router.post('/', protect,validateBody(['name','slug','short_desc','description','product_type']), createProduct);
router.patch('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/', getAllProducts);
router.get('/:id',getProductById);



export default router;