// Common functionality for both pages
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Load sample videos instead of Firebase
    loadSampleVideos();
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
        });
    }
}

// Load sample videos (replace with your actual video URLs)
function loadSampleVideos() {
    const videoGrid = document.getElementById('videoGrid');
    const loadingElement = document.getElementById('loading');
    
    // Sample videos - REPLACE THESE WITH YOUR ACTUAL VIDEO URLs
    const sampleVideos = [
        {
            videoUrl: 'https://www.xvideos.com/video.oidicfveaea/43876267/0/stuck_on_the_stairs_her_perverted_stepbro_takes_advantage_and_fucks_bellattrix.mp4',
            thumbnailUrl: 'https://example.com/thumb1.jpg'
        },
        {
            videoUrl: 'https://example.com/video2.mp4', 
            thumbnailUrl: 'https://example.com/thumb2.jpg'
        },
        {
            videoUrl: 'https://example.com/video3.mp4',
            thumbnailUrl: 'https://example.com/thumb3.jpg'
        }
    ];
    
    // Display the sample videos
    displayVideos(sampleVideos);
    
    // Hide loading
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
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