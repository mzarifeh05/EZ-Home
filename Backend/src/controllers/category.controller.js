const CategoryService = require('../services/category.service.js');

const getStatusCode = (error) => {
  const statusCode = Number(error?.statusCode ?? error?.status);
  return Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    ? statusCode
    : 500;
};


class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await CategoryService.createCategory(req.body);
            return res.json({
                success: true,
                message: 'تم إنشاء التصنيف بنجاح',
                data: category
            });
            
        }catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
    }
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.json({
                success: true,
                message: 'تم جلب التصنيفات بنجاح',
                data: categories
            });
        }catch (error) {      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
}
}


module.exports = new CategoryController();
