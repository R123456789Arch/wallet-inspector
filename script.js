const ETHERSCAN_API_KEY = "DF9GPBMVKDKDGP9UC2665RBKZ1MA3FFAF4";


document.addEventListener("DOMContentLoaded", function () {

    const walletForm = document.getElementById("walletForm");
    const payButton = document.getElementById("payButton");
    const walletResult = document.getElementById("walletResult");


    if (walletForm) {

        walletForm.addEventListener("submit", async function(event) {

            event.preventDefault();


            const wallet =
                document.getElementById("wallet").value.trim();


            const network =
                document.getElementById("network").value;



            if (!wallet) {

                alert("Enter a wallet address.");
                return;

            }



            walletResult.innerHTML = `

            <div class="report">

                <h3>
                Loading blockchain data...
                </h3>

            </div>

            `;



            try {


                let result;



                // ==========================
                // ETHEREUM
                // ==========================


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
                                ${(Number(tx.value)/1e18).toFixed(6)}
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





                // ==========================
                // BITCOIN
                // ==========================


                else if (network === "bitcoin") {



                    const balance =
                        await getBitcoinBalance(wallet);



                    const transactions =
                        await getBitcoinTransactions(wallet);




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



                        <h3>
                        Recent Transactions
                        </h3>




                        ${
                            transactions.length

                            ?

                            transactions.map(tx => `


                            <div class="transaction">


                                <p>
                                <strong>Transaction ID:</strong>
                                </p>


                                <code>
                                ${tx.txid}
                                </code>



                                <p>

                                Status:

                                ${
                                    tx.status.confirmed

                                    ?
                                    "Confirmed"

                                    :

                                    "Pending"

                                }

                                </p>


                            </div>


                            `).join("")


                            :

                            "<p>No transactions found.</p>"

                        }



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

                        date:
                        new Date().toISOString()

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

        payButton.addEventListener("click", function(){

            alert(
                "Payment system coming soon."
            );

        });

    }


});





// =================================
// ETHEREUM FUNCTIONS
// =================================



async function getEthereumBalance(address) {


    const url =

    `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;



    const response =
        await fetch(url);



    const data =
        await response.json();



    if(data.status !== "1") {

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



    if(data.status !== "1") {

        return [];

    }



    return data.result;


}







// =================================
// BITCOIN FUNCTIONS
// =================================



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







async function getBitcoinTransactions(address) {


    const url =
    `https://blockstream.info/api/address/${address}/txs`;



    const response =
        await fetch(url);



    const data =
        await response.json();



    return data.slice(0,5);


}
