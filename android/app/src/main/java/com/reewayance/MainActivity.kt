package com.reewayance

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

override fun onCreate(savedInstanceState: Bundle?) {
    // Show splash screen before super.onCreate()
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)
  }
  
  override fun getMainComponentName(): String = "Reewayance"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
