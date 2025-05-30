from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import hashlib
import os

app = Flask(__name__)
app.secret_key = 'pipeishon_secret_key_2024'

# Configuración de la base de datos
DATABASE = 'pipeishon.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            (username, hash_password(password))
        ).fetchone()
        conn.close()
        
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash('¡Bienvenido de vuelta!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Usuario o contraseña incorrectos', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            flash('Las contraseñas no coinciden', 'error')
            return render_template('register.html')
        
        conn = get_db_connection()
        
        # Verificar si el usuario ya existe
        existing_user = conn.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            (username, email)
        ).fetchone()
        
        if existing_user:
            flash('El usuario o email ya existe', 'error')
            conn.close()
            return render_template('register.html')
        
        # Crear nuevo usuario
        try:
            conn.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, hash_password(password))
            )
            conn.commit()
            flash('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success')
            conn.close()
            return redirect(url_for('login'))
        except sqlite3.Error:
            flash('Error al crear la cuenta', 'error')
            conn.close()
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'success')
    return redirect(url_for('index'))

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
        (name, email, message)
    )
    conn.commit()
    conn.close()
    
    flash('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success')
    return redirect(url_for('index'))

@app.route('/product/<product_name>')
def product(product_name):
    products = {
        'pipeishon-one': {
            'name': 'Pipeishon One',
            'description': 'Consola retro con Arduino que imita el estilo clásico de Nintendo. Revive la nostalgia de los videojuegos de 8-bits con esta increíble consola.',
            'features': [
                'Procesador Arduino personalizado',
                'Gráficos de 8-bits auténticos',
                'Compatibilidad con cartuchos retro',
                'Controles clásicos ergonómicos',
                'Salida de video compuesto y HDMI'
            ],
            'price': '$299.99',
            'image': 'pipeishon-one.jpg'
        },
        'pipeishon-sound': {
            'name': 'Pipeishon Sound',
            'description': 'Amplificador de sonido premium que se conecta vía cable Jack a tu PC o celular. Experimenta un audio cristalino y potente.',
            'features': [
                'Conexión Jack 3.5mm universal',
                'Amplificación de alta fidelidad',
                'Control de volumen y ecualización',
                'Diseño compacto y portátil',
                'Compatible con todos los dispositivos'
            ],
            'price': '$89.99',
            'image': 'pipeishon-sound.jpg'
        },
        'pipeishon-rc': {
            'name': 'Pipeishon RC',
            'description': 'Auto a control remoto con plaqueta personalizada y servomotores de precisión. Diversión garantizada para todas las edades.',
            'features': [
                'Control remoto de largo alcance',
                'Servomotores de alta precisión',
                'Batería recargable de larga duración',
                'Chasis resistente a impactos',
                'Velocidad ajustable'
            ],
            'price': '$149.99',
            'image': 'pipeishon-rc.jpg'
        }
    }
    
    if product_name in products:
        return render_template('product.html', product=products[product_name])
    else:
        return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)

