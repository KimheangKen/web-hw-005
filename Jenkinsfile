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
    }
    stages {
        stage('Build') {
            steps {
                sh 'npn install' // Intentional typo to make it fail
            }
        }
        stage('Test') {
            steps {
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
    post {
        failure {
            script {
                def buildStatus = 'FAILURE'
                def jobName = env.JOB_NAME
                def buildNumber = env.BUILD_NUMBER

                // Archive the build log
                archiveArtifacts artifacts: 'build.log', allowEmptyArchive: true

                // Send the message to Telegram
                withCredentials([
                    string(credentialsId: 'telegram-token', variable: 'TOKEN'),
                    string(credentialsId: 'chat-id', variable: 'CHAT_ID')
                ]) {
                    sh """
                    curl -F document=@build.log https://api.telegram.org/bot${TOKEN}/sendDocument \
                    -F chat_id=${CHAT_ID} -F caption="Build failed: $jobName #$buildNumber"
                    """
                }
            }
        }
    }
}
