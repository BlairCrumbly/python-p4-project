from config import db

class Klass(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String(30))
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    tasks = db.relationship("Task", back_populates='classes')
    def __repr__(self):
        return f'<Klass {self.name}:{self.id}>'