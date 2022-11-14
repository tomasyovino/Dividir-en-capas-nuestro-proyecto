function addToCartListener(clicked_id) {
    let addToCartBtn = document.getElementById(clicked_id);

    if (addToCartBtn) {
        addToCart(addToCartBtn);
    };
};

function deleteProductFromCartListener(clicked_id) {
    let deleteBtn = document.getElementById(clicked_id);

    if (deleteBtn) {
        deleteProductFromCart(deleteBtn);
    };
};

function cartBuyListener(clicked_id) {
    let buyBtn = document.getElementById(clicked_id);
    buyHandle(buyBtn); 
};

const addToCart = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: btn.dataset.userid, productId: btn.dataset.productid })
        });
        const content = rawResponse.json();
        
        console.log(content);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};

const buyHandle = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart/buy', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: "string", productId: "string" })
        });
        const content = rawResponse.json();
        console.log(content);
        console.log(btn);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};

const deleteProductFromCart = async (btn) => {
    try {
        const rawResponse = await fetch('/api/cart/product', {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: btn.dataset.userid, productId: btn.dataset.productid })
        });
        const content = rawResponse.json();
        console.log(content);
    } catch (err) {
        console.log(`error: ${err.message}`);
    };
};