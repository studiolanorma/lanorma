// Prevent right-click context menu on images and videos
document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
    e.preventDefault();
  }
});

// Prevent drag-to-download on images
document.addEventListener('dragstart', function (e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});
