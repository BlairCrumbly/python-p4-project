from config import db

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.DateTime, nullable=True)
    user_class_id = db.Column(db.Integer, db.ForeignKey('user_classes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __repr__(self):
        return f'<Task {self.title}>'