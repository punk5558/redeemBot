const ethers = require('ethers');
const Web3 = require('web3');
require('dotenv').config();
const abi = require('./abi.json');
const erc20Abi = require('./erc20Abi.json');
const contractAddress = '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000';
const agoraContractAddress = '0xcFd482DcE13cA1d27834D381AF1b570E9E6C6810';
const HDWalletProvider = require("@truffle/hdwallet-provider");
//const fetch = require('node-fetch');
//const axios = require('axios').default;

const mnemonicPhrase = process.env.MNEMONIC; // 12 word mnemonic
let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase
  },
  providerOrUrl: process.env.HTTP_RPC
});
/*
const network = {
  name: "andromeda",
  chainId: 1088,
  //_defaultProvider: (providers) => new providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/33PDDfQl0HEjXtuMlsr6yA6d4i5LmTk3")
};*/

const web3 = new Web3(provider);
//console.log(abi);
const provider1 = new ethers.providers.JsonRpcProvider(process.env.HTTP_RPC);
const cEthContract = new ethers.Contract(contractAddress, erc20Abi, provider1);
const cEthContractCopy = new web3.eth.Contract(abi, agoraContractAddress);


console.log("bot listening")

async function run(_amount){
    // call the contract to redeemUnderlying

    try{
      await cEthContractCopy.methods.redeemUnderlying(_amount).send({
          from: '0xc346293aaC7F51a37bCd4C589AB6e7a374A620a0',
          gasLimit: '2000000',
          gasPrice: '20000000000',
          });
      } catch(err){
        console.error(err);
      }
    console.log("redeem method called");

}

cEthContract.on("Transfer", (...parameters) =>{

  //console.log(parameters[1], ethers.BigNumber.from(parameters[2]).toString());

  // once we found a tx with mint event, we are going to get the object and
  // check the method and mintAmount, which we will input into redeemUnderlying

  try{
    var inputAmount = ethers.BigNumber.from(parameters[2]).toString();
    if(parameters[1]==agoraContractAddress && inputAmount > 49000000000000000){
      run(inputAmount);
    }
  }catch(err) {
    console.error(err);
  }



});
