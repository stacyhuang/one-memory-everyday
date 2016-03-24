var ImagePickerOptions = {
  photo: {
    title: 'Upload Photo', // specify null or empty string to remove the title
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'high', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    // maxWidth: 500, // photos only
    // maxHeight: 500, // photos only
    quality: 1, // 0 to 1, photos only
    allowsEditing: true, // Built in functionality to resize/reposition the image after selection
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
      skipBackup: true, // ios only - image will NOT be backed up to icloud
      path: 'images' // ios only - will save image at /Documents/images rather than the root
    }
  }
};

module.exports = ImagePickerOptions;
