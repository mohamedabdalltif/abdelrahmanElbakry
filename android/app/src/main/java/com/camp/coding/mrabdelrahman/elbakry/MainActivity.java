package com.camp.coding.mrabdelrahman.elbakry;

import com.facebook.react.ReactActivity;
import android.view.WindowManager;
import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash;
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "abdelrahmanelbakry";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
  }

}
