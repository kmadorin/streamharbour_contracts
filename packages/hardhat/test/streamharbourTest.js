const {ethers} = require("hardhat");
const {use} = require("chai");
const {solidity} = require("ethereum-waffle");

use(solidity);

describe("Streamharbour", function () {
  let streamharbourContract;
  let tokenMockContract;

  describe("Streamharbour", function () {
    it("Should deploy Streamharbour", async function () {
      const StreamharbourContractFactory = await ethers.getContractFactory(
        `Streamharbour`
      );

      const TokenMockContractFactory = await ethers.getContractFactory(
        `TokenMock`
      );

      streamharbourContract = await StreamharbourContractFactory.deploy();
      tokenMockContract = await TokenMockContractFactory.deploy("DAI", "DAI");
    });

    describe("donate()", function () {
      // it("Should be able to donate ETH", async function () {
      //   const [fan, streamer] = await ethers.getSigners();
      //   const streamerAddress = await streamer.getAddress();
      //   console.log(`###: streamerAddress`, streamerAddress);
      //   const to = streamharbourContract.address;
      //   const amountInEther = `1.0`;
      //
      //   const abiCoder = ethers.utils.defaultAbiCoder;
      //   const data = abiCoder.encode(
      //     ["address", "string"],
      //     [streamerAddress, "Hello World"]
      //   );
      //
      //   const logsFilter = streamharbourContract.filters.DonationNative(
      //     null,
      //     streamerAddress
      //   );
      //
      //   const eventsBefore = await streamharbourContract.queryFilter(
      //     logsFilter
      //   );
      //
      //   console.log(`###: eventsBefore`, eventsBefore);
      //
      //   const txObj = {
      //     to,
      //     value: ethers.utils.parseEther(amountInEther),
      //     data,
      //   };
      //
      //   const fanBalanceBefore = await fan.getBalance();
      //   const streamerBalanceBefore = await streamer.getBalance();
      //
      //   const transaction = await fan.sendTransaction(txObj);
      //
      //   const receipt = await transaction.wait();
      //
      //   const fanBalanceAfter = await fan.getBalance();
      //   const streamerBalanceAfter = await streamer.getBalance();
      //   const fanBalanceDelta = fanBalanceAfter.sub(fanBalanceBefore);
      //   const streamerBalanceDelta = streamerBalanceAfter.sub(
      //     streamerBalanceBefore
      //   );
      //
      //   const eventsAfter = await streamharbourContract.queryFilter(logsFilter);
      //   const tipAmount = eventsAfter[0].args.value.toString();
      //   console.log(`###: fanBalanceDelta`, ethers.utils.formatEther(fanBalanceDelta));
      //   console.log(`###: streamerBalanceDelta`, ethers.utils.formatEther(streamerBalanceDelta));
      //   console.log(`###: tipAmount`, ethers.utils.formatEther(tipAmount));
      //   console.log(`###: receipt.gasUsed`, receipt.gasUsed.toString());
      //
      //   return true;
      //   // expect(await myContract.purpose()).to.equal(newPurpose);
      // });

      it("Should be able to donate ERC20", async function () {
        const [fan, streamer] = await ethers.getSigners();
        const streamerAddress = await streamer.getAddress();
        const fanAddress = await fan.getAddress();

        await tokenMockContract.mint(
          fanAddress,
          ethers.utils.parseEther("1000")
        );

        await tokenMockContract
          .connect(fan)
          .approve(
            streamharbourContract.address,
            ethers.utils.parseEther("10")
          );

        const logsFilter = streamharbourContract.filters.Donation(
          null,
          streamerAddress
        );

        await streamharbourContract
          .connect(fan)
          .donate(
            streamerAddress,
            tokenMockContract.address,
            ethers.utils.parseEther("10"),
            "Hello World"
          );

        const eventsAfter = await streamharbourContract.queryFilter(logsFilter);
        console.log(`###: eventsAfter`, eventsAfter);
        const streamerBalanceAfter = await tokenMockContract.balanceOf(streamerAddress);
        console.log(`###: streamerBalanceAfter`, ethers.utils.formatEther(streamerBalanceAfter));


        return true;
        // expect(await myContract.purpose()).to.equal(newPurpose);
      });
    });
  });
});
