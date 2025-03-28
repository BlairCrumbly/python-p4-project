from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db, api
from models import Category

class CategoryResource(Resource):
    @jwt_required()
    def get(self):
        """Get a list of all categories"""
        try:
            categories = Category.query.all()
            return [category.to_dict() for category in categories], 200
        except Exception as e:
            return {"message": f"Error retrieving categories: {str(e)}"}, 500


class CategoryDetailResource(Resource):
    @jwt_required()
    def get(self, category_id):
        """
        Get details of a single category.
        """
        try:
            current_user_id = get_jwt_identity()
            category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()

            if not category:
                return {'message': 'Category not found'}, 404

            return category.to_dict(), 200

        except Exception as e:
            return {"message": f"Error retrieving category details: {str(e)}"}, 500

    @jwt_required()
    def put(self, category_id):
        """
        Update a category.
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()

            if not category:
                return {'message': 'Category not found'}, 404

            category.name = data.get('name', category.name)
            category.category_type = data.get('category_type', category.category_type)

            db.session.commit()
            return category.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating category: {str(e)}"}, 500

    @jwt_required()
    def delete(self, category_id):
        """
        Delete a category.
        """
        try:
            current_user_id = get_jwt_identity()
            category = Category.query.filter_by(id=category_id, user_id=current_user_id).first()

            if not category:
                return {'message': 'Category not found'}, 404

            db.session.delete(category)
            db.session.commit()
            return 200  # Matches `KlassResource` delete behavior

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting category: {str(e)}"}, 500


# Register routes
api.add_resource(CategoryResource, '/categories')  # List/Create
api.add_resource(CategoryDetailResource, '/categories/<int:category_id>')  # CRUD for single category
