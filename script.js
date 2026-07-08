console.log("Wallet Inspector script loaded");
document.addEventListener("DOMContentLoaded", function () {

    const walletForm = document.getElementById("walletForm");
    const payButton = document.getElementById("payButton");
    const walletResult = document.getElementById("walletResult");


    // Wallet Form

    if (walletForm) {

        walletForm.addEventListener("submit", function(event) {

            event.preventDefault();


            const wallet = document
                .getElementById("wallet")
                .value
                .trim();


            const network = document
                .getElementById("network")
                .value;



            if (wallet.length < 10) {

                alert(
                    "Please enter a valid public wallet address."
                );

                return;

            }



            const walletRequest = {

                address: wallet,
                blockchain: network,
                date: new Date().toISOString()

            };



            localStorage.setItem(
                "walletRequest",
                JSON.stringify(walletRequest)
            );



            if (walletResult) {

                walletResult.innerHTML = `

                <div class="report">

                    <h3>
                    Wallet Detected
                    </h3>


                    <p>
                    Blockchain:
                    <strong>${network}</strong>
                    </p>


                    <p>
                    Public Address:
                    </p>


                    <code>
                    ${wallet}
                    </code>


                    <p>
                    Ready for report generation.
                    </p>

                </div>

                `;

            }


        });

    }




    // Payment Button

    if (payButton) {

        payButton.addEventListener("click", function() {


            const request =
                localStorage.getItem("walletRequest");



            if (!request) {

                alert(
                    "Please enter your wallet address first."
                );

                return;

            }



            alert(
                "Payment system will be connected next."
            );


        });

    }


});
