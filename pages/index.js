import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import styles from "./styles.module.css"; 


export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [review, setReview] = useState(""); // Added review state
  const [rating, setRating] = useState(3);
  const [submittedReview, setSubmittedReview] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);


  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const [addResult, setAddResult] = useState(undefined);
  const [subResult, setSubResult] = useState(undefined);
  const [mulResult, setMulResult] = useState(undefined);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");

 

  const submitReview = () => {
    // Perform actions to submit the review and rating
    console.log("Review:", review);
    console.log("Rating:", rating);
    setSubmittedReview(true);
  };

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setIsConnected(true);
        handleAccount(accounts[0]);
      }
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    setIsConnected(true);
    handleAccount(accounts[0]);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

 

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
      updateTransactionHistory(true, 1);
    }
  }

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
      updateTransactionHistory(false, 1);

      setTimeout(() => { alert(`Have a nice day dear, ${username}`);
     }, 5000);
    }
  };

  const updateTransactionHistory = (isDeposit, amount) => {
    setTransactionHistory([
      ...transactionHistory,
      {
        timestamp: new Date().toLocaleString(),
        isDeposit,
        amount: isDeposit ? amount : -amount,
      },
    ]);
  };

  const addition = async () => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      try {
        const answer = await addition(a, b);
        console.log("Addition result:", answer); // Debugging information
        setAddResult(answer);
      } catch (error) {
        console.error("Error calling addition function:", error);
      }
    }
  };
  

  const subtraction = async () => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.substraction(a, b);
      setSubResult(answer);
    }
  };

  const multiplication = async () => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.multiplication(a, b);
      setMulResult(answer);
    }
  };

  const handleInputAChange = (event) => {
    setInputA(event.target.value);
  };

  const handleInputBChange = (event) => {
    setInputB(event.target.value);
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (!isConnected) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }
    const renderTransactionHistory = () => {
      return (
        <div className="transaction-history transaction" >
          <h2>Transaction History</h2>
          <ul>
            {transactionHistory.map((transaction, index) => (
              <li key={index}>
                {transaction.timestamp} -{" "}
                {transaction.isDeposit ? "Deposit" : "Withdraw"}:{" "}
                {transaction.amount} ETH
              </li>
            ))}
          </ul>
        </div>
      );
    };

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button className="action-button" onClick={deposit}>Deposit 1 ETH</button>
        <button className="action-button" onClick={withdraw}>Withdraw 1 ETH</button>
        {renderTransactionHistory()} {/* Render transaction history */}
      </div>
    )
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className={`container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="toggle-container">
      <button 
        className={`mode-button ${isDarkMode ? "light" : "dark"}`}
         onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <header>
        <h1 className="header-title">Welcome to the Metacrafters ATM!</h1>
        {isConnected && (
          <div className="user-info">
          <p>Hello {username}</p>
          <div className="Calculator">
          <h2>Calculator</h2>
          <p style={{ fontFamily: "Sans-serif" }}>
            Add: {addResult !== undefined ? addResult.toString() : ""}
          </p>
          <p style={{ fontFamily: "Sans-serif" }}>
            Sub: {subResult != undefined ? subResult.toString() : ""}
          </p>
          <p style={{ fontFamily: "Sans-serif" }}>
            Multiply: {mulResult !== undefined ? mulResult.toString() : ""}
          </p>

          <input
            type="number"
            placeholder="Enter value A"
            value={inputA}
            onChange={handleInputAChange}
          />
          <input
            type="number"
            placeholder="Enter value B"
            value={inputB}
            onChange={handleInputBChange}
          />

          <button
            style={{ backgroundColor: "grey" }}
            onClick={addition}
          >
            Add
          </button>
          <button
            style={{ backgroundColor: "grey" }}
            onClick={subtraction}
          >
            Sub
          </button>
          <button
            style={{ backgroundColor: "grey" }}
            onClick={multiplication}
          >
            Multiply
          </button>
        </div> 
        </div>
        
          
        )}
        
        
      </header>
      {/* Username input */}
      {!isConnected && (
        <div className="username-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
         <button onClick={connectAccount}>Connect</button>
        </div>
      )}
         {isConnected && initUser()}
      {/* Review section */}
      <div className="review-section">
        <h2>Leave a Review</h2>
        {submittedReview ? (
          <p>Thanks for your review!</p>
        ) : (
          <>
            <textarea
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="rating">
              <p>Rate our website:</p>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <p>{rating}/5</p>
            </div>
            <button onClick={submitReview}>Submit Review</button>
          </>
        )}
      </div>
      <div className="time">
        {new Date().toLocaleTimeString()}
      </div>
      <style jsx>{`
        body {
          margin: left 50%;
          padding: 0;
          background-color: ${isDarkMode ? "#333" : "#f5f5f5"};
          color: ${isDarkMode ? "#fff" : "#333"};
          font-family: Arial, sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
          text-align: center;
        }

        .Calculator{
          
          position: relative;
          top:200px;
          right: 500px;
      
        }

        .toggle-button {
          text-align: right;
          padding: 10px;
        }
        
        .container {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .dark-mode {
          background-color: #000;
          color: #fff;
        }

        .light-mode {
          background-color: #f5f5f5;
          color: #333;
        }

        .header-title {
          margin-top: -18%;
          
      
        
        }

        .account-info {
          font-size: 18px;
          margin: 10px 0;
        }

        .user-info {
          margin-top: -20%;
    
          

        }

        .review-section {
          margin-top: 20px;
        }

        .rating {
          display: flex;
          align-items: center;
        }

        .time {
          margin-top: 20px;
          font-size: 18px;
          
          position: relative;
          top:-60%;
          right:30%;        }

        .action-button {
          background-color: ${isDarkMode ? "#3498db" : "#333"};
          color: #fff;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          margin: 5px;
          border-radius: 5px;
          font-size: 16px;
          
        }

        .mode-button {
          background-color: ${isDarkMode ? "#333" : "#3498db"};
          color: #fff;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

               
      `}</style>
    </main>
  );
}
