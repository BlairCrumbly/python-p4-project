from config import db

class Klass(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String(30))

    def __repr__(self):
        return f'<Klass {self.name}:{self.id}>'