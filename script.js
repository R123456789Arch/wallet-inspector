const ETHERSCAN_API_KEY = "DF9GPBMVKDKDGP9UC2665RBKZ1MA3FFAF4";

document.addEventListener("DOMContentLoaded", function () {

    const walletForm = document.getElementById("walletForm");
    const payButton = document.getElementById("payButton");
    const walletResult = document.getElementById("walletResult");

    walletForm?.addEventListener("submit", async function (event) {

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
                    <p>${network} support is not yet available.</p>
                </div>
            `;

            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {

            alert("Please enter a valid Ethereum address.");

            return;
        }

        walletResult.innerHTML = `
            <div class="report">
                <p>Loading wallet information...</p>
            </div>
        `;

        try {

            const balance = await getEthereumBalance(wallet);

            localStorage.setItem(
                "walletRequest",
                JSON.stringify({
                    address: wallet,
                    blockchain: network,
                    balance: balance,
                    date: new Date().toISOString()
                })
            );

            walletResult.innerHTML = `
                <div class="report">

                    <h3>Wallet Detected</h3>

                    <p><strong>Blockchain:</strong> Ethereum</p>

                    <p><strong>Address:</strong></p>

                    <code>${wallet}</code>

                    <p><strong>Balance:</strong> ${balance} ETH</p>

                </div>
            `;

        } catch (error) {

            console.error(error);

            walletResult.innerHTML = `
                <div class="report">

                    <h3>Error</h3>

                    <p>Unable to retrieve wallet information.</p>

                </div>
            `;
        }

    });

    payButton?.addEventListener("click", function () {

        alert("This demo currently displays public blockchain information only.");

    });

});

async function getEthereumBalance(address) {

    const url =
        `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network error");
    }

    const data = await response.json();

    if (data.status !== "1") {
        throw new Error(data.result || "API error");
    }

    return (Number(data.result) / 1e18).toFixed(6);
}
