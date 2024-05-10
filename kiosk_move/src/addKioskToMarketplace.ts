import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../utils/execStuff';
dotenv.config();

export async function addKioskToMarketplace(kioskId: any, kioskOwnerCapId: any, packageID:any ) {
    const { keypair, client } = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageID}::ext::add_marketplace_to_kiosk`,
        arguments: [
            tx.object(kioskId),
            tx.object(kioskOwnerCapId),
            tx.pure.u128(10)
        ]
    })
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
    });
    console.log(result.digest);
}
