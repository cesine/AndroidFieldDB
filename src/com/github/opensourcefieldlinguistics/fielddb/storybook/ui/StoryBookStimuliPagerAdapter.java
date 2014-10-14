package com.github.opensourcefieldlinguistics.fielddb.storybook.ui;

import java.util.ArrayList;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;

import com.briangriffey.notebook.PageTurnFragment;
import com.briangriffey.notebook.PageTurnPagerAdapter;
import com.github.opensourcefieldlinguistics.fielddb.model.Stimulus;

public class StoryBookStimuliPagerAdapter extends PageTurnPagerAdapter {
  private ArrayList<Stimulus> mStimuli;

  public StoryBookStimuliPagerAdapter(FragmentManager fm) {
    super(fm);
    // TODO Auto-generated constructor stub
  }

  public ArrayList<Stimulus> getStimuli() {
    return mStimuli;
  }

  public void setStimuli(ArrayList<Stimulus> mStimuli) {
    this.mStimuli = mStimuli;
  }

  @Override
  public Fragment getItem(int i) {
    Fragment fragment = new PageTurnFragment();
    Bundle args = new Bundle();
    // Our object is just an integer :-P
    args.putInt(PageTurnFragment.ARG_OBJECT, i + 1);
    fragment.setArguments(args);
    return fragment;
  }

  @Override
  public int getCount() {
    if (this.mStimuli != null) {
      return this.mStimuli.size();
    } else {
      return 0;
    }
  }

  @Override
  public CharSequence getPageTitle(int position) {
    return "OBJECT " + (position + 1);
  }
}