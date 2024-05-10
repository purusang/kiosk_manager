import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';

dotenv.config();

export async function addExtension(kioksId: any, kioskOwnerCapId: any, item: any, itemType: any) {
    const { client, keypair } = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::allow_extension`,
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

export async function allowKioskExtension(kiosk: string, kiosk_cap: string){
    const { client, keypair } = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::set_allow_extensions`,
        arguments: [
            tx.object(kiosk),
            tx.object(kiosk_cap),
            tx.pure.bool(true)
        ],
    });

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log("allow extension: ", result.digest);

}