import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
//import { packageId, Kiosk, KioskOwnerCap, TransferPolicyId, itemType } from '../../utils/packageInfo';
//import { nft_1 } from '../../utils/nft_id';
dotenv.config();

export async function lock(Kiosk: string, KioskOwnerCap: string, TransferPolicyId: string, nft: string, itemType: string) {
    const { client, keypair} = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::lock`,
        arguments: [
            tx.object(Kiosk),
            tx.object(KioskOwnerCap),
            tx.object(TransferPolicyId),
            tx.object(nft)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash item locked: ${result.digest}`);
}