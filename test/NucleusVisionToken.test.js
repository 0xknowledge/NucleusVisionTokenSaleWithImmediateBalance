const NucleusVisionToken = artifacts.require("NucleusVisionToken");

function Billion(x) {
  return x * 1000 * 1000 * 1000;
};

function DecimalsFormat(x) {
  // Nucleus token has  decimals
  return x * Math.pow(10, 18);
};

contract("NucleusVisionToken", function(accounts) {
  beforeEach(async function() {
    this.token = await NucleusVisionToken.new();
  });

  it("token metadata is correct", async function() {
    const name = await this.token.name();
    name.should.equal('NucleusVision');

    const symbol = await this.token.symbol();
    symbol.should.equal('nCash');

    const decimals = await this.token.decimals();
    assert.equal(decimals, 18);
  });

  it("should have the right owner", async function() {
    const owner = await this.token.owner();
    owner.should.equal(accounts[0]);
  });

  it("should have total supply of 10 billion nCash tokens", async function() {
    await this.token.mint(accounts[0], DecimalsFormat(Billion(10)));
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(10)), "total supply is not 10 billion");
  });

  it("should error if more than 10 billion nCash tokens are minted", async function() {
    // 6 billion
    await this.token.mint(accounts[0], DecimalsFormat(Billion(6)));
    // another 6 billion will error out
    await this.token.mint(accounts[0], DecimalsFormat(Billion(6))).should.be.rejectedWith('revert');

    // supply will still be 6 billion
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(6)), "total supply is not 6 billion");

    // another 4 billion should get through
    await this.token.mint(accounts[0], DecimalsFormat(Billion(4)));

    // supply should be 10 billion
    totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(DecimalsFormat(Billion(10)), "total supply is not 10 billion");

    // no more tokens can be added
    await this.token.mint(accounts[0], 1).should.be.rejectedWith('revert');
    await this.token.mint(accounts[0], DecimalsFormat(1)).should.be.rejectedWith('revert');
    await this.token.mint(accounts[0], DecimalsFormat(Billion(1))).should.be.rejectedWith('revert');
  });

  it("only owner can unlock token", async function() {
    await this.token.mint(accounts[1], 100);
    await this.token.mint(accounts[2], 200);
    await this.token.mint(accounts[3], 300);

    for (let i = 1; i <= 5; ++i) {
      await this.token.unlockToken({from: accounts[i]}).should.be.rejectedWith('revert');
    }

    status = await this.token.unlocked();
    assert.equal(status, false);

    await this.token.unlockToken({from: accounts[0]});
    status = await this.token.unlocked();
    assert.equal(status, true);
  });

  it("all transfer/allocate call should fail till the token is unlocked", async function() {
    await this.token.mint(accounts[1], 100);
    await this.token.mint(accounts[2], 200);
    await this.token.mint(accounts[3], 300);

    await this.token.transfer(accounts[4], 100, {from: accounts[1]}).should.be.rejectedWith('revert');
    await this.token.transferFrom(accounts[1], accounts[2], 100, {from: accounts[1]}).should.be.rejectedWith('revert');
    await this.token.approve(accounts[4], 100, {from: accounts[1]}).should.be.rejectedWith('revert');
    await this.token.increaseApproval(accounts[4], 100, {from: accounts[1]}).should.be.rejectedWith('revert');
    await this.token.decreaseApproval(accounts[4], 100, {from: accounts[1]}).should.be.rejectedWith('revert');

    await this.token.unlockToken();

    // once unlocked all the above functions should work as intended
    await this.token.transfer(accounts[4], 100, {from: accounts[1]});
    await this.token.approve(accounts[4], 100, {from: accounts[2]});
    await this.token.transferFrom(accounts[2], accounts[5], 100, {from: accounts[4]});
    await this.token.approve(accounts[4], 100, {from: accounts[3]});
    await this.token.increaseApproval(accounts[4], 100, {from: accounts[3]});
    await this.token.decreaseApproval(accounts[4], 100, {from: accounts[3]});

    var balance = await this.token.balanceOf(accounts[1]);
    balance.should.be.bignumber.equal(0);

    balance = await this.token.balanceOf(accounts[2]);
    balance.should.be.bignumber.equal(100);

    balance = await this.token.balanceOf(accounts[3]);
    balance.should.be.bignumber.equal(300);

    balance = await this.token.balanceOf(accounts[4]);
    balance.should.be.bignumber.equal(100);

    balance = await this.token.balanceOf(accounts[5]);
    balance.should.be.bignumber.equal(100);
  });

});
