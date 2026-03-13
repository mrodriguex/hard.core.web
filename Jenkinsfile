pipeline {
    agent any

    triggers { githubPush() }

    environment {
        SERVER = "${env.DEPLOY_SERVER_hardcore-web}"
        USER = "${env.DEPLOY_USER_hardcore-web}"
        DEPLOY_PATH = "${env.DEPLOY_PATH_hardcore-web}"
        REPO_URL = 'https://github.com/mrodriguex/hard.core.web.git'
        REPO_BRANCH = 'main'
        APP_DIR = 'hardcore-web'
        DIST_DIR = 'hardcore-web/dist'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def targetBranch = env.BRANCH_NAME?.trim() ? env.BRANCH_NAME : env.REPO_BRANCH
                    git url: env.REPO_URL,
                        credentialsId: 'github-token',
                        branch: targetBranch
                }
            }
        }

        stage('Validate Environment') {
            steps {
                sh '''
                    [ -n "${SERVER}" ] || { echo "DEPLOY_SERVER_hardcore is not set"; exit 1; }
                    [ -n "${USER}" ] || { echo "DEPLOY_USER_hardcore is not set"; exit 1; }
                    [ -n "${DEPLOY_PATH}" ] || { echo "DEPLOY_PATH_hardcore is not set"; exit 1; }
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    cd "${APP_DIR}"
                    npm ci
                '''
            }
        }

        stage('Lint') {
            steps {
                sh '''
                    cd "${APP_DIR}"
                    npm run lint
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    cd "${APP_DIR}"
                    npm run build

                    if [ ! -d "dist" ]; then
                      echo "Build output not found at ${APP_DIR}/dist"
                      exit 1
                    fi
                '''
            }
        }

        stage('Prepare Deployment') {
            steps {
                sshagent(['deployment_key']) {
                    script {
                        def dirExists = sh(
                            script: """
                                ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "
                                    if [ -d \"${DEPLOY_PATH}\" ]; then
                                        echo 'EXISTS'
                                    else
                                        echo 'NOT_EXISTS'
                                    fi
                                "
                            """,
                            returnStdout: true
                        ).trim()
                        
                        if (dirExists == 'NOT_EXISTS') {
                            echo "Creando directorio ${DEPLOY_PATH}..."
                            sh """
                                ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "
                                    mkdir -p \"${DEPLOY_PATH}\"
                                    echo 'Directorio creado'
                                "
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['deployment_key']) {
                    sh """
                        rsync -avz --delete \
                          -e "ssh -o StrictHostKeyChecking=no" \
                                                    ${DIST_DIR}/ ${USER}@${SERVER}:"${DEPLOY_PATH}/"

                        ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "
                            echo 'Deploy completed in ${DEPLOY_PATH}'
                                                        ls -la \"${DEPLOY_PATH}\" | head -20
                        "
                    """
                }
            }
        }
        
        stage('Verify') {
            steps {
                sshagent(['deployment_key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${USER}@${SERVER} "
                            if [ -f \"${DEPLOY_PATH}/index.html\" ]; then
                                echo '✅ Frontend deployed correctly (index.html found)'
                                echo '📁 Build files:'
                                ls -la \"${DEPLOY_PATH}/\" | head -20
                            else
                                echo '❌ Deployment verification failed (index.html not found)'
                                exit 1
                            fi
                        "
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ HARD.CORE WEB deployed successfully!'
        }
        failure {
            echo '❌ Frontend deployment failed'
        }
    }
}