import { TransferPolicyCapId } from './../../utils/packageInfo';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
//import { packageId } from '../../utils/packageInfo';
dotenv.config();

export async function addRule(packageId: any, TransferPolicyId: any, TransferPolicyCapId: any, itemType: any) {
    const { keypair, client } = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::royalty_policy::set`,
        arguments: [
            tx.object(TransferPolicyId),
            tx.object(TransferPolicyCapId),
            tx.pure.u16(10)
        ],
        typeArguments: [itemType]
    })
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
    });
    console.log(result.digest);
}

//addRule();