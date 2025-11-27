from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test')
def test_endpoint():
    return {"message": "Test endpoint is working!"}

@app.route('/todos/completed-count', methods=['POST'])
def completed_count():
    data = request.get_json() 
    todos = data.get('todos', [])

    completed = sum(1 for t in todos if t.get('completed') is True)
    pending = sum(1 for t in todos if t.get('completed') is False)

    return jsonify({"pending_count": pending, "completed_count": completed})

if __name__ == '__main__':
    app.run(debug=True)
