document.addEventListener("DOMContentLoaded", function () {

    const walletForm = document.getElementById("walletForm");
    const payButton = document.getElementById("payButton");


    // Wallet form

    if (walletForm) {

        walletForm.addEventListener("submit", function(event){

            event.preventDefault();


            const wallet =
                document.getElementById("wallet").value.trim();

            const network =
                document.getElementById("network").value;


            if(wallet.length < 10){

                alert("Please enter a valid public wallet address.");

                return;

            }


            const walletRequest = {

                address: wallet,
                blockchain: network,
                date: new Date().toISOString()

            };


            // Save temporarily in browser

            localStorage.setItem(
                "walletRequest",
                JSON.stringify(walletRequest)
            );


            alert(
                "Wallet saved. Continue to payment to receive your report."
            );


            // Temporary payment page
            // We will replace this later with Stripe/Crypto payment verification

            window.location.href =
            "https://example.com/payment";


        });

    }



    // Payment button

    if(payButton){

        payButton.addEventListener("click", function(){


            const request =
            localStorage.getItem("walletRequest");


            if(!request){

                alert(
                    "Please enter your wallet address first."
                );

                return;

            }


            alert(
                "Payment system will be connected in the next step."
            );


        });

    }


});
