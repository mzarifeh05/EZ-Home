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
      return res.status(201).json({
        success: true,
        message: 'تم إنشاء التصنيف بنجاح',
        data: category
      });
    } catch (error) {
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
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      return res.json({
        success: true,
        data: category
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return res.json({
        success: true,
        message: 'تم تحديث التصنيف بنجاح',
        data: category
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      return res.json({
        success: true,
        message: 'تم حذف التصنيف بنجاح'
      });
    } catch (error) {
      return res.status(getStatusCode(error)).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  }

}

module.exports = new CategoryController();
