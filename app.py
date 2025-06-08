from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_schedule', methods=['POST'])
def generate_schedule():
    # This is where you'll implement your backend logic
    # For now, we'll just return a placeholder response
    data = request.json
    
    # Example of accessing the new data structure
    courses = data.get('courses', [])
    instructors = data.get('instructors', [])
    general_time_preferences = data.get('generalTimePreferences', {})
    day_time_preferences = data.get('dayTimePreferences', {})
    day_busyness = data.get('dayBusyness', {})
    
    # Log the received data (for debugging)
    print(f"Courses: {courses}")
    print(f"Instructors: {instructors}")
    print(f"General Time Preferences: {general_time_preferences}")
    print(f"Day-specific Time Preferences: {day_time_preferences}")
    print(f"Day Busyness: {day_busyness}")
    
    # Placeholder for the scheduling algorithm
    # This would be replaced with the actual implementation
    return jsonify({'success': True, 'message': 'Schedule generated successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
