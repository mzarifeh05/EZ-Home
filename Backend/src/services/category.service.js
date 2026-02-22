const Category = require('../models/category.model.js');


class CategoryService {
    async createCategory(data) {
        if (!data.name) {
            const error = new Error('اسم التصنيف مطلوب');
            error.statusCode = 400;
            throw error;
        }
        const category = new Category(data);
        await category.save();
        return category;
}
    async getAllCategories() {
        return await Category.find({ isActive: true });
        
    }
    
}
module.exports = new CategoryService();