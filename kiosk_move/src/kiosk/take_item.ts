import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap, itemType } from '../../utils/packageInfo';
import { nft_1 } from '../../utils/nft_id';
dotenv.config();

export async function take_item(kioksId: any, kioskOwnerCapId: any, item: any, itemType: any, address: any) {
    const tx = new TransactionBlock();
    const { client, keypair } = getExecStuff();
    let nft_item = tx.moveCall({
        target: `0x02::kiosk::take`,
        arguments: [
            tx.object(kioksId),
            tx.object(kioskOwnerCapId),
            tx.pure(item),
        ],
        typeArguments: [itemType]
    });
    tx.transferObjects([nft_item], tx.pure.address(address));
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}
