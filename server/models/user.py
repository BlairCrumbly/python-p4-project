from config import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), index=True, nullable=False, unique=True)
    email = db.Column(db.String, index=True, nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)