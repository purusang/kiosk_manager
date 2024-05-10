import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeyAndClient, getEnv } from "./utils";


// // Now we can use it to create a kiosk Client.
let mnemonics: string = getEnv("MNEMONICS1"); //...77ce308725b1ec84                    // caller/signer mnemonic  
const { keypair, client } = getKeyAndClient(mnemonics);
const kioskClient = new KioskClient({
    client,
    network: Network.TESTNET,
});
const address = "0x0850b12520f4f23a1510cf23ae06a34c073c2582c47d59bdddc6b85a59253eb7";   // caller address

const getKioskAndCaps = async (address: string) => {
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({ address });
    return { kioskOwnerCaps, kioskIds };
}


const getKioskInfo = async (id: string) => {
    return await kioskClient.getKiosk({
        id,
        options: {
            withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
            withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
        }
    });
}

const addExtension = async () => {
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::allow_extension`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
    
}
async function main() {
    const packageId = getEnv("PACKAGE"); // nft contract
    const nftId = getEnv("NFT");
    const itemType = `${packageId}::nft::Sword`;
    const publisher = getEnv("PUBLISHER");
    const policy = getEnv("TRANSFER_POLICY");
    const coin = getEnv("COIN");
    const kiosk = getEnv("KIOSK");
    const kioskCap = getEnv("KIOSK_OWNER_CAP");
    
}
main();