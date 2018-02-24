var NucleusVisionAllocation = artifacts.require("../contracts/NucleusVisionAllocation.sol");
var NucleusVisionToken = artifacts.require("../contracts/NucleusVisionToken.sol");

function Billion(x) {
  return x * 1000 * 1000 * 1000;
};

function DecimalsFormat(x) {
  // Nucleus token has  decimals
  return x * Math.pow(10, 18);
};

function latestTime()  {
  return web3.eth.getBlock('latest').timestamp;
};

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds(60); },
  hours: function (val) { return val * this.minutes(60); },
  days: function (val) { return val * this.hours(24); },
  weeks: function (val) { return val * this.days(7); },
  years: function (val) { return val * this.days(365); },
};

module.exports = function(deployer, network, accounts) {
  return liveDeploy(deployer, accounts);
};

async function liveDeploy(deployer, accounts) {
  var now = latestTime();
  var vesting_start = now + duration.days(7);

  // test data
  // to be replaced with production data later
  var data = [
    // test case with both immediate allocation and time vested allocation
    {
      'account': accounts[1],
      'immediate': DecimalsFormat(Billion(3)),
      'timevested': {
        'amount': DecimalsFormat(Billion(2)),
        'start': vesting_start,
        'cliff': duration.years(1),
        'duration': duration.years(4)
      }
    },
    // only immediate
    {
      'account': accounts[2],
      'immediate': DecimalsFormat(Billion(2)),
    },
    // only timevested
    {
      'account': accounts[1],
      'timevested': {
        'amount': DecimalsFormat(Billion(2)),
        'start': vesting_start,
        'cliff': duration.years(1) ,
        'duration': duration.years(4)
      },
    }
  ];

  var airdrop_accounts = [accounts[3], accounts[4], accounts[5], accounts[6]];
  const AIRDROP_TOKEN_AMOUNT = DecimalsFormat(Billion(1)) / 4;

  return deployer.deploy(NucleusVisionAllocation).then(async() => {
    const contract = await NucleusVisionAllocation.deployed();
    for (let i = 0; i < data.length; ++i) {
      var entry = data[i];
      if ('immediate' in entry && entry['immediate'] > 0) {
        await contract.mintTokens(entry['account'], entry['immediate']);
      }

      if ('timevested' in entry && entry['timevested']['amount'] > 0) {
        await contract.mintTokensWithTimeBasedVesting(entry['account'],
                                                      entry['timevested']['amount'],
                                                      entry['timevested']['start'],
                                                      entry['timevested']['cliff'],
                                                      entry['timevested']['duration']);
      }
    }

    await contract.mintAirDropTokens(AIRDROP_TOKEN_AMOUNT, airdrop_accounts);
    await contract.finishAllocation();

    const token = NucleusVisionToken.at(await contract.token());
    const totalSupply = await token.totalSupply();

    console.log("Total tokens minted: ", totalSupply.toString());
  });
}
