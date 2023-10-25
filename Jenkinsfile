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
        VERSION_INFO = sh(script: 'git describe --tags --always', returnStdout: true).trim()
        COMMITTER = sh(script: 'git log -1 --pretty=format:%an', returnStdout: true).trim()
        BRANCH = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
    }
    stages {
        stage('Notify Start') {
            steps {
                script {
                    def message = """
                    🚀 Pipeline Started:

                    Job Name: ${env.JOB_NAME}
                    Job Description: ${env.JOB_DESCRIPTION}
                    Version: ${VERSION_INFO}
                    Committer: ${COMMITTER}
                    Branch: ${BRANCH}
                    """
                    sendTelegramMessage(message)
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm install'
                        // sh 'npm run build'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Build stage failed: ${e.message}")
                        error("Build stage failed: ${e.message}")
                    }
                }
            }
        }
        // Add your other stages here
    }

    post {
        success {
            sendTelegramMessage("✅ All stages succeeded")
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
