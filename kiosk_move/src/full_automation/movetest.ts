import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import fs from "fs";
import getExecStuff from '../../utils/execStuff';
dotenv.config();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const increaseCounter = async (packageId: any): Promise<string[]> => {
    const tx = new TransactionBlock();
    const { keypair, client } = getExecStuff();
    console.log("Address", keypair.getPublicKey().toSuiAddress());

    for(let i=0; i < 500; i++){
        tx.moveCall({
            target: `${packageId}::move_test::increase`,
            arguments: [tx.object("0x7c58e84931f072b3795f6b9e17a4c07f51baafcda540442c1b83737f84b86c57")],
        });
        // await sleep(2000);
    }

    for(let i=0; i < 500; i++){
        tx.moveCall({
            target: `${packageId}::move_test::increase`,
            arguments: [tx.object("0x7c58e84931f072b3795f6b9e17a4c07f51baafcda540442c1b83737f84b86c57")],
        });
        await sleep(20);
    }

    console.log(tx);
    

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const digest_ = result.digest;
    console.log(`Tx hash: ${result.digest}`);

    let nft: string[] = [];
    if (!digest_) {
        console.log("Digest is not available");
        console.log(packageId);
        return nft;
    }
    return nft;
}
export default increaseCounter;