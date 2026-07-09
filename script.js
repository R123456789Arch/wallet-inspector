const ETHERSCAN_API_KEY = "DF9GPBMVKDKDGP9UC2665RBKZ1MA3FFAF4";


document.addEventListener("DOMContentLoaded", function () {

    const walletForm = document.getElementById("walletForm");
    const payButton = document.getElementById("payButton");
    const walletResult = document.getElementById("walletResult");


    if (walletForm) {

        walletForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const wallet = document
                .getElementById("wallet")
                .value
                .trim();


            const network = document
                .getElementById("network")
                .value;



            if (network !== "ethereum") {

                walletResult.innerHTML = `
                    <div class="report">
                        <h3>Coming Soon</h3>
                        <p>This blockchain is not supported yet.</p>
                    </div>
                `;

                return;

            }



            if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {

                alert(
                    "Please enter a valid Ethereum wallet address."
                );

                return;

            }



            walletResult.innerHTML = `

                <div class="report">

                    <h3>
                    Loading Wallet Data...
                    </h3>

                    <p>
                    Connecting to Ethereum blockchain...
                    </p>

                </div>

            `;



            try {


                const balance =
                    await getEthereumBalance(wallet);



                const transactions =
                    await getEthereumTransactions(wallet);



                const walletRequest = {

                    address: wallet,
                    blockchain: "Ethereum",
                    balance: balance,
                    date: new Date().toISOString()

                };



                localStorage.setItem(
                    "walletRequest",
                    JSON.stringify(walletRequest)
                );




                walletResult.innerHTML = `

                <div class="report">


                    <h3>
                    Wallet Detected
                    </h3>



                    <p>
                    <strong>Blockchain:</strong>
                    Ethereum
                    </p>



                    <p>
                    <strong>Public Address:</strong>
                    </p>


                    <code>
                    ${wallet}
                    </code>



                    <p>
                    <strong>ETH Balance:</strong>
                    ${balance} ETH
                    </p>




                    <h3>
                    Recent Transactions
                    </h3>



                    ${
                        transactions.length === 0

                        ?

                        "<p>No transactions found.</p>"

                        :

                        transactions.map(tx => `


                        <div class="transaction">


                            <p>
                            <strong>Hash:</strong>
                            </p>

                            <code>
                            ${tx.hash}
                            </code>



                            <p>
                            <strong>From:</strong><br>
                            ${tx.from}
                            </p>



                            <p>
                            <strong>To:</strong><br>
                            ${tx.to}
                            </p>



                            <p>
                            <strong>Value:</strong>
                            ${(Number(tx.value) / 1e18).toFixed(6)}
                            ETH
                            </p>



                        </div>


                        `).join("")

                    }



                </div>

                `;



            } catch(error) {


                console.error(error);


                walletResult.innerHTML = `

                    <div class="report">

                        <h3>
                        Error
                        </h3>

                        <p>
                        Unable to retrieve wallet information.
                        </p>

                    </div>

                `;


            }


        });


    }





    if (payButton) {


        payButton.addEventListener("click", function () {


            const request =
                localStorage.getItem("walletRequest");



            if (!request) {


                alert(
                    "Please analyze a wallet first."
                );


                return;


            }



            alert(
                "Payment feature will be added later."
            );


        });


    }



});







async function getEthereumBalance(address) {


    const url =

    `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;



    const response =
        await fetch(url);



    const data =
        await response.json();



    console.log("Balance:", data);



    if (data.status !== "1") {

        throw new Error(
            data.result
        );

    }



    return (
        Number(data.result) / 1e18
    ).toFixed(6);



}







async function getEthereumTransactions(address) {


    const url =

    `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=${ETHERSCAN_API_KEY}`;



    const response =
        await fetch(url);



    const data =
        await response.json();



    console.log("Transactions:", data);



    if (data.status !== "1") {

        return [];

    }



    return data.result;



}
