from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db, api
from models import Task, Klass, Category, CategoryTask
from datetime import datetime


class TaskResource(Resource):
    @jwt_required()
    def get(self, klass_id=None):
        """
        Get all tasks for a specific class for the authenticated user
        """
        try:
            current_user_id = get_jwt_identity()

            # If klass_id is provided, filter tasks by class_id and user_id through the Klass relationship
            if klass_id:
                tasks = Task.query.filter(Task.class_id == klass_id, Klass.user_id == current_user_id).all()
            else:
                tasks = Task.query.filter(Task.klass.has(user_id=current_user_id)).all()

            if not tasks:
                return {"message": "No tasks found for the specified class"}, 404

            # Include categories for each task
            tasks_with_categories = []
            for task in tasks:
                task_data = task.to_dict()
                task_data['categories'] = [category.name for category in task.categories]  # assuming 'categories' is a relationship
                tasks_with_categories.append(task_data)

            return tasks_with_categories, 200


        except Exception as e:
            return {"message": f"Error retrieving tasks: {str(e)}"}, 500


    @jwt_required()
    def post(self):
        """
        Create a new task for the authenticated user within a specific class
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()

            # Validate required fields
            if not data or 'title' not in data or 'due_date' not in data or 'class_id' not in data:
                return {'message': 'Title, due date, and class_id are required'}, 400

            # Ensure the class exists and belongs to the current user
            klass = Klass.query.filter_by(id=data['class_id'], user_id=current_user_id).first()
            if not klass:
                return {'message': 'Class not found or you do not have permission'}, 404

            # Create new task
            new_task = Task(
                title=data['title'],
                description=data.get('description', ''),
                due_date=datetime.strptime(data['due_date'], "%Y-%m-%dT%H:%M:%S"),
                class_id=data['class_id'],
                completed=None,  # Default to None unless completed
            )

            db.session.add(new_task)
            db.session.commit()

            # Now, insert records into CategoryTask to associate the task with categories
            if 'type_category_id' in data:
                type_category_task = CategoryTask(task_id=new_task.id, category_id=data['type_category_id'])
                db.session.add(type_category_task)

            if 'complexity_category_id' in data:
                complexity_category_task = CategoryTask(task_id=new_task.id, category_id=data['complexity_category_id'])
                db.session.add(complexity_category_task)

            db.session.commit()

            return new_task.to_dict(), 201

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            return {"message": f"Error creating task: {str(e)}"}, 500


class TaskDetailResource(Resource):
    @jwt_required()
    def put(self, task_id):
        """
        Update a task for the authenticated user
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            task = Task.query.filter_by(id=task_id).join(Klass).filter(Klass.user_id == current_user_id).first()

            if not task:
                return {'message': 'Task not found or you do not have permission'}, 404

            # Update task fields
            task.title = data.get('title', task.title)
            task.description = data.get('description', task.description)
            
            # Handle multiple date formats
            due_date_str = data.get('due_date', str(task.due_date))
            try:
                task.due_date = datetime.strptime(due_date_str, "%Y-%m-%dT%H:%M:%S")  # Try ISO format
            except ValueError:
                task.due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M:%S")  # Fallback to other format
             
            # Handle completion
            if data.get('completed') is not None:  # Mark as completed
                task.completed = datetime.now() if data['completed'] else None  # Set completed time if True, else None
            db.session.commit()
            return task.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating task: {str(e)}"}, 500


    @jwt_required()
    def delete(self, task_id):
        """
        Delete a task for the authenticated user
        """
        try:
            current_user_id = get_jwt_identity()
            # Query task by task_id and ensure it's linked to a class owned by the current user
            task = Task.query.filter_by(id=task_id).join(Klass).filter(Klass.user_id == current_user_id).first()

            if not task:
                return {'message': 'Task not found or you do not have permission'}, 404

            db.session.delete(task)
            db.session.commit()

            return {'message': 'Task deleted successfully'}, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting task: {str(e)}"}, 500


class TaskCompleteResource(Resource):
    @jwt_required()
    def patch(self, task_id):
        """
        Mark a task as completed or incomplete
        """
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            task = Task.query.filter_by(id=task_id).join(Klass).filter(Klass.user_id == current_user_id).first()

            if not task:
                return {'message': 'Task not found or you do not have permission'}, 404

            # If the data contains a completed status, update the task
            if 'completed' in data:
                if data['completed']:
                    task.completed = datetime.now()  # Mark as completed
                else:
                    task.completed = None  # Mark as incomplete
            db.session.commit()

            return task.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating task completion: {str(e)}"}, 500


# Register the routes
api.add_resource(TaskResource, '/tasks', '/tasks/<int:klass_id>')  # Fetch tasks by class_id or for all classes
api.add_resource(TaskDetailResource, '/tasks/<int:task_id>')  # For updating and deleting individual tasks
api.add_resource(TaskCompleteResource, '/tasks/<int:task_id>/complete')  # New route for task completion
