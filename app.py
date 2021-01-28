from flask import Flask, render_template, session, request, redirect
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3
from tempfile import mkdtemp
from helpers import empty

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren"t cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



@app.route("/")
def main():
    return render_template("main.html")

@app.route("/error")
def error(message,number):
    return render_template("error.html")


@app.route("/synth", methods=["GET", "POST"])
def synth():
    if request.method == "POST":
        pass
    
    else:
        try:
            if session["user_id"]:
                db = sqlite3.connect("wavewall.db")
                db.row_factory = sqlite3.Row
                ex = db.cursor()
                row = ex.execute("SELECT username FROM users WHERE id = ?", (session["user_id"],))
                r = row.fetchone()
                r.keys()
                username = r["username"]
                db.close()
                return render_template("synth.html", **locals())
        except:
            return render_template("synth.html")


@app.route("/user", methods=["GET", "POST"])
def user():
    if request.method == "POST":
        pass
    
    else:
        try:
            if session["user_id"]:
                db = sqlite3.connect("wavewall.db")
                db.row_factory = sqlite3.Row
                ex = db.cursor()
                row = ex.execute("SELECT username FROM users WHERE id = ?", (session["user_id"],))
                r = row.fetchone()
                r.keys()
                username = r["username"]
                db.close()
                return render_template("user.html", **locals())
        except:
            return render_template("user.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Open db
        db = sqlite3.connect("wavewall.db")
        db.row_factory = sqlite3.Row
        ex = db.cursor()
        username = request.form.get("username")
        hashpass = generate_password_hash(request.form.get("password"))

        # Ensure username was submitted
        if not request.form.get("username"):
            return error("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return error("must provide password", 403)

        # Query database for username
        rows = ex.execute("SELECT * FROM users WHERE username =?",
                          (username,))

        # Ensure username exists and password is correct
        r = rows.fetchone()
        r.keys()

        if r["username"] != username or check_password_hash(r["hash"], request.form.get("password")) == False:
            return error("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = r["id"]
        db.close()
        # Redirect user to home page
        return redirect("/synth")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/synth")


@app.route("/register", methods=["GET", "POST"])
def register():
    #Register user
    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        db = sqlite3.connect("wavewall.db")
        ex = db.cursor()
        username = request.form.get("username")
        hashpass = generate_password_hash(request.form.get("password"))
        
        # Ensure username was submitted
        if not request.form.get("username"):
            return error("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return error("must provide password", 403)

        # Password must match password confirmation
        elif request.form.get("password") != request.form.get("confirmpassword"):
            return error("passwords must match", 403)
        
        rows = ex.execute("SELECT * FROM users WHERE username=?",
                          (username, ))

        # -- username needs to be unique
        list_rows = rows.fetchall()
        username_check = empty(list_rows)
        if username_check == False:
            return error("username is taken", 403)
            

        else:
            # -- password needs to be hashed and saved in the users table
            ex.execute("INSERT INTO users (username, hash) VALUES (?, ?)", (username, hashpass))
            db.commit()
            db.close()
            return redirect("/synth")
    else:
    # when requested via GET display form similar to login.html + password confirmation
        return render_template("register.html")
    

@app.route("/about")
def about():
    try:
        if session["user_id"]:
            db = sqlite3.connect("wavewall.db")
            db.row_factory = sqlite3.Row
            ex = db.cursor()
            row = ex.execute("SELECT username FROM users WHERE id = ?", (session["user_id"],))
            r = row.fetchone()
            r.keys()
            username = r["username"]
            db.close()
            return render_template("about.html", **locals())
    except:
        return render_template("about.html")
    