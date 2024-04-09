import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
dotenv.config();

export async function placeList(kioksId: any, KioskOwnerCapId: any, nftId: any, itemType: any) {
    const { client, keypair } = getExecStuff();
   // console.log("kioksId", kioksId, " KioskOwnerCapId", KioskOwnerCapId, " nftId", nftId);
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `0x02::kiosk::place_and_list`,
        arguments: [
            tx.object(kioksId),
            tx.object(KioskOwnerCapId),
            tx.object(nftId),
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
