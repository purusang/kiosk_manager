import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import fs from "fs";
import getExecStuff from '../../utils/execStuff';
dotenv.config();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
const mintNfts = async (packageId: any): Promise<string[]> => {
    const tx = new TransactionBlock();
    const { keypair, client } = getExecStuff();
    console.log("Address", keypair.getPublicKey().toSuiAddress());

    for(let i=0; i<10; i++){
        tx.moveCall({
            target: `${packageId}::nft::mint`,
        });
        await sleep(2000);
    }

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const digest_ = result.digest;
    console.log(`Tx hash: ${result.digest}`);

    let nft: string[] = [];
    if (!digest_) {
        console.log("Digest is not available");
        // return { packageId };
        console.log(packageId);
        return nft;
    }

    const txn = await client.getTransactionBlock({
        digest: String(digest_),
        // only fetch the effects and objects field
        options: {
            showEffects: true,
            showInput: false,
            showEvents: false,
            showObjectChanges: true,
            showBalanceChanges: false,
        },
    });
    let output: any;
    output = txn.objectChanges;

    for (let i = 0; i < output.length; i++) {
        const item = output[i];
        if (item.type === 'created') {
            if (item.objectType === `${packageId}::nft::Sword`) {
                nft.push(String(item.objectId));
            }
        }
    }
    console.log(nft);
    return nft;

}
export default mintNfts;