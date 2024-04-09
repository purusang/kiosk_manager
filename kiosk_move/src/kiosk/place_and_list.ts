import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap, itemType } from '../../utils/packageInfo';
import { nft_6 } from '../../utils/nft_id';
dotenv.config();

async function place() {
    const { client, keypair} = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place_and_list`,
        arguments: [
            tx.object(Kiosk),
            tx.object(KioskOwnerCap),
            tx.object(nft_6),
            tx.pure.u64(100000000)
        ],
        typeArguments: [itemType]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx
    });
    console.log(`Tx hash: ${result.digest}`);
}
place();