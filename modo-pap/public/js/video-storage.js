// video-storage.js - IndexedDB implementation for large video storage
(function(){
  const DB_NAME = 'NewSongVideos';
  const DB_VERSION = 1;
  const STORE_NAME = 'videos';
  let db = null;

  // Initialize IndexedDB
  function initDB(){
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if(!db.objectStoreNames.contains(STORE_NAME)){
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('instrument', 'instrument', { unique: false });
          objectStore.createIndex('module', 'module', { unique: false });
          objectStore.createIndex('lesson', 'lesson', { unique: false });
          objectStore.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        }
      };
    });
  }

  // Save video to IndexedDB
  function saveVideo(videoData){
    return new Promise((resolve, reject) => {
      if(!db){
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.add(videoData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all videos
  function getAllVideos(){
    return new Promise((resolve, reject) => {
      if(!db){
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get video by ID
  function getVideo(id){
    return new Promise((resolve, reject) => {
      if(!db){
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete video
  function deleteVideo(id){
    return new Promise((resolve, reject) => {
      if(!db){
        reject(new Error('Database not initialized'));
        return;
      }
      
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get storage usage estimate
  function getStorageEstimate(){
    if(navigator.storage && navigator.storage.estimate){
      return navigator.storage.estimate();
    }
    return Promise.resolve({ usage: 0, quota: 0 });
  }

  // Export API
  window.VideoStorage = {
    init: initDB,
    save: saveVideo,
    getAll: getAllVideos,
    get: getVideo,
    delete: deleteVideo,
    getStorageEstimate: getStorageEstimate
  };
})();
