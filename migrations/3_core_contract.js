var NucleusVisionCoreToken = artifacts.require("../contracts/NucleusVisionCoreToken.sol");

module.exports = function(deployer, network, accounts) {
  return liveDeploy(deployer, accounts);
};

async function liveDeploy(deployer, accounts) {
  return deployer.deploy(NucleusVisionCoreToken).then(async() => {
    const token = await NucleusVisionCoreToken.deployed();
    await token.mintCoreToken(accounts);
    await token.finishMinting();

    const totalSupply = await token.totalSupply();
    console.log("Total tokens minted: ", totalSupply.toString());
  });
}
