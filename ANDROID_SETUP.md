# Android Firebase Setup Instructions

To complete the Firebase integration for your Android app, follow these steps to configure your Gradle files.

## 1. Project-level Build Gradle
Add the Google services Gradle plugin dependency to your root-level `build.gradle` (or `build.gradle.kts`) file.

**File Path**: `<project>/build.gradle.kts`
```kotlin
plugins {
  // ...
  // Add the dependency for the Google services Gradle plugin
  id("com.google.gms.google-services") version "4.4.4" apply false
}
```

## 2. App-level (Module) Build Gradle
Add the Google services plugin and the Firebase BoM to your app-level `build.gradle` (or `build.gradle.kts`) file.

**File Path**: `<project>/app/build.gradle.kts`
```kotlin
plugins {
  id("com.android.application")
  // Add the Google services Gradle plugin
  id("com.google.gms.google-services")
  // ...
}

dependencies {
  // Import the Firebase BoM
  implementation(platform("com.google.firebase:firebase-bom:34.11.0"))

  // Add the dependencies for Firebase products you want to use
  // When using the BoM, don't specify versions in Firebase dependencies
  implementation("com.google.firebase:firebase-analytics")
  implementation("com.google.firebase:firebase-firestore")
  implementation("com.google.firebase:firebase-auth")
}
```

## 3. Configuration File
The `google-services.json` file has been created in the project root. You should move it to the `app/` directory of your Android module.

**Source**: `google-services.json` (root)
**Destination**: `app/google-services.json`
