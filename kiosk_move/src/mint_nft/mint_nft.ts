import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import fs from "fs";
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap } from '../../utils/packageInfo';
dotenv.config();

async function mint() {
    const tx = new TransactionBlock();
    const { keypair, client } = getExecStuff();
    console.log("Address", keypair.getPublicKey().toSuiAddress());

    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });
    tx.moveCall({
        target: `${packageId}::nft::mint`,
    });

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const digest_ = result.digest;
    console.log(`Tx hash: ${result.digest}`);

    let nft: string[] = [];
    //let KioskOwnerCap: any;
    //let TransferPolicyId: any;
    //let TransferPolicyCapId: any;

    if (!digest_) {
        console.log("Digest is not available");
        return { packageId };
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
        //console.log(`nft[${i}]= ${nft[i]} \n`)
    }

    let fileContent = '';
    for (let i = 0; i < nft.length; i++) {
        fileContent += `export let nft_${i + 1} = '${nft[i]}';\n`;
    }

    // Check if the file exists
    const filePath = './utils/nft_id.ts';
    if (fs.existsSync(filePath)) {
        // Clear the contents of the file
        fs.writeFileSync(filePath, '');
    }

    // Write the new content to the file
    fs.writeFileSync(filePath, fileContent);

    console.log(nft);

}
mint();