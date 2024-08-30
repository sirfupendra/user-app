from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId 

app = Flask(__name__)
CORS(app)

# JWT configuration
app.config['JWT_SECRET_KEY'] = '<asdfghjkl'  # Change this to a secure secret key
jwt = JWTManager(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['userdatabase']  # Replace with your database name
users_collection = db['user']  # Collection to store user data

@app.route('/signup', methods=['POST'])
def signup_user():
    data = request.json
    name = data.get('Name')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))

    # Check if user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400

    users_collection.insert_one({
        'name': name,
        'email': email,
        'password': password,
        'is_blocked': False  # Add default blocked status
    })

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})

    if user and check_password_hash(user['password'], password):
        # Create JWT token
        access_token = create_access_token(identity={'email': email})
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # For simplicity, this endpoint just requires a valid token to log out
    return jsonify({"msg": "Logout successful"}), 200

@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = users_collection.find()
    user_list = [{'id': str(user['_id']), 'name': user['name'], 'email': user['email'], 'is_blocked': user.get('is_blocked', False)} for user in users]
    return jsonify(user_list), 200

@app.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.json
    name = data.get('name')

    # Convert user_id to ObjectId before using it in the query
    result = users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'name': name}})
    
    if result.matched_count:
        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    result = users_collection.delete_one({'_id': user_id})
    
    if result.deleted_count:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<user_id>/block', methods=['POST'])
@jwt_required()
def block_user(user_id):
    result = users_collection.update_one({'_id': user_id}, {'$set': {'is_blocked': True}})
    
    if result.matched_count:
        return jsonify({'message': 'User blocked successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<user_id>/unblock', methods=['POST'])
@jwt_required()
def unblock_user(user_id):
    result = users_collection.update_one({'_id': user_id}, {'$set': {'is_blocked': False}})
    
    if result.matched_count:
        return jsonify({'message': 'User unblocked successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
