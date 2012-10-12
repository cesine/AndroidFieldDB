## Deviations from the iOS version

Android typically uses a long-click to trigger additional action, as opposed to swipe-to-delete, so this convention was followed.

## Known Issues

- We currently do not handle the Sync URL changing at runtime (if you change it you have to restart the app)




Notes:

merged the TouchDB GrocerySync app with the existing AndroidFieldDB

grocerysync: https://github.com/Kedersha/AndroidGrocerySync

GrocerySync was an existing, working Android app that gave a structure for TouchDB to work within. It was pretty simple, and just consisted of a list of items that you could add to or delete. It also contacted IrisCouch to sync with the version stored on the Android.

Android FieldDB will hopefully be a working version of the existing FieldDB/LingSync project for field linguists. It will be able to help store and organize linguistic data offline on the Android (and sync).

To help the Android FieldDB work, we needed TouchDB to be usable, so we sort of cannibalized the GrocerySync app for its usable TouchDB. Everything's in rough shape still.
