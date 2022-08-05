const ethers = require('ethers');
const Web3 = require('web3');
require('dotenv').config();
const abi = require('./abi.json');
const erc20Abi = require('./erc20Abi.json');
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
const cEthContract = new ethers.Contract(contractAddress, erc20Abi, provider1);
const cEthContractCopy = new web3.eth.Contract(abi, agoraContractAddress);

console.log("bot listening")

try{
    run();
}catch(err) {
  console.error(err);
}

async function run(){
    while(true){
      let bal = await cEthContract.balanceOf('0xcFd482DcE13cA1d27834D381AF1b570E9E6C6810');
      bal = parseInt(ethers.BigNumber.from(bal).toString());

      if(bal > 49000000000000000) {
        try{
          await cEthContractCopy.methods.redeemUnderlying(bal).send({
              from: '0xc346293aaC7F51a37bCd4C589AB6e7a374A620a0',
              gasLimit: '2000000',
              //gasPrice: '25000000000',
              });
          } catch(err){
            console.error(err);
          }
        console.log("redeem method called");
        }
        //console.log("end loop");
      }
}


/*cEthContract.on("Transfer", (...parameters) =>{

  // once we found a tx with mint event, we are going to get the object and
  // check the method and mintAmount, which we will input into redeemUnderlying
  async function run(_to, _amount){

    if( _amount > 49000000000000000 && _to=="0xcFd482DcE13cA1d27834D381AF1b570E9E6C6810"){ // if method is mint as there are other methods that emit a mint event

      // call the contract to redeemUnderlying

      var inputAmount = ethers.BigNumber.from(_amount).toString();
      //console.log("found event", inputAmount);
      try{
        await cEthContractCopy.methods.redeemUnderlying(inputAmount).send({
            from: '0xc346293aaC7F51a37bCd4C589AB6e7a374A620a0',
            gasLimit: '2000000',
            //gasPrice: '25000000000',
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

});*/
