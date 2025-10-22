from flask import Flask,jsonify,request
from models.likes_model import Likes

class LikesController:
    @staticmethod
    def add_like(user_id, vacation_id):
        if not user_id or not vacation_id:
            return jsonify({'error': 'user_id and vacation_id are required'}), 400
        result = Likes.create(user_id, vacation_id)
        if result:
            return jsonify(result)
        return jsonify({'error': 'could not add like'}), 500
    
    @staticmethod
    def get_all_likes():
        likes=Likes.get_all()
        return jsonify({'likes': likes})
    
    @staticmethod
    def get_all_likes_with_names():
        likes=Likes.get_all_likes()
        return jsonify({'likes': likes})

    @staticmethod
    def get_likes_count(vacation_id):
        count = Likes.get_likes_count_by_vacation(vacation_id)
        return jsonify({"vacation_id": vacation_id, "likes_count": count})

    @staticmethod
    def remove_like(user_id, vacation_id):
        if not user_id or not vacation_id:
            return jsonify({'error': 'user_id and vacation_id are required'}), 400
        result = Likes.delete(user_id, vacation_id)
        if result is None:
            return jsonify({'error': 'like row not found'}), 404
        return jsonify(result)
