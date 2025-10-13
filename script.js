// Common functionality for both pages
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    if (window.location.pathname.includes('videoview.html')) {
        initVideoPlayer();
    } else {
        initVideoGallery();
    }
    
    // Initialize ads after a short delay to ensure page is loaded
    setTimeout(initializeAds, 1000);
});

// Ad initialization function
function initializeAds() {
    // Adsterra ads are already loaded in the HTML
    // This function can be used for additional ad tracking or optimization
    
    console.log('Ads initialized');
    
    // Track ad visibility (basic implementation)
    const adContainers = document.querySelectorAll('.ad-banner, .ad-infeed, .ad-video');
    adContainers.forEach(container => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Ad container is visible');
                    // You can trigger ad refresh or tracking here
                }
            });
        });
        
        observer.observe(container);
    });
}

// Video Gallery functionality
function initVideoGallery() {
    const videoGrid = document.getElementById('videoGrid');
    const loadingElement = document.getElementById('loading');
    
    if (!videoGrid) return;
    
    loadVideosFromFirebase();
}

// Video Player functionality
function initVideoPlayer() {
    const backButton = document.getElementById('backButton');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // Handle back button
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
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
            
            // Trigger ad refresh when video starts playing
            videoPlayer.addEventListener('play', function() {
                console.log('Video started playing - potential ad refresh point');
            });
        });
    }
}

// Firebase functions
function loadVideosFromFirebase() {
    const videoGrid = document.getElementById('videoGrid');
    const loadingElement = document.getElementById('loading');
    
    // Reference to videos in database
    const videosRef = database.ref('videos');
    
    videosRef.orderByChild('timestamp').once('value')
        .then((snapshot) => {
            const videos = [];
            snapshot.forEach((childSnapshot) => {
                videos.push(childSnapshot.val());
            });
            
            // Reverse to show newest first
            videos.reverse();
            
            displayVideos(videos);
            
            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            // Refresh ads after videos are loaded
            setTimeout(initializeAds, 500);
        })
        .catch((error) => {
            console.error('Error loading videos:', error);
            if (loadingElement) {
                loadingElement.textContent = 'Error loading videos';
            }
        });
}

function displayVideos(videos) {
    const videoGrid = document.getElementById('videoGrid');
    
    if (!videoGrid) return;
    
    videoGrid.innerHTML = '';
    
    videos.forEach((video, index) => {
        const videoElement = createVideoElement(video, index);
        videoGrid.appendChild(videoElement);
    });
}

function createVideoElement(video, index) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item fade-in';
    videoItem.style.animationDelay = `${index * 0.1}s`;
    
    const thumbnail = document.createElement('img');
    thumbnail.className = 'video-thumbnail';
    thumbnail.src = video.thumbnailUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsODAgMTgwLDEyMCAxMjAsMTYwIiBmaWxsPSIjZmZmIi8+PC9zdmc+';
    thumbnail.alt = 'Video thumbnail';
    
    // Add click event to navigate to video player
    videoItem.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            window.location.href = `videoview.html?video=${encodeURIComponent(video.videoUrl)}`;
        }, 200);
    });
    
    videoItem.appendChild(thumbnail);
    return videoItem;
}

// Add hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to interactive elements
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