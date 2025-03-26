from config import db
from flask_bcrypt import bcrypt
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), index=True, nullable=False, unique=True)
    email = db.Column(db.String, index=True, nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)

    #!Relationship 
    #* one user has many classes
    classes = db.relationship('Klass', back_populates='user', cascade='all, delete-orphan')
  #! set password method
    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    #! Verify password method
    def check_password(self, password):
        """Verifies the password against the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)