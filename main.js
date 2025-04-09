let WALLET_CONNECTED= '';
let contractAddress = "0x47812AEbc3e70619e922dAA7b2bf4D9C51cCeF5B";
let contractAbi= [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandidates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];


const connectMetamask = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    WALLET_CONNECTED = await signer.getAddress();

    // Hide the connect button
    const connectButton = document.querySelector('button[onclick="connectMetamask()"]');
    connectButton.style.display = 'none';

    // Show the notification
    const notification = document.getElementById("metamasknotification");
    notification.style.display = 'block';
    notification.innerHTML = "Metamask is connected: " + WALLET_CONNECTED;

    // Check if connected wallet is owner
    await checkOwner();

    // Call voteStatus and getAllCandidates after successful connection
    await voteStatus();
    await getAllCandidates();
}

const checkOwner = async() => {
    if(WALLET_CONNECTED !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        
        try {
            const owner = await contractInstance.getOwner();
            const isOwner = owner.toLowerCase() === WALLET_CONNECTED.toLowerCase();
            
            // Show/hide the add candidate form based on ownership
            const addCandidateForm = document.querySelector('#services .row.mb-5');
            if (addCandidateForm) {
                addCandidateForm.style.display = isOwner ? 'flex' : 'none';
            }

            // Update the notification to show owner status
            const notification = document.getElementById("metamasknotification");
            if (notification) {
                const ownerStatus = isOwner ? " (Owner)" : " (Voter)";
                notification.innerHTML = "Metamask is connected: " + WALLET_CONNECTED + ownerStatus;
            }
        } catch (error) {
            console.error("Error checking owner:", error);
            // If there's an error, keep the form hidden
            const addCandidateForm = document.querySelector('#services .row.mb-5');
            if (addCandidateForm) {
                addCandidateForm.style.display = 'none';
            }
        }
    }
}

const getAllCandidates = async() => {
    if(WALLET_CONNECTED !== '') {
        var p3 = document.getElementById("p3");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        p3.innerHTML = "Please wait, getting all the candidates from the voting smart contract";        
        var candidates = await contractInstance.getAllVotesOfCandidates();
        console.log(candidates);
        var table = document.getElementById("myTable");
        
        // Clear existing rows except header
        var tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        // Update the select dropdown
        var select = document.getElementById("vote");
        select.innerHTML = '<option value="">Select a candidate</option>';

        for (let i = 0; i < candidates.length; i++) {
            var row = tbody.insertRow();
            var idCell = row.insertCell();
            var nameCell = row.insertCell();
            var votesCell = row.insertCell();

            idCell.innerHTML = i + 1;
            nameCell.innerHTML = candidates[i].name;
            votesCell.innerHTML = candidates[i].voteCount;

            // Add option to select dropdown
            var option = document.createElement("option");
            option.value = i;
            option.text = `${i + 1}. ${candidates[i].name}`;
            select.appendChild(option);
        }
        p3.innerHTML = "The candidate list at last updated"
    }
    else {
        var p3 = document.getElementById("p3");
        p3.innerHTML = "Please connect metamask first";
    }
}

const addVote = async() => {
    if(WALLET_CONNECTED !== '') {
        var select = document.getElementById("vote");
        var selectedIndex = select.value;
        
        if (selectedIndex === "") {
            document.getElementById("cand").innerHTML = "Please select a candidate";
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        var cand = document.getElementById("cand");

        cand.innerHTML = "Please wait, adding a vote in the smart contract";
        try {
            // Check if voting is still open
            const votingStatus = await contractInstance.getVotingStatus();
            if (!votingStatus) {
                cand.innerHTML = "Voting period has ended";
                return;
            }
            // Check if user has already voted
            const hasVoted = await contractInstance.voters(WALLET_CONNECTED);
            if (hasVoted) {
                cand.innerHTML = "You have already voted";
                return;
            }
            const tx = await contractInstance.vote(selectedIndex);
            cand.innerHTML = "Transaction sent, waiting for confirmation...";
            await tx.wait();
            cand.innerHTML = "Vote added successfully!";
            // Refresh the candidates list after voting
            await getAllCandidates();
        } catch (error) {
            console.error("Error adding vote:", error);
            if (error.code === 4001) {
                cand.innerHTML = "Transaction was rejected by user";
            } else {
                cand.innerHTML = "Error adding vote: Please Vote again ";
            }
        }
    }
    else {
        var cand = document.getElementById("cand");
        cand.innerHTML = "Please connect metamask first";
    }
}

const voteStatus = async() => {
    if(WALLET_CONNECTED !== '') {
        var status = document.getElementById("status");
        var remainingTime = document.getElementById("time");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const currentStatus = await contractInstance.getVotingStatus();
        const time = await contractInstance.getRemainingTime();
        console.log(time);
        status.innerHTML = currentStatus == 1 ? "Voting is currently open" : "Voting is finished";
        remainingTime.innerHTML = `Voting time is ${parseInt(time, 16)} seconds`;
    }
    else {
        var status = document.getElementById("status");
        status.innerHTML = "Please connect metamask first";
    }
}

const addCandidate = async() => {
    if(WALLET_CONNECTED !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        
        try {
            const candidateName = document.querySelector('input[name="candidateName"]').value;
            if (!candidateName) {
                alert("Please enter a candidate name");
                return;
            }
            const tx = await contractInstance.addCandidate(candidateName);
            await tx.wait();
            // Clear the input field
            document.querySelector('input[name="candidateName"]').value = '';
            // Refresh the candidates list
            await getAllCandidates();
            
            alert("Candidate added successfully!");
        } catch (error) {
            console.error("Error adding candidate:", error);
            alert("Error adding candidate: Please Add Candidate.");
        }
    } else {
        alert("Please connect MetaMask first");
    }
}
