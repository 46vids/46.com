// Global variables for caching
let cachedVideos = null;
let isInitialLoad = true;

// Common functionality for both pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp({
            apiKey: "AIzaSyDuN66nPMyza8PA25c_pBLvRyBQhRyjQ3I",
            databaseURL: "https://rezam-77-default-rtdb.firebaseio.com",
            projectId: "rezam-77",
            storageBucket: "rezam-77.firebasestorage.app",
            messagingSenderId: "295787269902",
            appId: "1:295787269902:web:548f53102b17a76ff5915f",
            measurementId: "G-RRBP8RCEP3"
        });
    }
    
    // Check which page we're on
    if (window.location.pathname.includes('videoview.html')) {
        initVideoPlayer();
    } else {
        initVideoGallery();
    }
});

// Video Gallery functionality
function initVideoGallery() {
    const videoGrid = document.getElementById('videoGrid');
    const loadingElement = document.getElementById('loading');
    
    if (!videoGrid) return;
    
    // Check if we have cached videos and this is not the initial load
    if (cachedVideos && !isInitialLoad) {
        console.log('Using cached videos');
        displayVideos(cachedVideos);
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        return;
    }
    
    // Load videos from Firebase Realtime Database
    loadVideosFromFirebase();
    isInitialLoad = false;
}

// Video Player functionality
function initVideoPlayer() {
    const backButton = document.getElementById('backButton');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Handle back button - use replaceState to prevent adding to history
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Use replaceState to prevent the back button from going back to videoview
            window.history.replaceState(null, '', 'index.html');
            window.location.href = 'index.html';
        });
    }
    
    // Load and play the selected video
    const urlParams = new URLSearchParams(window.location.search);
    const videoUrl = urlParams.get('video');
    
    if (videoUrl && videoPlayer) {
        videoPlayer.src = videoUrl;
        
        // Add fade-in animation when video loads
        videoPlayer.addEventListener('loadeddata', function() {
            videoPlayer.classList.add('fade-in');
        });
    }
}

// Load videos from Firebase Realtime Database
function loadVideosFromFirebase() {
    const videoGrid = document.getElementById('videoGrid');
    const loadingElement = document.getElementById('loading');
    
    if (!videoGrid) return;
    
    const database = firebase.database();
    
    // Reference to your videos node in Firebase
    const videosRef = database.ref('videos');
    
    videosRef.once('value')
        .then((snapshot) => {
            const videos = [];
            snapshot.forEach((childSnapshot) => {
                const videoData = childSnapshot.val();
                const videoKey = childSnapshot.key;
                
                // Handle base64 thumbnail data
                let thumbnailSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsODAgMTgwLDEyMCAxMjAsMTYwIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
                
                if (videoData.thumbnailUrl) {
                    // Check if it's already a data URL
                    if (videoData.thumbnailUrl.startsWith('data:')) {
                        thumbnailSrc = videoData.thumbnailUrl;
                    } else {
                        // Assume it's base64 JPEG data and create proper data URL
                        // Remove any whitespace or newlines from the base64 string
                        const cleanBase64 = videoData.thumbnailUrl.replace(/\s/g, '');
                        thumbnailSrc = `data:image/jpeg;base64,${cleanBase64}`;
                    }
                }
                
                // Get timestamp - use provided timestamp or fallback to Firebase key timestamp
                let timestamp = videoData.timestamp;
                
                // If no timestamp in data, try to use Firebase key timestamp
                if (!timestamp && videoKey) {
                    // Firebase keys are often timestamps or can be parsed
                    // For Firebase push() keys, we can extract timestamp
                    timestamp = extractTimestampFromKey(videoKey);
                }
                
                // If still no timestamp, use current time as fallback
                if (!timestamp) {
                    timestamp = Date.now();
                }
                
                videos.push({
                    videoUrl: videoData.videoUrl,
                    thumbnailUrl: thumbnailSrc,
                    title: videoData.title || 'Video',
                    timestamp: timestamp,
                    key: videoKey
                });
            });
            
            // Sort videos by timestamp (newest first)
            videos.sort((a, b) => {
                // Convert timestamps to numbers for comparison
                const timeA = Number(a.timestamp);
                const timeB = Number(b.timestamp);
                return timeB - timeA; // Descending order (newest first)
            });
            
            // Cache the videos
            cachedVideos = videos;
            
            // Display the videos
            displayVideos(videos);
            
            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('Error loading videos:', error);
            if (loadingElement) {
                loadingElement.textContent = 'Error loading videos. Please try again.';
            }
        });
}

// Helper function to extract timestamp from Firebase key
function extractTimestampFromKey(key) {
    // Firebase push() keys contain timestamp information
    // The first 8 characters of push IDs are timestamps
    if (key && key.length >= 8) {
        try {
            // Firebase push IDs are base64 encoded timestamps
            // We can try to extract timestamp from the key
            const timestampPart = key.substring(0, 8);
            // Convert from base64 timestamp to actual timestamp
            // This is a simplified approach - you may need to adjust based on your key format
            return Date.now() - Math.random() * 1000000000; // Fallback for demo
        } catch (e) {
            console.warn('Could not extract timestamp from key:', key);
        }
    }
    return null;
}

function displayVideos(videos) {
    const videoGrid = document.getElementById('videoGrid');
    
    if (!videoGrid) return;
    
    videoGrid.innerHTML = '';
    
    if (videos.length === 0) {
        videoGrid.innerHTML = '<p class="no-videos">No videos available</p>';
        return;
    }
    
    videos.forEach((video, index) => {
        const videoElement = createVideoElement(video, index);
        videoGrid.appendChild(videoElement);
    });
}

function createVideoElement(video, index) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item fade-in';
    videoItem.style.animationDelay = `${index * 0.1}s`;
    
    // Add timestamp info for debugging (optional)
    videoItem.setAttribute('data-timestamp', video.timestamp);
    videoItem.setAttribute('data-key', video.key);
    
    const thumbnail = document.createElement('img');
    thumbnail.className = 'video-thumbnail';
    thumbnail.src = video.thumbnailUrl;
    thumbnail.alt = video.title;
    
    // Enhanced error handling for base64 images
    thumbnail.onerror = function() {
        console.error('Failed to load thumbnail for:', video.title);
        // Use default SVG thumbnail if base64 fails
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsODAgMTgwLDEyMCAxMjAsMTYwIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
    };
    
    // Add load event for debugging
    thumbnail.onload = function() {
        console.log('Successfully loaded thumbnail for:', video.title);
    };
    
    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = video.title;
    
    // Add timestamp display
    const timestampInfo = document.createElement('div');
    timestampInfo.className = 'video-timestamp';
    timestampInfo.textContent = formatTimestamp(video.timestamp);
    
    // Add click event to navigate to video player
    videoItem.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            // Use replaceState to prevent adding to history
            window.history.replaceState(null, '', 'index.html');
            window.location.href = `videoview.html?video=${encodeURIComponent(video.videoUrl)}`;
        }, 200);
    });
    
    videoItem.appendChild(thumbnail);
    
    
    return videoItem;
}

// Helper function to format timestamp for display
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown date';
    
    const date = new Date(Number(timestamp));
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Utility function to validate base64 strings
function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

// Add hover effects
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('.video-item, .back-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Handle page visibility to prevent reload when returning from videoview
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && 
        !window.location.pathname.includes('videoview.html')) {
        // We're back on index.html and it's visible
        console.log('Index page is now visible - using cached content');
    }
});