pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'portfolio-website'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    sh "docker run -d -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        cleanup {
            // Opcional: Limpia contenedores o imágenes innecesarias
            sh "docker system prune -f"
        }
    }
}
