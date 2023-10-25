pipeline {
    // agent any
    agent {
        label 'jk-worker1' // Assign a default agent for the entire pipeline
    }
    tools {
        nodejs 'nodejs'
    }

    environment {
        DOCKER_REGISTRY = 'kimheang68'
        IMAGE_NAME = 'react-jenkin'
        CONTAINER_NAME = 'my-container' // Specify the name of your container

    }

    stages {

        stage('Push Notification') {
            steps {
                script {
                    def buildStatus = currentBuild.currentResult
                    def buildNumber = currentBuild.number
                    def gitBranch = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    def notificationMessage = "<b>Project</b>: Your Project Name\n"
                    notificationMessage += "<b>Branch</b>: ${gitBranch}\n"
                    notificationMessage += "<b>Build</b>: ${buildStatus}\n"
                    notificationMessage += "<b>Build Number</b>: ${buildNumber}\n"

                    // Send a notification to Telegram
                    withCredentials([
                        string(credentialsId: 'telegram-token', variable: 'TOKEN'),
                        string(credentialsId: 'chat-id', variable: 'CHAT_ID')
                    ]) {
                        sh """
                        curl -s -X POST https://api.telegram.org/bot${TOKEN}/sendMessage \
                        -d chat_id=${CHAT_ID} -d parse_mode="HTML" -d text="${notificationMessage}"
                        """
                    }
                }
            }
        }
        

        stage('Build') {
            steps {
                sh 'npm install'
                // sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                // sh 'npm run test'
                echo "Test"
                sh "echo IMAGE_NAME is ${env.IMAGE_NAME}" 
            }
        }
        stage('Check for Existing Container') {
            steps {
                script {
                    def containerId = sh(script: "docker ps -a --filter name=${env.CONTAINER_NAME} -q", returnStdout: true).trim()
                    sh "echo containerId is ${containerId}" 
                    if (containerId) {
                        sh "docker stop ${containerId}"
                        sh "docker rm ${containerId}"
                    } else {
                        sh "echo No existing container to remove"
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    def buildNumber = currentBuild.number
                    def imageTag = "${IMAGE_NAME}:${buildNumber}"
                    sh "docker build -t ${DOCKER_REGISTRY}/${imageTag} ."

                    withCredentials([usernamePassword(credentialsId: 'docker-hub-cred',
                            passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${DOCKER_REGISTRY}/${imageTag}"
                    }
                }
            }
        }
        

        
        stage('Trigger ManifestUpdate') {
            steps {
                    build job: 'test2', parameters: [string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)]
            }
        }
        
    }
}
