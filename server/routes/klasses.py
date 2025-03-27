from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db, api
from models import Klass, User
from flask import make_response


class KlassResource(Resource):
    @jwt_required()
    def get(self):
        """
        Get all classes for the authenticated user
        """
        try:
            current_user_id = get_jwt_identity()
            user_classes = Klass.query.filter_by(user_id=current_user_id).all()
            return [klass.to_dict() for klass in user_classes], 200
        except Exception as e:
            return {"message": f"Error retrieving classes: {str(e)}"}, 500

    @jwt_required()
    def post(self):
        """
        Create a new class for the authenticated user
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()

            # Validate required fields
            if not data or 'name' not in data:
                return {'message': 'Class name is required'}, 400

            # Check if name is already in use
            if Klass.query.filter_by(name=data['name'], user_id=current_user_id).first():
                return {'message': 'Class name already exists'}, 400

            # Create new class
            new_class = Klass(
                name=data['name'],
                description=data.get('description', ''),  # Default to empty string if not provided
                user_id=current_user_id
            )

            db.session.add(new_class)
            db.session.commit()
            response = make_response(new_class.to_dict(), 201)

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return {"message": f"Error creating class: {str(e)}"}, 500


class KlassDetailResource(Resource):
    @jwt_required()
    def get(self, klass_id):
        """
        Get details of a single class
        """
        try:
            current_user_id = get_jwt_identity()
            klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

            if not klass:
                return {'message': 'Class not found'}, 404

            return klass.to_dict(), 200
        except Exception as e:
            return {"message": f"Error retrieving class details: {str(e)}"}, 500

    @jwt_required()
    def put(self, klass_id):
        """
        Update a class
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

            if not klass:
                return {'message': 'Class not found'}, 404

            klass.name = data.get('name', klass.name)
            klass.description = data.get('description', klass.description)

            db.session.commit()
            return klass.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating class: {str(e)}"}, 500

    @jwt_required()
    def delete(self, klass_id):
        """
        Delete a class
        """
        try:
            current_user_id = get_jwt_identity()
            klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

            if not klass:
                return {'message': 'Class not found'}, 404

            db.session.delete(klass)
            db.session.commit()
            return 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting class: {str(e)}"}, 500


# Register the routes
api.add_resource(KlassResource, '/classes')  # For listing and creating classes
api.add_resource(KlassDetailResource, '/classes/<int:klass_id>')  # For viewing, updating, and deleting individual classes
