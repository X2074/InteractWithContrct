const ethers = require('ethers');
const utils = require('ethers')
const dotenv = require('dotenv');
dotenv.config();

// Example ABI (Application Binary Interface) - Replace this with the actual ABI of your smart contract
const contractABI = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address addr) view returns (uint)",
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function transfer(address to, uint amount)"
]

// Example contract address - Replace this with the actual address of your deployed smart contract
const contractAddress = '0xa03650818CC5162F823e72d6902A9176d8A707B0';

// A Provider is a read-only connection to the blockchain
const url = "https://meer.testnet.meerfans.club";
const provider = new ethers.JsonRpcProvider(url);

// Example Signer - Replace this with your actual private key or use a wallet with a signer
const privateKey = process.env.PRIVATEKEY;
const wallet = new ethers.Wallet(privateKey);
console.log(wallet);
// new Wallet(key: string | SigningKey, provider?: null | Provider)
// Create a new wallet for the private key, optionally connected to provider.
const walletP = new ethers.Wallet(privateKey, provider);
console.log(walletP);
const signer = wallet.connect(provider);
console.log(signer);
const signerForSig = new ethers.Wallet(process.env.SIGACCOUNT);
console.log("signerForSig:\n",signerForSig);

// Creating a Contract instance
const myContract = new ethers.Contract(contractAddress, contractABI, signer);

// Example 1: Creating a new instance attached to a different address
const newAddress = '0x9876543210987654321098765432109876543210';
const newContractInstance = myContract.attach(newAddress);

// Example 2: Creating a new instance connected to a different signer
const anotherPrivateKey = '0x5678901234567890123456789012345678901234567890123456789012345678';
const anotherWallet = new ethers.Wallet(anotherPrivateKey);
const newSignerContractInstance = myContract.connect(anotherWallet);

// Example of interacting with the contract function
async function interactWithContract() {
    try {
        const symbol = await myContract.symbol();
        const decimals = await myContract.decimals();
        const balance = await myContract.balanceOf(wallet.address);

        const balance2 = await provider.getBalance(wallet.address);
        const nonceNum = await provider.getTransactionCount(wallet.address);
        const block = await provider.getBlockNumber();

        console.log('Result from getSomething:\n',
            "symbol:",symbol.toString()+"\n",
            "decimals:", decimals.toString()+"\n",
            "balance:", ethers.formatEther(balance)+" DIM", ethers.formatEther(balance2)+"meer\n",
            "nonce:", nonceNum+"\n",
            "block:", block
        );

        // send ether
        // const tx = await signer.sendTransaction({
        //     to: "0xd5849930E89DF5624A2f57084Bc304A3c462e1cC",
        //     value: ethers.parseEther("1.0")
        // });
        // const receipt = await tx.wait();
        // console.log(receipt);

        // send token
        // send 1 dim
        const amount = ethers.parseUnits("1.0", decimals);
        console.log("amount:", amount)
        // const tokenTx = await myContract.transfer("0xd5849930E89DF5624A2f57084Bc304A3c462e1cC", amount);
        // const receipt2 = await tokenTx.wait();
        // console.log(receipt2);


        // Signing messages does not require a Provider
        // const signer = new ethers.Wallet(privateKey);
        const message = "Hello DimAI!"
        // Signing the message
        const sig = await wallet.signMessage(message);
        console.log("sig:", sig);
        const verifyResult = ethers.verifyMessage(message, sig);
        console.log("verify sig:", verifyResult);

        // getCreateAddress(tx: { from: string , nonce: BigNumberish })⇒ string
        const from = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
        const nonce = 5;
        const createAddress = ethers.getCreateAddress({ from, nonce });
        console.log("createAddress:", createAddress); // "0x082B6aC9e47d7D83ea3FaBbD1eC7DAba9D687b36"

        // check if a string is an address
        console.log("isAddress:",ethers.isAddress("XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36"))

        // Constants
        console.log("Constants:\n",
            "MaxUint256:", ethers.toBeHex(ethers.MaxUint256)+"\n",
            "MaxInt256:", ethers.MaxInt256.toLocaleString()+"\n",
            "MessagePrefix:", ethers.MessagePrefix+"\n",
            "ZeroAddress:", ethers.ZeroAddress+"\n",
            "ZeroHash:", ethers.ZeroHash
        );

        // hash functions
        // keccak256(data: BytesLike) ⇒ DataHexstring
        console.log(
            "keccak256 hex:\n",
            ethers.keccak256(ethers.toBeHex(ethers.MaxUint256))+"\n",
            ethers.keccak256("0x")+"\n",
            ethers.keccak256("0x1337")+"\n",
            ethers.keccak256(new Uint8Array([ 0x13, 0x37 ]))
        )

        // ripemd160(data: BytesLike)⇒ DataHexstring
        console.log(
            "ripemd160 hex:\n",
            ethers.ripemd160(ethers.toBeHex(ethers.MaxUint256))+"\n",
            ethers.ripemd160("0x")+"\n",
            ethers.ripemd160("0x1337")+"\n",
            ethers.ripemd160(new Uint8Array([ 0x13, 0x37 ]))
        )

        // sha256(data: BytesLike)⇒ DataHexstring
        console.log(
            "sha256 hex:\n",
            ethers.sha256(ethers.toBeHex(ethers.MaxUint256))+"\n",
            ethers.sha256("0x")+"\n",
            ethers.sha256("0x1337")+"\n",
            ethers.sha256(new Uint8Array([ 0x13, 0x37 ]))
        )

        // sha256(data: BytesLike)⇒ DataHexstring
        console.log(
            "sha512 hex:\n",
            ethers.sha512(ethers.toBeHex(ethers.MaxUint256))+"\n",
            ethers.sha512("0x")+"\n",
            ethers.sha512("0x1337")+"\n",
            ethers.sha512(new Uint8Array([ 0x13, 0x37 ]))
        )

        // randomBytes(length: number)⇒ Uint8Array
        console.log(ethers.randomBytes(4));

        // =========  sign message ======== //
        // abiCoder.encode(types: ReadonlyArray< string | ParamType, values: ReadonlyArray<any>)⇒ DataHexstring
        const tokenURIs = ["ipfs://asdf202", "ipfs://asdf333"];
        // ethers.solidityPacked(types, values)
        // ethers.solidityPackedKeccak256(types, values)
        // ethers.solidityPackedSha256(types, values)
        const AbiCoder = ethers.AbiCoder.defaultAbiCoder();
        const encodeData = AbiCoder.encode(['string[]'], [tokenURIs]);
        const msgHash = ethers.keccak256(encodeData);
        // v5 ethers.utils.arrayify(value) = ethers.getBytes()
        const signature = await signerForSig.signMessage(ethers.getBytes(msgHash));

        console.log(
            "sig address:",signerForSig.address+"\n",
            encodeData+"\n",
            msgHash+"\n",
            ethers.getBytes(msgHash)+"\n",
            // signer.signMessage(message: string | Uint8Array)⇒ Promise<string>
            "signature:\n",
            {
                "message": "0xb90a308038ded3bd0ce16d2985b92be73e4f74cfa2d97421a302ba397e02ba57",
                "sig":"0x95f3e4a00c58590c09e18c3938c43a8f88e58e9e00009f1b1f347d1ead5e297e7d1c699b18bdede6b5e169e661f2221f317b8d94de5c1ee845236332bb50c3681b"
            },"\n",
            signature+"\n",
            "verify:", ethers.verifyMessage(ethers.getBytes(msgHash),signature)
        )

    } catch (error) {
        console.error('Error interacting with the contract:', error.message);
    }
}

interactWithContract().then();
