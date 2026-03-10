from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Create database
def init_db():
    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS expenses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER,
        category TEXT,
        description TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/add_expense", methods=["POST"])
def add_expense():

    data = request.json

    amount = data["amount"]
    category = data["category"]
    description = data["description"]

    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO expenses(amount, category, description) VALUES(?,?,?)",
        (amount, category, description)
    )

    conn.commit()
    conn.close()

    return jsonify({"message":"Expense Added"})


@app.route("/get_expenses")
def get_expenses():

    conn = sqlite3.connect("expenses.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM expenses")

    rows = cursor.fetchall()

    conn.close()

    expenses = []

    for row in rows:
        expenses.append({
            "id": row[0],
            "amount": row[1],
            "category": row[2],
            "description": row[3]
        })

    return jsonify(expenses)


if __name__ == "__main__":
    app.run(debug=True)