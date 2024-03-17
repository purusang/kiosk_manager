import { KioskClient, Network, KioskTransaction, KioskOwnerCap } from '@mysten/kiosk';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
// import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {getKeyAndClient, getEnv} from "./utils";

// We need a Sui Client. You can re-use the SuiClient of your project
// (it's not recommended to create a new one).
// const client = new SuiClient({ url: getFullnodeUrl('testnet') });
// // Now we can use it to create a kiosk Client.
let mnemonics : string = getEnv("MNEMONICS1"); //...77ce308725b1ec84                    // caller/signer mnemonic  
const { keypair, client } = getKeyAndClient(mnemonics);
const kioskClient = new KioskClient({
	client,
	network: Network.TESTNET,
});
const address = "0x8ee63e61b0388b4f78dac2f477ce3087e5f1fc38bbcade729dbf14b625b1ec84";   // caller address



const getKioskAndCaps = async (address:string) =>{
    const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({ address });
    return { kioskOwnerCaps, kioskIds };
}
const getKioskInfo = async (id : string) =>{
    return  await kioskClient.getKiosk({
        id,
        options: {
            withKioskFields: true, // this flag also returns the `kiosk` object in the response, which includes the base setup
            withListingPrices: true, // This flag enables / disables the fetching of the listing prices.
        }
    });
}

const placeAndList = async (kiosk:string, item: string, itemType: string, cap: any) =>{
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place_and_list`,
        arguments: [
            tx.object(kiosk),
            tx.object(cap),
            tx.object(item),
            tx.pure.u64(100000000)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    await client.signAndExecuteTransactionBlock({signer: keypair, transactionBlock: tx });
}
const createKiosk = async ()=>{
    const tx = new TransactionBlock();
    let kiosk = tx.moveCall({
        target: `0x02::kiosk::new`,
    });
    tx.moveCall({
        target: `0x02::transfer::public_share_object`,
        arguments: [
            kiosk[0]
        ],
        typeArguments:[ "0x02::kiosk::Kiosk" ]
    });
    tx.moveCall({
        target: `0x02::transfer::public_transfer`,
        arguments: [
            kiosk[1], tx.pure.address(address)
        ],
        typeArguments:[ "0x02::kiosk::KioskOwnerCap" ]
    });
    await client.signAndExecuteTransactionBlock({signer: keypair, transactionBlock: tx });
}

async function main(){
    // const address = "0x8ee63e61b0388b4f78dac2f477ce3087e5f1fc38bbcade729dbf14b625b1ec84";   // caller address
    const packageId = "0xff0ad00294545fd4230278d44de19376da4df216eba1a89eb00f73496c15d031"; // nft contract
    const nftId = "0x2a64b1d98036cfcf156120f05e02e95b12bbf4fde2086f9d82d483480fdb7e0e";     
    const itemType = `${packageId}::nft::Sword`;

    // mint(address, packageId);
    // await createKiosk();
    const { kioskOwnerCaps, kioskIds } = await getKioskAndCaps(address);
    console.log(kioskOwnerCaps[0], kioskIds[0] );
    await placeAndList( kioskIds[0], nftId,  `${packageId}::nft::Sword`, kioskOwnerCaps[0].objectId);
    console.log(`Item ${nftId} placed in Kiosk: ${kioskIds[0]}`);
}
main();