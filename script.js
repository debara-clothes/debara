const URL = 'https://debara.onrender.com';
const userToken = localStorage.getItem('O_authDebWEB')

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    if (userToken) {
        // User is logged in
        loginSection.innerHTML = `
            <div class="avatar" id="avatar">
                <img src="../img/avatar.jpeg" alt="Avatar">
            </div>
            <button class="logout-btn" id="logout-btn">Logout</button>
        `;

        // Toggle logout button visibility
        const avatar = document.getElementById('avatar');
        const logoutBtn = document.getElementById('logout-btn');

        avatar.addEventListener('click', () => {
            logoutBtn.classList.toggle('show');
        });

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('O_authDebWEB');
            window.location.assign('https://debara.store/'); // Reload to reset the state
        });
    } else {
        // User is not logged in
        loginSection.innerHTML = `
            <button onclick="login()">Login</button>
        `;
    }
});

// function using for going to cart page 
function goToCart() {
    if (userToken) {
        window.location.assign('https://debara.store/pages/cart.html'); // Reload to reset the state
    } else {
        window.location.assign('https://debara-clothes.github.io/auth/'); //  go to login page
    }
}

// function using for going to design cart page 
function goToDesignCart() {
    if (userToken) {
        window.location.assign('https://debara.store/pages/designCart.html'); // Reload to reset the state
    } else {
        window.location.assign('https://debara-clothes.github.io/auth/'); // go to login page
    }
}

function showAlert(success, message) {
    const alertBox = document.getElementById('alertBox');
    if (success) {
        alertBox.textContent = `${message}`;
        alertBox.classList.add('alert-success');
    } else {
        alertBox.textContent = `${message}`;
        alertBox.classList.add('alert-error');
    }
    alertBox.classList.add('show');

    // Hide the alert after 3 seconds
    setTimeout(function () {
        alertBox.classList.remove('show');
    }, 3000);

    setTimeout(function () {
        alertBox.classList.remove('alert-success');
        alertBox.classList.remove('alert-error');
    }, 3500);
}

function login() {
    // Placeholder login function
    window.location.assign('https://debara-clothes.github.io/auth/');
}

if (window.location.pathname == "/" || window.location.pathname == "/index.html") {
    const token = new URLSearchParams(window.location.search).get('userToken');
    if (token) {
        if (userToken) {
            localStorage.setItem("O_authDebWEB", token)
        } else {
            localStorage.setItem("O_authDebWEB", token)
            window.location.reload(); // Reload to reset the state
        }
    }

    // Initialize the slider with initial settings
    const getProduct = () => {
        // Make a GET request using the Fetch API to get product
        fetch(`${URL}/product/getAllProduct`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the retrieved data
                if (data.message == 'success') {
                    showProduct(data.products)
                } else {
                    console.log('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    getProduct()

    function viewProduct(productId) {
        // Redirect to product detail page with productId as a query parameter or path parameter
        window.location.href = `pages/product.html?id=${productId}`;
    }

    const showProduct = (products) => {
        let cartona = '';
        for (let index = 0; index < products.length; index++) {
            const element = products[index];
            cartona += `<div class="slide">
            <img onclick="viewProduct('${element._id}')" src=${element.images[0]} alt="Product">
            <div class="product-info">
                <h3>${element.productName}</h3>
                <p>Product Designed By Debara</p>
                <p class="price">${element.price} EGP</p>
                <button onclick="viewProduct('${element._id}')" class="add-to-cart">Add to Cart</button>
            </div>
        </div>`
        }
        document.querySelector('.slider').innerHTML = cartona

        $(document).ready(function () {
            $('.slider').slick({
                dots: false,
                infinite: true,
                speed: 500,
                autoplay: true,
                autoplaySpeed: 2000,
                prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                nextArrow: '<button type="button" class="slick-next">Next</button>',
                responsive: [
                    {
                        breakpoint: 2500, // medium screens and above
                        settings: {
                            slidesToShow: 5,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 900, // small screens
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 800, // small screens
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 550, // phone screens
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        });
    }

}

if (window.location.pathname == "/pages/product.html") {
    // Function to change the main image when a thumbnail is clicked
    function changeImage(imageSrc) {
        document.getElementById('mainImage').src = imageSrc;
    }


    function addToCart(productName, picURL) {
        if (userToken) {
            const length = document.getElementById('shirtLength').value;
            const width = document.getElementById('shirtWidth').value;
            const color = document.getElementById('shirtColor').value;
            const size = document.getElementById('shirtSize').value;
            const quantity = document.getElementById('quantity').value;

            const formData = {
                productName,
                category: 'T-Shirt',
                color,
                size,
                picURL,
                length: length ? length : undefined,
                width: width ? width : undefined,
                count: quantity < 1 ? 1 : quantity,
                price: 249
            }
            document.querySelector('.cart-btn').innerHTML = '<span class="loader"></span>'
            fetch(`${URL}/user/addToCart/${productName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `debaraYes09${userToken}`
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Process the newly created user data
                    if (data.status) {
                        showAlert(true, data.message)
                    } else {
                        showAlert(false, data.message)
                    }
                    document.querySelector('.cart-btn').innerHTML = 'Add to Cart'
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.querySelector('.cart-btn').innerHTML = 'Add to Cart'
                });

        } else {
            window.location.href = 'https://debara-clothes.github.io/auth/';
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        const productId = new URLSearchParams(window.location.search).get('id');

        // Fetch product details based on productId
        fetch(`${URL}/product/getProductDetails/${productId}`)
            .then(response => response.json())
            .then(product => {
                if (product.message == 'success') {
                    showProductDetails(product.product)
                } else {
                    console.log('Error:', product.message);
                }
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            }).finally(() => {
                // Hide the skeleton loader after data is loaded
                document.getElementById('dotsLoader').style.display = 'none'; // or 'dotsLoader', 'pulseLoader', 'barLoader'
            });
    });

    const showProductDetails = (product) => {
        const cartona = `<div class="product-images">
        <img id="mainImage" src=${product.images[0]} alt="T-shirt Main Image">
        <div class="thumbnails">
            <img src=${product.images[0]} alt="White T-shirt Front"
                onclick="changeImage('${product.images[0]}')">
            <img src=${product.images[1]} alt="White T-shirt Back"
                onclick="changeImage('${product.images[1]}')">
            <img src=${product.images[2]} alt="Black T-shirt Front"
                onclick="changeImage('${product.images[2]}')">
            <img src=${product.images[3]} alt="Black T-shirt Back"
                onclick="changeImage('${product.images[3]}')">
        </div>
    </div>
    <div class="product-info">
        <h2>${product.productName}</h2>
        <p class="price">${product.price} EGP</p>
        <p class="description">
            ${product.productDesc}.
        </p>
        <form id="addToCartForm>
            <label for="shirtSize">Size:</label>
            <select id="shirtSize" name="shirtSize">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
            <br>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" value="1" min="1">
            <br>
            <label for="shirtLength">Length (cm):</label>
            <input type="number" id="shirtLength" name="shirtLength">
            <br>
            <label for="shirtWidth">Width (cm):</label>
            <input type="number" id="shirtWidth" name="shirtWidth">
            <br>
            <label for="shirtColor">Choose Color:</label>
            <select id="shirtColor" name="shirtColor">
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="brown">Brown</option>
                <option value="havan">Havan</option>
            </select>
            <br><br>
            <button class="cart-btn" type="button" onclick="addToCart('${product.productName}', '${product.images[0]}')">Add to Cart</button>
        </form>
    </div>`;
        document.querySelector('.product-details').innerHTML = cartona
    }
}

if (window.location.pathname == "/pages/cart.html") {
    const showCartDetails = (products, cartTotal, cartID) => {
        let cartona = ''
        for (let index = 0; index < products.length; index++) {
            const element = products[index];
            cartona += `<div class="cart-item">
            <img src=${element.picURL} alt="Product">
            <div class="cart-item-details">
                <h3>${element.productName}</h3>
                <p>Price: 249 EGP</p>
                <div class="cart-item-quantity">
                    <label for="quantity1">Quantity:</label>
                    <input type="number" id="quantity1" name="quantity1" value=${element.count} min="1">
                </div>
                <div class="cart-item-remove">
                    <button onclick="removeCartItem(this)">Remove</button>
                </div>
            </div>
        </div>`
        }
        const totalCart = `<h3>Total Price: <span id="total-price">${cartTotal} EGP</span></h3>
        <button class="btn-place-order" onclick="goToOrder('${cartTotal}', '${cartID}')">Place Order</button>`

        document.querySelector('.cart-items').innerHTML = cartona
        document.querySelector('.cart-total').innerHTML = totalCart

        addQuantityChangeListeners();
    }

    // go to order page with total amount
    function goToOrder(totalAmount, cartID) {
        totalWithShipping = parseInt(totalAmount) + 80
        window.location.assign(`https://debara.store/pages/order.html?totalAmount=${totalWithShipping}&cartID=${cartID}`);
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetch(`${URL}/user/getUserCart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (data.message == 'success' && data.cart.products.length != 0) {
                    showCartDetails(data.cart.products, data.cart.cartTotal, data.cart._id)
                } else {
                    document.querySelector('.cart-items').innerHTML = '<img src="../img/cart_is_empty.png" class="empty-cart" alt="cart-empty">'
                    console.log('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching cart details:', error);
            }).finally(() => {
                // Hide the skeleton loader after data is loaded
                document.getElementById('dotsLoader').style.display = 'none'; // or 'dotsLoader', 'pulseLoader', 'barLoader'
            });
    });

    // JavaScript for quantity modification
    function addQuantityChangeListeners() {
        const quantityInputs = document.querySelectorAll('.cart-item-quantity input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function () {
                let newQuantity = parseInt(this.value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1; // Ensure minimum quantity
                }
                const productName = this.closest('.cart-item').querySelector('h3').innerText;
                updateCartProductQuantity(productName, newQuantity);
            });
        });
    }

    function updateCartProductQuantity(productName, newQuantity) {
        // Implement logic to update the quantity in the cart via API
        fetch(`${URL}/user/updateCountInCart/${productName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            },
            body: JSON.stringify({
                count: newQuantity
            })
        }).then(response => response.json())
            .then(data => {
                if (data.message === 'success') {
                    // Optionally, update the UI or fetch cart details again
                    // Example: fetchCartDetails();
                    showCartDetails(data.cart.products, data.cart.cartTotal, data.cart._id)
                } else {
                    console.log('Error updating quantity:', data.message);
                    // Optionally handle error scenario
                }
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                // Optionally handle error scenario
            });
    }

    // Example function for removing cart item
    function removeCartItem(button) {
        const productName = button.closest('.cart-item').querySelector('h3').innerText;
        fetch(`${URL}/user/removeFromCart/${productName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (data.status && data.cart.products.length != 0) {
                    // Optionally, update the UI or fetch cart details again
                    // Example: fetchCartDetails();
                    showAlert(true, data.message)
                    showCartDetails(data.cart.products, data.cart.cartTotal, data.cart._id)
                } else {
                    showAlert(false, data.message)
                    document.querySelector('.cart-items').innerHTML = '<img src="../img/cart_is_empty.png" class="empty-cart" alt="cart-empty">'
                    // Optionally handle error scenario
                }
            })
            .catch(error => {
                console.error('Error removing product:', error);
                document.querySelector('.cart-item-remove button').innerHTML = 'Remove'
                // Optionally handle error scenario
            });
    }
}

if (window.location.pathname == "/pages/design.html") {
    // Front T-shirt Canvas and Context
    const frontCanvas = document.getElementById('frontCanvas');
    const frontCtx = frontCanvas.getContext('2d');
    // Back T-shirt Canvas and Context
    const backCanvas = document.getElementById('backCanvas');
    const backCtx = backCanvas.getContext('2d');
    let frontDesign = '';
    let backDesign = '';

    // Load initial T-shirt images
    let frontTshirtImage = new Image();
    frontTshirtImage.onload = function () {
        resizeFrontCanvas();
        drawFrontCanvas();
    };
    frontTshirtImage.src = '../img/white-front-mockup.jpg';

    // Replace with actual color
    function changeFrontColor(color) {
        frontTshirtImage.src = color;
    }

    let backTshirtImage = new Image();
    backTshirtImage.onload = function () {
        resizeBackCanvas();
        drawBackCanvas();
    };
    backTshirtImage.src = '../img/white-back-mockup.jpg';

    // Replace with actual color
    function changeBackColor(color) {
        backTshirtImage.src = color;
    }

    // Front T-shirt Logo Variables
    let frontLogoImage = null;
    let frontLogoX = 100;
    let frontLogoY = 100;
    let frontLogoWidth = 50;
    let frontIsDragging = false;
    let frontDragStartX, frontDragStartY;

    // Back T-shirt Logo Variables
    let backLogoImage = null;
    let backLogoX = 100;
    let backLogoY = 100;
    let backLogoWidth = 50;
    let backIsDragging = false;
    let backDragStartX, backDragStartY;

    // Event listeners for window resize
    window.addEventListener('resize', function () {
        resizeFrontCanvas();
        drawFrontCanvas();
        resizeBackCanvas();
        drawBackCanvas();
    });

    // Front T-shirt Canvas Functions
    function resizeFrontCanvas() {
        frontCanvas.width = frontCanvas.parentNode.clientWidth;
        frontCanvas.height = frontCanvas.width * (frontTshirtImage.height / frontTshirtImage.width);
    }

    document.getElementById('frontLogoInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        frontDesign = file;
        const reader = new FileReader();
        reader.onload = function (event) {
            frontLogoImage = new Image();
            frontLogoImage.onload = function () {
                drawFrontCanvas();
            };
            frontLogoImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function drawFrontCanvas() {
        frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
        frontCtx.drawImage(frontTshirtImage, 0, 0, frontCanvas.width, frontCanvas.height);
        if (frontLogoImage) {
            frontCtx.drawImage(frontLogoImage, frontLogoX, frontLogoY, frontLogoWidth, frontLogoWidth * frontLogoImage.height / frontLogoImage.width);
        }
    }

    function frontResizeLogo() {
        frontLogoWidth += 10;
        drawFrontCanvas();
    }

    function frontShrinkLogo() {
        frontLogoWidth -= 10;
        if (frontLogoWidth < 10) {
            frontLogoWidth = 10;
        }
        drawFrontCanvas();
    }

    function frontRemoveWhiteBackground() {
        if (frontLogoImage) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = frontLogoImage.width;
            tempCanvas.height = frontLogoImage.height;
            const tempCtx = tempCanvas.getContext('2d');

            tempCtx.drawImage(frontLogoImage, 0, 0);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const pixels = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i] > 200 && pixels[i + 1] > 200 && pixels[i + 2] > 200) {
                    pixels[i + 3] = 0;
                }
            }

            tempCtx.putImageData(imageData, 0, 0);

            frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
            frontCtx.drawImage(frontTshirtImage, 0, 0, frontCanvas.width, frontCanvas.height);
            frontCtx.drawImage(tempCanvas, frontLogoX, frontLogoY, frontLogoWidth, frontLogoWidth * frontLogoImage.height / frontLogoImage.width);
        }
    }

    document.getElementById('frontDownloadBtn').addEventListener('click', function () {
        downloadFrontCanvas();
    });

    function downloadFrontCanvas() {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = frontCanvas.width;
            tempCanvas.height = frontCanvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(frontCanvas, 0, 0);

            const dataURL = tempCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'front_tshirt_design.png';
            link.href = dataURL;
            link.click();
        } catch (error) {
            console.error('Error downloading front image:', error);
            alert('Failed to download front image. Please try again.');
        }
    }

    frontCanvas.addEventListener('mousedown', handleFrontMouseDown);
    frontCanvas.addEventListener('mousemove', handleFrontMouseMove);
    frontCanvas.addEventListener('mouseup', handleFrontMouseUp);

    function handleFrontMouseDown(event) {
        frontIsDragging = true;
        frontDragStartX = event.clientX - frontCanvas.getBoundingClientRect().left;
        frontDragStartY = event.clientY - frontCanvas.getBoundingClientRect().top;
    }

    function handleFrontMouseMove(event) {
        if (frontIsDragging) {
            let offsetX = event.clientX - frontCanvas.getBoundingClientRect().left - frontDragStartX;
            let offsetY = event.clientY - frontCanvas.getBoundingClientRect().top - frontDragStartY;
            frontLogoX += offsetX;
            frontLogoY += offsetY;
            frontDragStartX = event.clientX - frontCanvas.getBoundingClientRect().left;
            frontDragStartY = event.clientY - frontCanvas.getBoundingClientRect().top;
            drawFrontCanvas();
        }
    }

    function handleFrontMouseUp(event) {
        frontIsDragging = false;
    }

    // Back T-shirt Canvas Functions
    function resizeBackCanvas() {
        backCanvas.width = backCanvas.parentNode.clientWidth;
        backCanvas.height = backCanvas.width * (backTshirtImage.height / backTshirtImage.width);
    }

    document.getElementById('backLogoInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        backDesign = file;
        const reader = new FileReader();
        reader.onload = function (event) {
            backLogoImage = new Image();
            backLogoImage.onload = function () {
                drawBackCanvas();
            };
            backLogoImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    function drawBackCanvas() {
        backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
        backCtx.drawImage(backTshirtImage, 0, 0, backCanvas.width, backCanvas.height);
        if (backLogoImage) {
            backCtx.drawImage(backLogoImage, backLogoX, backLogoY, backLogoWidth, backLogoWidth * backLogoImage.height / backLogoImage.width);
        }
    }

    function backResizeLogo() {
        backLogoWidth += 10;
        drawBackCanvas();
    }

    function backShrinkLogo() {
        backLogoWidth -= 10;
        if (backLogoWidth < 10) {
            backLogoWidth = 10;
        }
        drawBackCanvas();
    }

    function backRemoveWhiteBackground() {
        if (backLogoImage) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = backLogoImage.width;
            tempCanvas.height = backLogoImage.height;
            const tempCtx = tempCanvas.getContext('2d');

            tempCtx.drawImage(backLogoImage, 0, 0);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const pixels = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i] > 200 && pixels[i + 1] > 200 && pixels[i + 2] > 200) {
                    pixels[i + 3] = 0;
                }
            }

            tempCtx.putImageData(imageData, 0, 0);

            backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
            backCtx.drawImage(backTshirtImage, 0, 0, backCanvas.width, backCanvas.height);
            backCtx.drawImage(tempCanvas, backLogoX, backLogoY, backLogoWidth, backLogoWidth * backLogoImage.height / backLogoImage.width);
        }
    }

    document.getElementById('backDownloadBtn').addEventListener('click', function () {
        downloadBackCanvas();
    });

    function downloadBackCanvas() {
        try {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = backCanvas.width;
            tempCanvas.height = backCanvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(backCanvas, 0, 0);

            const dataURL = tempCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'back_tshirt_design.png';
            link.href = dataURL;
            link.click();
        } catch (error) {
            console.error('Error downloading back image:', error);
            alert('Failed to download back image. Please try again.');
        }
    }

    backCanvas.addEventListener('mousedown', handleBackMouseDown);
    backCanvas.addEventListener('mousemove', handleBackMouseMove);
    backCanvas.addEventListener('mouseup', handleBackMouseUp);

    function handleBackMouseDown(event) {
        backIsDragging = true;
        backDragStartX = event.clientX - backCanvas.getBoundingClientRect().left;
        backDragStartY = event.clientY - backCanvas.getBoundingClientRect().top;
    }

    function handleBackMouseMove(event) {
        if (backIsDragging) {
            let offsetX = event.clientX - backCanvas.getBoundingClientRect().left - backDragStartX;
            let offsetY = event.clientY - backCanvas.getBoundingClientRect().top - backDragStartY;
            backLogoX += offsetX;
            backLogoY += offsetY;
            backDragStartX = event.clientX - backCanvas.getBoundingClientRect().left;
            backDragStartY = event.clientY - backCanvas.getBoundingClientRect().top;
            drawBackCanvas();
        }
    }

    function handleBackMouseUp(event) {
        backIsDragging = false;
    }

    // Mouse Event Handlers for Front T-shirt Canvas
    frontCanvas.addEventListener('mousedown', handleFrontMouseDown);
    frontCanvas.addEventListener('mousemove', handleFrontMouseMove);
    frontCanvas.addEventListener('mouseup', handleFrontMouseUp);

    // Touch Event Handlers for Front T-shirt Canvas
    frontCanvas.addEventListener('touchstart', handleFrontTouchStart);
    frontCanvas.addEventListener('touchmove', handleFrontTouchMove);
    frontCanvas.addEventListener('touchend', handleFrontTouchEnd);

    function handleFrontMouseDown(event) {
        frontIsDragging = true;
        frontDragStartX = event.clientX - frontCanvas.getBoundingClientRect().left;
        frontDragStartY = event.clientY - frontCanvas.getBoundingClientRect().top;
    }

    function handleFrontMouseMove(event) {
        if (frontIsDragging) {
            let offsetX = event.clientX - frontCanvas.getBoundingClientRect().left - frontDragStartX;
            let offsetY = event.clientY - frontCanvas.getBoundingClientRect().top - frontDragStartY;
            frontLogoX += offsetX;
            frontLogoY += offsetY;
            frontDragStartX = event.clientX - frontCanvas.getBoundingClientRect().left;
            frontDragStartY = event.clientY - frontCanvas.getBoundingClientRect().top;
            drawFrontCanvas();
        }
    }

    function handleFrontMouseUp(event) {
        frontIsDragging = false;
    }

    function handleFrontTouchStart(event) {
        event.preventDefault();
        frontIsDragging = true;
        let touch = event.touches[0];
        frontDragStartX = touch.clientX - frontCanvas.getBoundingClientRect().left;
        frontDragStartY = touch.clientY - frontCanvas.getBoundingClientRect().top;
    }

    function handleFrontTouchMove(event) {
        event.preventDefault();
        if (frontIsDragging) {
            let touch = event.touches[0];
            let offsetX = touch.clientX - frontCanvas.getBoundingClientRect().left - frontDragStartX;
            let offsetY = touch.clientY - frontCanvas.getBoundingClientRect().top - frontDragStartY;
            frontLogoX += offsetX;
            frontLogoY += offsetY;
            frontDragStartX = touch.clientX - frontCanvas.getBoundingClientRect().left;
            frontDragStartY = touch.clientY - frontCanvas.getBoundingClientRect().top;
            drawFrontCanvas();
        }
    }

    function handleFrontTouchEnd(event) {
        event.preventDefault();
        frontIsDragging = false;
    }

    // Mouse Event Handlers for Back T-shirt Canvas
    backCanvas.addEventListener('mousedown', handleBackMouseDown);
    backCanvas.addEventListener('mousemove', handleBackMouseMove);
    backCanvas.addEventListener('mouseup', handleBackMouseUp);

    function handleBackMouseDown(event) {
        backIsDragging = true;
        backDragStartX = event.clientX - backCanvas.getBoundingClientRect().left;
        backDragStartY = event.clientY - backCanvas.getBoundingClientRect().top;
    }

    function handleBackMouseMove(event) {
        if (backIsDragging) {
            let offsetX = event.clientX - backCanvas.getBoundingClientRect().left - backDragStartX;
            let offsetY = event.clientY - backCanvas.getBoundingClientRect().top - backDragStartY;
            backLogoX += offsetX;
            backLogoY += offsetY;
            backDragStartX = event.clientX - backCanvas.getBoundingClientRect().left;
            backDragStartY = event.clientY - backCanvas.getBoundingClientRect().top;
            drawBackCanvas();
        }
    }

    function handleBackMouseUp(event) {
        backIsDragging = false;
    }

    // Touch Event Handlers for Back T-shirt Canvas
    backCanvas.addEventListener('touchstart', handleBackTouchStart);
    backCanvas.addEventListener('touchmove', handleBackTouchMove);
    backCanvas.addEventListener('touchend', handleBackTouchEnd);

    function handleBackTouchStart(event) {
        event.preventDefault();
        backIsDragging = true;
        let touch = event.touches[0];
        backDragStartX = touch.clientX - backCanvas.getBoundingClientRect().left;
        backDragStartY = touch.clientY - backCanvas.getBoundingClientRect().top;
    }

    function handleBackTouchMove(event) {
        event.preventDefault();
        if (backIsDragging) {
            let touch = event.touches[0];
            let offsetX = touch.clientX - backCanvas.getBoundingClientRect().left - backDragStartX;
            let offsetY = touch.clientY - backCanvas.getBoundingClientRect().top - backDragStartY;
            backLogoX += offsetX;
            backLogoY += offsetY;
            backDragStartX = touch.clientX - backCanvas.getBoundingClientRect().left;
            backDragStartY = touch.clientY - backCanvas.getBoundingClientRect().top;
            drawBackCanvas();
        }
    }

    function handleBackTouchEnd(event) {
        event.preventDefault();
        backIsDragging = false;
    }

    const base64ToFile = (url) => {
        let arr = url.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let data = arr[1];

        let dataStr = atob(data);
        let n = dataStr.length;
        let dataArr = new Uint8Array(n);

        while (n--) {
            dataArr[n] = dataStr.charCodeAt(n);
        }

        let file = new File([dataArr], 'File.jpeg', { type: mime });
        return file;
    };

    function openDesignPopup() {
        if (userToken) {
            document.querySelector('.design-popup-container').classList.replace('hide-popup', 'active-popup')
        } else {
            window.location.assign('https://debara-clothes.github.io/auth/'); // go to Login page
        }
    }

    function closeDesignPopup() {
        document.querySelector('.design-popup-container').classList.replace('active-popup', 'hide-popup')
    }

    function saveDesign() {
        // Example: Save canvas data to localStorage
        try {
            const designName = document.querySelector('.design-popup input').value;
            if (frontDesign == '' && backDesign == '') {
                showAlert(false, "Faild to save yor design, You must Upload your design img first")
            } else if (designName == '') {
                showAlert(false, "Faild to save yor design, You must enter the name of your design")
            } else {
                const frontDataURL = document.getElementById('frontCanvas').toDataURL('image/png');
                const backDataURL = document.getElementById('backCanvas').toDataURL('image/png');
                const frontImg = base64ToFile(frontDataURL)
                const backImg = base64ToFile(backDataURL)
                const width = document.getElementById('frontWidthInput').value;
                const height = document.getElementById('frontHeightInput').value;
                const size = document.getElementById('frontSizeSelect').value;
                const data = new FormData()
                data.append('image', frontImg)
                data.append('image', backImg)
                data.append('image', frontDesign)
                data.append('image', backDesign)
                data.append('category', 'T-Shirt')
                data.append('productName', designName)
                data.append('price', 249)
                data.append('size', size)
                if (width != '')
                    data.append('width', width)
                if (height != '')
                    data.append('length', height)

                document.querySelector('.save-design').innerHTML = '<span class="loader"></span>'
                fetch(`${URL}/design/addDesign`, {
                    method: 'POST',
                    headers: {
                        'authorization': `debaraYes09${userToken}`
                    },
                    body: data,
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Process the newly created user data
                        if (data.status) {
                            showAlert(true, data.message)
                            document.querySelector('.save-design').innerHTML = 'Save Design'
                            closeDesignPopup()
                        } else {
                            showAlert(false, data.message)
                            document.querySelector('.save-design').innerHTML = 'Save Design'
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        } catch (error) {
            console.error('Error saving design:', error);
            alert('Failed to save design. Please try again.');
        }
    }

}

if (window.location.pathname == "/pages/designCart.html") {
    const showDesignDetails = (designs) => {
        let cartona = ''
        for (let index = 0; index < designs.length; index++) {
            const element = designs[index];
            cartona += `<div class="design-card">
            <img src=${element.picURL[0]} alt=${element.productName}>
            <div class="design-info">
                <h3>${element.productName}</h3>
                <p>Price: 249 EGP</p>
                <p>Implemented by Debara</p>
                <div class="quantity-container">
                    <label for="quantity-${element.productName.replace(/\s+/g, '')}">Quantity:</label>
                    <input type="number" id="quantity-${element.productName.replace(/\s+/g, '')}" min="1" value="1">
                </div>
                <div class="design-button-container">
                    <button onclick="addDesignToCart('${element.productName}','${element.size}','${element.picURL[0]}','${element.length}','${element.width}')">Add to Cart</button>
                    <button onclick="removeDesign('${element._id}')">Delete</button>
                </div>
            </div>
        </div>`
        }
        document.getElementById('design-cart-content').innerHTML = cartona
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetch(`${URL}/design/getAllDesign`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (data.message == 'success') {
                    showDesignDetails(data.allDesign)
                } else {
                    console.log('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching cart details:', error);
            }).finally(() => {
                // Hide the skeleton loader after data is loaded
                document.getElementById('dotsLoader').style.display = 'none'; // or 'dotsLoader', 'pulseLoader', 'barLoader'
            });
    });

    function addDesignToCart(productName, size, picURL, length, width) {
        const quantityInput = document.getElementById(`quantity-${productName.replace(/\s+/g, '')}`);
        const quantity = quantityInput ? quantityInput.value : 1;

        if (quantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        const formData = {
            productName,
            category: 'T-Shirt',
            size,
            picURL,
            length: length ? length : undefined,
            width: width ? width : undefined,
            count: quantity < 1 ? 1 : quantity,
            price: 249
        }

        document.querySelector('.design-button-container button:first-child').innerHTML = '<span class="loader"></span>'
        fetch(`${URL}/user/addToCart/${productName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the newly created user data
                if (data.status) {
                    showAlert(true, data.message)
                } else {
                    showAlert(false, data.message)
                }
                document.querySelector('.design-button-container button:first-child').innerHTML = 'Add to Cart'
            })
            .catch(error => {
                document.querySelector('.design-button-container button:first-child').innerHTML = 'Add to Cart'
                console.error('Error:', error);
            });


    }

    // Example function for removing design item
    function removeDesign(designID) {
        document.querySelector('.design-button-container button:last-child').innerHTML = '<span class="loader"></span>'
        fetch(`${URL}/design/removeDesign/${designID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            }
        }).then(response => response.json())
            .then(data => {
                if (data.message == 'success') {
                    // Optionally, update the UI or fetch cart details again
                    // Example: fetchCartDetails();
                    showDesignDetails(data.allDesign)
                } else {
                    console.log(data.message);
                    // Optionally handle error scenario
                }
                document.querySelector('.design-button-container button:last-child').innerHTML = 'Delete'
            })
            .catch(error => {
                document.querySelector('.design-button-container button:last-child').innerHTML = 'Delete'
                console.error('Error removing product:', error);
                // Optionally handle error scenario
            });
    }
}

if (window.location.pathname == "/pages/order.html") {
    const totalAmount = new URLSearchParams(window.location.search).get('totalAmount');
    const cartID = new URLSearchParams(window.location.search).get('cartID');

    if (totalAmount) {
        document.querySelector('.total-price').innerHTML = `<p id="orderSummary">Total Amount: <span id="totalAmount">${totalAmount}</span> EGP</p>`
    }

    function createOrder(cartID, formData) {
        document.getElementById('completeOrder').innerHTML = '<span class="loader"></span>'
        fetch(`${URL}/user/createOrder/${cartID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `debaraYes09${userToken}`
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message == 'success') {
                    // Process the newly created user data
                    document.getElementById('thankYouWindow').classList.remove('hidden');
                    document.getElementById('orderCode').textContent = data.orderID; // Generate or set your order code here
                } else {
                    showAlert(false, data.message)
                }
                document.getElementById('completeOrder').innerHTML = 'Complete Order'
            })
            .catch(error => {
                document.getElementById('completeOrder').innerHTML = 'Complete Order'
                console.error('Error:', error);
            });
    }

    document.getElementById('completeOrder').addEventListener('click', function () {
        // Clear previous error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => element.textContent = '');

        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const city = document.getElementById('city').value;
        const message = document.getElementById('comments').value;

        const namePattern = /^[A-Za-z\s]+$/;
        const phonePattern = /^\+?\d{10,15}$/;

        let isValid = true;

        // Validate name
        if (!namePattern.test(name)) {
            document.getElementById('nameError').textContent = 'Please enter a valid name containing only letters and spaces.';
            isValid = false;
        }

        // Validate address
        if (address === '') {
            document.getElementById('addressError').textContent = 'Address cannot be empty.';
            isValid = false;
        }

        // Validate phone number
        if (!phonePattern.test(phone)) {
            document.getElementById('phoneError').textContent = 'Please enter a valid phone number in the format: +201234567890 or 01234567890.';
            isValid = false;
        }

        // Validate WhatsApp number (if provided)
        if (whatsapp == '' && !phonePattern.test(whatsapp)) {
            document.getElementById('whatsappError').textContent = 'Please enter a valid WhatsApp number in the format: +201234567890 or 01234567890.';
            isValid = false;
        }

        // Validate city selection
        if (city === '') {
            document.getElementById('cityError').textContent = 'Please select a city.';
            isValid = false;
        }

        if (isValid) {
            const formData = {
                userName: name,
                userAddress: address,
                userPhone: phone,
                whatsApp: whatsapp,
                userCity: city,
                message: message !== '' ? message : undefined
            }
            createOrder(cartID, formData)
        }
    });

    document.getElementById('closeWindow').addEventListener('click', function () {
        document.getElementById('thankYouWindow').classList.add('hidden');
    });
}