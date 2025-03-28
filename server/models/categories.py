from config import db
from sqlalchemy_serializer import SerializerMixin

class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    category_type = db.Column(db.String(50), nullable=False)  # Type to distinguish 'Type of Task' or 'Complexity'

    #! relationships
    #categories has many tasks through category tasks
    tasks = db.relationship('Task', secondary='category_tasks', back_populates='categories')
    serialize_rules = ('-tasks.categories',)  # Prevents circular reference
