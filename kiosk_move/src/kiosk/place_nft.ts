import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap } from '../../utils/packageInfo';
import { nft_1 } from '../../utils/nft_id';
dotenv.config();

async function place() {
    const { client, keypair} = getExecStuff();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place`,
        arguments: [
            tx.object(Kiosk),
            tx.object(KioskOwnerCap),
            tx.object(nft_1),
        ],
        typeArguments: [`${packageId}::nft::Sword`]
    });
    const res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log(`Tx hash: ${res.digest}`);
}
place();