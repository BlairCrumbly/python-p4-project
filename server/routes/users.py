from flask import request, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User
from flask_jwt_extended import create_access_token



class Register(Resource):
    def post(self):
        """
        Handles user registration.
        - Validates if the username or email already exists.
        - Hashes the password before storing it.
        - Creates a new user in the database.
        """
        if not request.is_json:
            return {'message': 'Request must be JSON'}, 400

        try:
            data = request.get_json()
        except Exception as e:
            return {'message': f'Invalid JSON format: {str(e)}'}, 400
        
        #! Check if user already exists
        existing_user = User.query.filter(
            (User.username == data['username']) | 
            (User.email == data['email'])
        ).first()
        
        if existing_user:
            return {'message': 'Username or email already exists'}, 400

 #! Create new user
        new_user = User(
            username=data['username'],
            email=data['email']
        )
        new_user.set_password(data['password'])  #! Hash and set password
        
        db.session.add(new_user)
        db.session.commit()
        
        return {'message': 'User created successfully'}, 201

class Login(Resource):
    """
        Handles user login.
        - Checks if the username exists.
        - Verifies the password.
        - Returns a JWT access token on success.
    """
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            return {
                'access_token': access_token,
                'user_id': user.id,
                'username': user.username
            }, 200
        
        return {'message': 'Invalid credentials'}, 401
    


    def delete(self, user_id):
        # DELETE a user
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204
    
# Register the routes
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')