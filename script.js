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



            if (!wallet) {

                alert("Please enter a wallet address.");
                return;

            }



            walletResult.innerHTML = `

            <div class="report">

                <h3>
                Loading Wallet Data...
                </h3>

            </div>

            `;



            try {


                let result;



                if (network === "ethereum") {


                    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {

                        throw new Error(
                            "Invalid Ethereum address."
                        );

                    }



                    const balance =
                        await getEthereumBalance(wallet);



                    const transactions =
                        await getEthereumTransactions(wallet);



                    result = `

                    <div class="report">

                        <h3>
                        Ethereum Wallet
                        </h3>


                        <p>
                        <strong>Address:</strong>
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
                            transactions.length

                            ?

                            transactions.map(tx => `

                            <div class="transaction">

                                <p>
                                <strong>Hash:</strong>
                                </p>

                                <code>
                                ${tx.hash}
                                </code>


                                <p>
                                Value:
                                ${(Number(tx.value) / 1e18).toFixed(6)}
                                ETH
                                </p>

                            </div>

                            `).join("")

                            :

                            "<p>No transactions found.</p>"

                        }


                    </div>

                    `;


                }





                else if (network === "bitcoin") {


                    if (
                        !/^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,90}$/
                        .test(wallet)
                    ) {

                        throw new Error(
                            "Invalid Bitcoin address."
                        );

                    }



                    const balance =
                        await getBitcoinBalance(wallet);



                    result = `

                    <div class="report">

                        <h3>
                        Bitcoin Wallet
                        </h3>


                        <p>
                        <strong>Address:</strong>
                        </p>


                        <code>
                        ${wallet}
                        </code>


                        <p>
                        <strong>BTC Balance:</strong>
                        ${balance} BTC
                        </p>


                    </div>

                    `;


                }



                else {


                    result = `

                    <div class="report">

                        <h3>
                        Coming Soon
                        </h3>

                        <p>
                        This blockchain is not available yet.
                        </p>

                    </div>

                    `;


                }




                localStorage.setItem(
                    "walletRequest",
                    JSON.stringify({

                        address: wallet,
                        blockchain: network,
                        date: new Date().toISOString()

                    })
                );



                walletResult.innerHTML = result;



            }



            catch(error) {


                console.error(error);


                walletResult.innerHTML = `

                <div class="report">

                    <h3>
                    Error
                    </h3>


                    <p>
                    ${error.message}
                    </p>


                </div>

                `;


            }


        });

    }





    if (payButton) {


        payButton.addEventListener("click", function () {


            alert(
                "Payment feature will be added later."
            );


        });


    }


});







// =======================
// ETHEREUM
// =======================


async function getEthereumBalance(address) {


    const url =

    `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;



    const response =
        await fetch(url);



    const data =
        await response.json();



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



    if (data.status !== "1") {

        return [];

    }



    return data.result;


}








// =======================
// BITCOIN
// =======================


async function getBitcoinBalance(address) {


    const url =
        `https://blockstream.info/api/address/${address}`;



    const response =
        await fetch(url);



    const data =
        await response.json();



    const received =
        data.chain_stats.funded_txo_sum;



    const spent =
        data.chain_stats.spent_txo_sum;



    return (

        (received - spent)
        /
        100000000

    ).toFixed(8);


}
