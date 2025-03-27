from config import db, flask_bcrypt
from sqlalchemy_serializer import SerializerMixin




class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), index=True, nullable=False, unique=True)
    email = db.Column(db.String, index=True, nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)

    #!Relationship 
    #* one user has many classes
    classes = db.relationship('Klass', back_populates='user', cascade='all, delete-orphan')
    serialize_rules = ("-classes", "-password_hash")

    def set_password(self, password):
        """
        Hash the password using bcrypt before storing
        """
        #! Generate a salt and hash the password
        self.password_hash = flask_bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """
        Check the provided password against the stored hash
        """
        return flask_bcrypt.check_password_hash(self.password_hash, password)