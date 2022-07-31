const ethers = require('ethers');
const Web3 = require('web3');
require('dotenv').config();
const abi = require('./abi.json');
const contractAddress = '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000';
const agoraContractAddress = '0xcFd482DcE13cA1d27834D381AF1b570E9E6C6810';
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonicPhrase = process.env.MNEMONIC; // 12 word mnemonic
let provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase
  },
  providerOrUrl: process.env.HTTP_RPC
});

const network = {
  name: "andromeda",
  chainId: 1088,
  //_defaultProvider: (providers) => new providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/33PDDfQl0HEjXtuMlsr6yA6d4i5LmTk3")
};

const web3 = new Web3(provider);
//console.log(abi);
const provider1 = new ethers.providers.JsonRpcProvider(process.env.HTTP_RPC);
const cEthContract = new ethers.Contract(contractAddress, abi, provider1);
const cEthContractCopy = new web3.eth.Contract(abi, agoraContractAddress);

console.log("bot listening")
cEthContract.on("Transfer", (...parameters) =>{

  //let event = parameters;
  // parameters[0] is first arg, 1 is second arg and etc., the last one is the json of the transaction detail , where you can extract more info
  //const event = parameters[parameters.length - 1];
  //console.log(ethers.BigNumber.from(parameters[2]).toString());

  // once we found a tx with mint event, we are going to get the object and
  // check the method and mintAmount, which we will input into redeemUnderlying
  async function run(_to, _amount){
    //let transaction = await web3.eth.getTransaction(txhash);
    //console.log(transaction);
    //let method = transaction.input;
    //let value = transaction.value;
    if( _amount > 5000000000000000 && _to=="0xcFd482DcE13cA1d27834D381AF1b570E9E6C6810"){ // if method is mint as there are other methods that emit a mint event
      //let gasPrice = web3.utils.hexToNumber(web3.eth.getGasPrice());
      //let targetGasPrice = gasPrice * 2;
      //console.log(targetGasPrice);
      // call the contract to redeemUnderlying
      //let tx = await cEthContractCopy.methods.redeemUnderlying(amount).
          //send({from: '0xc346293aaC7F51a37bCd4C589AB6e7a374A620a0' });
      //console.log("redeem called", tx.transactionHash); */
      var inputAmount = ethers.BigNumber.from(_amount).toString();
      console.log("found event", inputAmount);
      try{
        //await sleep(10000)

        // pause for specified time before calling redeem function
        function sleep(ms) {
          return new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
}
        await cEthContractCopy.methods.redeemUnderlying(inputAmount).send({
            from: '0xc346293aaC7F51a37bCd4C589AB6e7a374A620a0',
            gasLimit: '2000000',
            });
        } catch(err){
          console.error(err);
        }
      console.log("redeem method called");
    }
  }

  try{
      run(parameters[1], parameters[2]);
  }catch(err) {
    console.error(err);
  }

});
