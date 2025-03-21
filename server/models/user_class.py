from config import db

class UserClass(db.Model):
    __tablename__ = 'user_classes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)

    def __repr__(self):
        return f'<UserClass {self.user_id}:{self.class_id}>'
