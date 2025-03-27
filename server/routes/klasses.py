from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db, api
from models import Klass, User

# Resource for managing classes
class KlassResource(Resource):
    @jwt_required()
    def get(self):
        """
        Get all classes for the authenticated user
        """
        current_user_id = get_jwt_identity()
        user_classes = Klass.query.filter_by(user_id=current_user_id).all()
        return [klass.to_dict() for klass in user_classes], 200

    @jwt_required()
    def post(self):
        """
        Create a new class for the authenticated user
        """
        data = request.get_json()  # Fix typo here (request.json() -> request.get_json())
        current_user_id = get_jwt_identity()

        # Validate required fields
        if 'name' not in data:
            return {'message': 'Class name required'}, 400
        
        # Check if name is already in use
        if Klass.query.filter_by(name=data['name'], user_id=current_user_id).first():
            return {'message': 'Class name already exists'}, 400
        
        # Create the new class
        new_class = Klass(
            name=data['name'],
            description=data.get('description', ''),  # Default to empty string if not provided
            user_id=current_user_id
        )
        db.session.add(new_class)
        db.session.commit()
        return new_class.to_dict(), 201


# Resource for managing individual class details (viewing and updating)
class KlassDetailResource(Resource):
    @jwt_required()
    def get(self, klass_id):
        """
        Get details of a single class
        """
        current_user_id = get_jwt_identity()
        klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

        if not klass:
            return {'message': 'Class not found'}, 404

        return klass.to_dict(), 200

    @jwt_required()
    def put(self, klass_id):
        """
        Update a class
        """
        data = request.get_json()
        current_user_id = get_jwt_identity()
        klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

        if not klass:
            return {'message': 'Class not found'}, 404

        klass.name = data.get('name', klass.name)
        klass.description = data.get('description', klass.description)

        db.session.commit()
        return klass.to_dict(), 200

    @jwt_required()
    def delete(self, klass_id):
        """
        Delete a class
        """
        current_user_id = get_jwt_identity()
        klass = Klass.query.filter_by(id=klass_id, user_id=current_user_id).first()

        if not klass:
            return {'message': 'Class not found'}, 404

        db.session.delete(klass)
        db.session.commit()
        return {'message': 'Class deleted successfully'}, 200


# Register the routes
api.add_resource(KlassResource, '/classes')  # For listing and creating classes
api.add_resource(KlassDetailResource, '/classes/<int:klass_id>')  # For viewing, updating, and deleting individual classes
