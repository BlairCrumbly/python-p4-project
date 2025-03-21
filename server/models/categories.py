from config import db

class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    #! relationships
    #categories has many tasks through category tasks
    tasks = db.relationship('Task', secondary='category_tasks', back_populates='categories')