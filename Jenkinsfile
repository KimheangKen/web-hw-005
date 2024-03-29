pipeline {
    agent {
        label 'jk-worker1'
    }
    // agent any
    tools {
        nodejs 'nodejs'
    }
    environment {
        DOCKER_REGISTRY = 'kimheang68'
        IMAGE_NAME = 'react-jenkin'
        CONTAINER_NAME = 'my-container'
        TELEGRAM_BOT_TOKEN = credentials('telegram-token')
        TELEGRAM_CHAT_ID = credentials('chat-id')
        BUILD_INFO = "${currentBuild.number}"
        COMMITTER = sh(script: 'git log -1 --pretty=format:%an', returnStdout: true).trim()
        BRANCH = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
        SONARQUBE_TOKEN = credentials('sonarqube-token')
    }

    stages {
        stage('Notify Start') {
            steps {
                script {

                    sendTelegramMessage("🚀 Pipeline Started:\nJob Name: ${env.JOB_NAME}\nJob Description: ${env.JOB_DESCRIPTION}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                }
            }
        }
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'sonarqube-scanner'
                    withSonarQubeEnv("sonarqube-server") {
                        // Define environment variables securely
                        def scannerCommand = """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=test-node-js \
                        -Dsonar.sources=. \
                        -Dsonar.css.node=. \
                        -Dsonar.host.url=http://34.143.129.86:9000 \
                        -Dsonar.login=${env.SONARQUBE_TOKEN}
                        """
                        def codeQualityLogs = sh script: scannerCommand, returnStatus: true

                        if (codeQualityLogs != 0) {
                            sendTelegramMessage("❌ Code Quality Check via SonarQube failed")
                            currentBuild.result = 'FAILURE'
                            error("Code Quality Check via SonarQube failed")
                        } else {
                            echo "✅ Code Quality Check via SonarQube succeeded"
                        }
                    }
                }
            }
        }


        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm install'
                        sh 'npm run build'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        def errorMessage = "❌ Build stage <b> failed </b>:\n${e.getMessage()}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}\nConsole Output: ${env.BUILD_URL}console"
                        sendTelegramMessage(errorMessage)
                        error(errorMessage)
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
                        // sendTelegramMessage("✅ Test stage succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Test stage <b> failed </b>: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
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
                            // sendTelegramMessage("✅ Container cleanup succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        } else {
                            // sendTelegramMessage("✅ No existing container to remove\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Check for Existing Container stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
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
                            // sendTelegramMessage("✅ Build Image stage succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Build Image stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
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
                        // sendTelegramMessage("✅ Trigger ManifestUpdate stage succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        sendTelegramMessage("❌ Trigger ManifestUpdate stage failed: ${e.message}\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
                        error("Trigger ManifestUpdate stage failed: ${e.message}")
                    }
                }
            }
        }
    }

    post {
        success {
            sendTelegramMessage("✅ All stages succeeded\nVersion: ${BUILD_INFO}\nCommitter: ${COMMITTER}\nBranch: ${BRANCH}")
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
