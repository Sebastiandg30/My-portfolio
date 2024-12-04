pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Clona el código desde el repositorio Git
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                // Construye la imagen Docker
                sh 'docker build -t portfolio-website .'
            }
        }
        stage('Run Docker Container') {
            steps {
                // Ejecuta el contenedor Docker
                sh 'docker run -d -p 3000:3000 portfolio-website'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
    }
}
