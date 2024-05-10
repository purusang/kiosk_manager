import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';

dotenv.config();

export async function deList(kioksId: any, kioskOwnerCapId: any, item: any, itemType: any) {
    const { client, keypair } = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::delist`,
        arguments: [
            tx.object(kioksId),
            tx.object(kioskOwnerCapId),
            tx.pure(item),
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}