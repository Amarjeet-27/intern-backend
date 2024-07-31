import hre from 'hardhat';

async function main() {
    const Election= await hre.ethers.getContractFactory("ElectionManager");
    const election = await Election.deploy();
    election.waitForDeployment();
    const address= await election.getAddress();
    console.log('Contract Deployed',address);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });