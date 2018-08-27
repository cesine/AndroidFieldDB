package com.github.fielddb.service;

import android.accounts.Account;
import android.content.AbstractThreadedSyncAdapter;
import android.content.ContentProviderClient;
import android.content.ContentResolver;
import android.content.Context;
import android.content.SyncResult;
import android.os.Bundle;
import android.util.Log;

import com.github.fielddb.BuildConfig;
import com.github.fielddb.Config;
import com.github.fielddb.datacollection.NotifyingIntentService;
import com.google.gson.JsonObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class CorpusSyncAdapter extends AbstractThreadedSyncAdapter {
  // Global variables
  // Define a variable to contain a content resolver instance
  ContentResolver mContentResolver;

  /**
   * Set up the sync adapter
   */
  public CorpusSyncAdapter(Context context, boolean autoInitialize) {
    super(context, autoInitialize);
    /*
     * If your app uses a content resolver, get an instance of it
     * from the incoming Context
     */
    mContentResolver = context.getContentResolver();
  }

  /**
   * Set up the sync adapter. This form of the
   * constructor maintains compatibility with Android 3.0
   * and later platform versions
   */
  public CorpusSyncAdapter(
    Context context,
    boolean autoInitialize,
    boolean allowParallelSyncs) {
    super(context, autoInitialize, allowParallelSyncs);
    /*
     * If your app uses a content resolver, get an instance of it
     * from the incoming Context
     */
    mContentResolver = context.getContentResolver();
  }

  /*
   * Specify the code you want to run in the sync adapter. The entire
   * sync adapter runs in a background thread, so you don't have to set
   * up your own background processing.
   */
  @Override
  public void onPerformSync(
    Account account,
    Bundle extras,
    String authority,
    ContentProviderClient provider,
    SyncResult syncResult) {
    String JSONResponse;

    /*
     * Put the data transfer code here.
     */

    Log.d(Config.TAG, "onPerformSync");

    CookieManager cookieManager = new CookieManager();
    // cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
    CookieHandler.setDefault(cookieManager);

    String urlStringAuthenticationSession = Config.DEFAULT_DATA_LOGIN;
    URL url;
    HttpURLConnection urlConnection;
    try {
      url = new URL(urlStringAuthenticationSession);
      urlConnection = (HttpURLConnection) url.openConnection();
      urlConnection.setRequestMethod("POST");
      urlConnection.setRequestProperty("Content-Type", "application/json");
      urlConnection.setDoInput(true);
      urlConnection.setDoOutput(true);
      urlConnection.connect();
    } catch (MalformedURLException e) {
      e.printStackTrace();
      return;
    } catch (ProtocolException e) {
      e.printStackTrace();
      return;
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }

    JsonObject jsonParam = new JsonObject();
    jsonParam.addProperty("name", "public");
    jsonParam.addProperty("password", "none");
    DataOutputStream printout;
    try {
      printout = new DataOutputStream(urlConnection.getOutputStream());
      String jsonString = jsonParam.toString();
      printout.write(jsonString.getBytes());
      printout.flush();
      printout.close();
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }

    if (!url.getHost().equals(urlConnection.getURL().getHost())) {
      Log.d(Config.TAG, "We were redirected! Kick the user out to the browser to sign on?");
    }
    /* Open the input or error stream */
    int status;
    try {
      status = urlConnection.getResponseCode();
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }
    if (BuildConfig.DEBUG) {
      Log.d(Config.TAG, "Server status code " + status);
    }
    BufferedInputStream responseStream;
    try {
      if (status < 400 && urlConnection.getInputStream() != null) {
        responseStream = new BufferedInputStream(urlConnection.getInputStream());
      } else {
        responseStream = new BufferedInputStream(urlConnection.getErrorStream());
      }
      BufferedReader responseStreamReader = new BufferedReader(new InputStreamReader(responseStream));
      String line = "";
      StringBuilder stringBuilder = new StringBuilder();
      while ((line = responseStreamReader.readLine()) != null) {
        stringBuilder.append(line).append("\n");
      }
      responseStreamReader.close();

      JSONResponse = stringBuilder.toString();
    } catch (IOException e) {
      e.printStackTrace();
      return;
    }

    Log.d(Config.TAG, url + ":::" + JSONResponse);
  }
}
