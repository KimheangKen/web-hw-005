pipeline {
    agent {
        label 'jk-worker1'
    }
    tools {
        nodejs 'nodejs'
    }
    environment {
        DOCKER_REGISTRY = 'kimheang68'
        IMAGE_NAME = 'react-jenkin'
        CONTAINER_NAME = 'my-container'
        TELEGRAM_BOT_TOKEN = credentials('telegram-token')
        TELEGRAM_CHAT_ID = credentials('chat-id')
    }
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm install'
                        // sh 'npm run build'
                        sendTelegramMessage("✅ Build stage succeeded")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Build stage failed: ${e.message}")
                        error("Build stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    try {
                        // sh 'npm run test'
                        echo "Test"
                        sh "echo IMAGE_NAME is ${env.IMAGE_NAME}"
                        sendTelegramMessage("✅ Test stage succeeded")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Test stage failed: ${e.message}")
                        error("Test stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Check for Existing Container') {
            steps {
                script {
                    try {
                        def containerId = sh(script: "docker ps -a --filter name=${env.CONTAINER_NAME} -q", returnStdout: true).trim()
                        sh "echo containerId is ${containerId}" 
                        if (containerId) {
                            sh "docker stop ${containerId}"
                            sh "docker rm ${containerId}"
                            sendTelegramMessage("✅ Container cleanup succeeded")
                        } else {
                            sendTelegramMessage("✅ No existing container to remove")
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Check for Existing Container stage failed: ${e.message}")
                        error("Check for Existing Container stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    try {
                        def buildNumber = currentBuild.number
                        def imageTag = "${IMAGE_NAME}:${buildNumber}"
                        sh "docker build -t ${DOCKER_REGISTRY}/${imageTag} ."

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-cred',
                                passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                            sh "echo \$PASS | docker login -u \$USER --password-stdin"
                            sh "docker push ${DOCKER_REGISTRY}/${imageTag}"
                        }

                        sendTelegramMessage("✅ Build Image stage succeeded")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Build Image stage failed: ${e.message}")
                        error("Build Image stage failed: ${e.message}")
                    }
                }
            }
        }
        stage('Trigger ManifestUpdate') {
            steps {
                script {
                    try {
                        build job: 'test2', parameters: [string(name: 'DOCKERTAG', value: env.BUILD_NUMBER)]
                        sendTelegramMessage("✅ Trigger ManifestUpdate stage succeeded")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Trigger ManifestUpdate stage failed: ${e.message}")
                        error("Trigger ManifestUpdate stage failed: ${e.message}")
                    }
                }
            }
        }
    }
}

def sendTelegramMessage(message) {
    script {
        sh """
            curl -s -X POST https://api.telegram.org/bot\${TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=\${TELEGRAM_CHAT_ID} -d parse_mode="HTML" -d text="${message}"
        """
    }
}
