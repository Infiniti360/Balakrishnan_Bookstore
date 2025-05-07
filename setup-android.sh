#!/bin/bash

# Set Android SDK environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator

# Kill any existing Appium processes
pkill -f appium

# Start Appium server
appium --base-path / --address 127.0.0.1 --port 4723 &

# Wait for Appium to start
sleep 5

# Run the tests
npm run test:mobile 