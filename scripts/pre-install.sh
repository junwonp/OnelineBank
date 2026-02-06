echo "Running preinstall script for configuring yarn.lock"

bash -c '[ -n "$EAS_BUILD_NPM_CACHE_URL" ] && sed -i.bak -e "s#https://registry.yarnpkg.com#$EAS_BUILD_NPM_CACHE_URL#g" yarn.lock && rm -f yarn.lock.bak' || true

echo "Running preinstall script for configuring google-services.json and GoogleService-Info.plist"

# Create the directory if it doesn't exist
mkdir -p ./googleServices

# Decode the base64 strings and create the files
if [ "$EAS_BUILD_PROFILE" = "development" ]; then
  echo $GOOGLE_SERVICES_JSON_BASE64_DEV | base64 --decode >./googleServices/google-services.json
  echo $GOOGLE_SERVICES_PLIST_BASE64_DEV | base64 --decode >./googleServices/GoogleService-Info.plist
elif [ "$EAS_BUILD_PROFILE" = "staging" ]; then
  echo $GOOGLE_SERVICES_JSON_BASE64 | base64 --decode >./googleServices/google-services.json
  echo $GOOGLE_SERVICES_PLIST_BASE64 | base64 --decode >./googleServices/GoogleService-Info.plist
elif [ "$EAS_BUILD_PROFILE" = "production" ]; then
  echo $GOOGLE_SERVICES_JSON_BASE64 | base64 --decode >./googleServices/google-services.json
  echo $GOOGLE_SERVICES_PLIST_BASE64 | base64 --decode >./googleServices/GoogleService-Info.plist
fi

# Check if the files are empty
if [ "$EAS_BUILD_PLATFORM" = "android" ] && [ ! -s ./googleServices/google-services.json ]; then
  echo "Error: google-services.json is empty for Android build"
  exit 1
fi

if [ "$EAS_BUILD_PLATFORM" = "ios" ] && [ ! -s ./googleServices/GoogleService-Info.plist ]; then
  echo "Error: GoogleService-Info.plist is empty for iOS build"
  exit 1
fi
