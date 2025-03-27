from flask import request, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies
from flask import make_response


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
        

        


 #! Create new user
        try:
            new_user = User(
                username=data['username'],
                email=data['email']
            )
            new_user.set_password(data['password'])  #! Hash and set password
        
        
            db.session.add(new_user)
            db.session.commit()
            
            #! Generate access token
            access_token = create_access_token(identity=new_user.id)
            
            response = make_response(new_user.to_dict(),201)
            set_access_cookies(response, access_token)
            return response

        except Exception as e:
            
            return {'message': f'Error creating user: {str(e)}'}, 500



class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            response = make_response(user.to_dict(), 200)
            set_access_cookies(response, access_token)
            #print("Setting cookie:", response.headers.get("Set-Cookie"))  # Debugging
            return response
        
    

class Logout(Resource):
    @jwt_required()
    def delete(self):
        """
        Handles user logout.
        - Requires a valid JWT token.
        - Unsets the JWT cookies.
        """
        response = make_response('', 204)
        unset_jwt_cookies(response)
        return response



#! Protected Route
class UserProfile(Resource):
    @jwt_required()
    def get(self):
        """
        Get the current user's profile
        Requires a valid JWT token
        """
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        return user.to_dict(), 200

class CheckUser(Resource):
    @jwt_required()
    def get(self):
        """
        Get the current user's profile
        Requires a valid JWT token
        """
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        return user.to_dict(), 200
    


# Register the routes
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(UserProfile, '/profile')
api.add_resource(Logout, '/logout')
api.add_resource(CheckUser, '/check-user')