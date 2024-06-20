document.addEventListener('DOMContentLoaded', () => {
    fetch('/paintings.json')
        .then(response => response.json())
        .then(paintings => {
            let currentPaintingIndex = 0;

            const mainPainting = document.getElementById('main-painting');
            const paintingTitle = document.getElementById('painting-title');
            const paintingDetails = document.getElementById('painting-details');
            const thumbnails = document.getElementById('thumbnails');

            function displayPainting(index) {
                const painting = paintings[index];
                mainPainting.src = painting.image;
                paintingTitle.textContent = painting.title;
                paintingDetails.innerHTML = `
                    <strong>Painter:</strong> ${painting.painter}<br>
                    <strong>Date:</strong> ${painting.date}<br>
                    <strong>Place:</strong> ${painting.place}<br>
                    <strong>Owned by:</strong> ${painting.owned_by}<br>
                    <strong>Size:</strong> ${painting.size}
                `;
            }

            function createThumbnail(painting, index) {
                const thumbnailDiv = document.createElement('div');
                thumbnailDiv.classList.add('thumbnail');
                thumbnailDiv.addEventListener('click', () => {
                    currentPaintingIndex = index;
                    displayPainting(index);
                });
                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = painting.image;
                thumbnailImg.alt = painting.title;
                thumbnailDiv.appendChild(thumbnailImg);
                thumbnails.appendChild(thumbnailDiv);
            }

            paintings.forEach((painting, index) => {
                createThumbnail(painting, index);
            });

            document.getElementById('prev-btn').addEventListener('click', () => {
                if (currentPaintingIndex > 0) {
                    currentPaintingIndex--;
                    displayPainting(currentPaintingIndex);
                }
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                if (currentPaintingIndex < paintings.length - 1) {
                    currentPaintingIndex++;
                    displayPainting(currentPaintingIndex);
                }
            });

            displayPainting(currentPaintingIndex);
        });
});
