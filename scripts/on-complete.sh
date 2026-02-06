# Check if EAS_BUILD_PLATFORM is ios
if [ "$EAS_BUILD_PLATFORM" != "ios" ]; then
  echo "Skipping script as EAS_BUILD_PLATFORM is not ios"
  exit 0
fi

# Define constants
PODS_ROOT="ios/Pods"
DSYM_DIRECTORY="ios/build"
GOOGLE_SERVICES_INFO_PLIST="googleServices/GoogleService-Info.plist"

# Check if required files and directories exist
if [ ! -d "$PODS_ROOT" ]; then
  echo "Error: PODS_ROOT directory does not exist: $PODS_ROOT"
  exit 1
fi

if [ ! -d "$DSYM_DIRECTORY" ]; then
  echo "Error: dSYM directory does not exist: $DSYM_DIRECTORY"
  exit 1
fi

if [ ! -f "$GOOGLE_SERVICES_INFO_PLIST" ]; then
  echo "Error: Google Services Info plist does not exist: $GOOGLE_SERVICES_INFO_PLIST"
  exit 1
fi

# Execute the upload-symbols command
"$PODS_ROOT/FirebaseCrashlytics/upload-symbols" -gsp "$GOOGLE_SERVICES_INFO_PLIST" -p ios "$DSYM_DIRECTORY"
if [ $? -ne 0 ]; then
  echo "Error: Failed to upload symbols"
  exit 1
fi

echo "Symbols uploaded successfully"
