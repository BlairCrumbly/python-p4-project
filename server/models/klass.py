from config import db

class Klass(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String(30))
    #!relationships
    #*link user and klass at tbl lvl
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    #* many classes belong to one user
    user = db.relationship('User', back_populates='classes') #many to one

    #*many tasks belong to one class
    #one to many
    tasks = db.relationship("Task", back_populates='klass', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Klass {self.name}:{self.id}>'