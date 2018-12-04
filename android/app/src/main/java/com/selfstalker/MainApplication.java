package com.selfstalker;

/* Android imports */
import android.app.Application;
import android.location.LocationManager;
import android.location.LocationListener;
import android.location.Location;
import android.content.Context;
import android.os.Bundle;
import android.content.Intent;

/* React and React Native imports */
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.HeadlessJsTaskService;

/* MapBox imports */
import com.mapbox.rctmgl.RCTMGLPackage;

/* Java imports */
import java.util.Arrays;
import java.util.List;

/* Custom imports */
// import com.selfstalker.service.StalkUserService;

public class MainApplication extends Application implements ReactApplication {

  // private final LocationListener listener = new LocationListener() {
  //   @Override
  //   public void onStatusChanged(String provider, int status, Bundle extras) {
  //   }
    
  //   @Override
  //   public void onProviderEnabled(String provider) {
  //   }

  //   @Override
  //   public void onProviderDisabled(String provider) {
  //   }

  //   @Override
  //   public void onLocationChanged(Location location) {
  //     Intent myIntent = new Intent(getApplicationContext(), StalkUserService.class);
  //     getApplicationContext().startService(myIntent);
  //     HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());
  //   }
  // };

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTMGLPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    // LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);     
    // // Start requesting for location
    // locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 1, listener);

    SoLoader.init(this, /* native exopackage */ false);
  }
}
