const NucleusVisionCoreToken = artifacts.require("NucleusVisionCoreToken");

contract("NucleusVisionCoreToken", function(accounts) {
  beforeEach(async function() {
    this.token = await NucleusVisionCoreToken.new();
  });

  it("token metadata is correct", async function() {
    const name = await this.token.name();
    name.should.equal('NucleusVisionCore');

    const symbol = await this.token.symbol();
    symbol.should.equal('nCore');

    const decimals = await this.token.decimals();
    assert.equal(decimals, 0);
  });

  it("should have the right owner", async function() {
    const owner = await this.token.owner();
    owner.should.equal(accounts[0]);
  });

  it("should have total supply of 10 nCore tokens", async function() {
    await this.token.mintCoreToken(accounts);
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(10, "total supply is not 10");
  });

  it("cannot mint once finish mint is called", async function() {
    await this.token.mintCoreToken([accounts[0]])
    const balance = await this.token.balanceOf(accounts[0]);
    balance.should.be.bignumber.equal(1);

    await this.token.finishMinting();
    await this.token.mintCoreToken([accounts[1]]).should.be.rejectedWith('revert');
  });

  it("token ownership cannot be changed", async function() {
    await this.token.mintCoreToken([accounts[0]])
    const balance = await this.token.balanceOf(accounts[0]);
    balance.should.be.bignumber.equal(1);

    await this.token.transfer(accounts[1], 1, {from: accounts[0]}).should.be.rejectedWith('revert');
    await this.token.approve(accounts[1], 1, {from: accounts[0]}).should.be.rejectedWith('revert');
    await this.token.transferFrom(accounts[0], accounts[1], 1, {from: accounts[0]}).should.be.rejectedWith('revert');
    assert.equal(await this.token.allowance(accounts[0], accounts[1]), 0)
  });

  it("totalSupply doesn't change with duplicate minting", async function() {
    await this.token.mintCoreToken([accounts[0], accounts[1], accounts[2]]);
    // duplicate minting
    await this.token.mintCoreToken([accounts[0], accounts[1]])
    var totalSupply = await this.token.totalSupply();
    totalSupply.should.be.bignumber.equal(3, "total supply is not 3");
  });

});
