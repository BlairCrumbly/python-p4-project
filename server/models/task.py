from flask_sqlalchemy import SQLAlchemy
from config import db
from sqlalchemy_serializer import SerializerMixin

class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    due_date = db.Column(db.DateTime, nullable=False)
    completed = db.Column(db.DateTime, nullable=True)

    #! relationships
    # tasks relationship to categories through category_tasks
    categories = db.relationship('Category', secondary='category_tasks', back_populates='tasks')
    #* many part of one class having many tasks
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    #* one class has many tasks
    klass = db.relationship('Klass', back_populates='tasks')
    serialize_rules = ('-klass.tasks',)

    def __repr__(self):
        return f'<Task {self.title}>'