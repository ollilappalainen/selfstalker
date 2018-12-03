//imports
package com.selfstalker.service;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

public class StalkUserService extends HeadlessJsTaskService {

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                "StalkUser",
                Arguments.fromBundle(extras),
                5000,
                true
            );
        }
        
        return null;
    }
}