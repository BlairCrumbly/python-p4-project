from flask_sqlalchemy import SQLAlchemy
from config import db

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.DateTime, nullable=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    # tasks relationship to categories through category_tasks
    categories = db.relationship('Category', secondary='category_tasks', back_populates='tasks')


    def __repr__(self):
        return f'<Task {self.title}>'