import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getExecStuff from '../../utils/execStuff';
import { packageId, Kiosk, KioskOwnerCap } from '../../utils/packageInfo';
dotenv.config();

const createKioskFn = async (address: string) => {
    const { keypair, client } = getExecStuff();

    const tx = new TransactionBlock();
    let kiosk = tx.moveCall({
        target: `0x02::kiosk::new`,
    });
    tx.moveCall({
        target: `0x02::transfer::public_share_object`,
        arguments: [
            kiosk[0]
        ],
        typeArguments: ["0x02::kiosk::Kiosk"]
    });
    tx.moveCall({
        target: `0x02::transfer::public_transfer`,
        arguments: [
            kiosk[1], tx.pure.address(address)
        ],
        typeArguments: ["0x02::kiosk::KioskOwnerCap"]
    });
    let res = await client.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: tx });
    console.log('Kiosk created digest: ', res.digest);
    const digest_ = res.digest;

    let Kiosk: any;
    let KioskOwnerCap: any;

    if (!digest_) {
        console.log("Digest is not available");
        // return { packageId };
    }

    const txn = await client.getTransactionBlock({
        digest: String(digest_),
        // only fetch the effects and objects field
        options: {
            showEffects: true,
            showInput: false,
            showEvents: false,
            showObjectChanges: true,
            showBalanceChanges: false,
        },
    });
    let output: any;
    output = txn.objectChanges;

    for (let i = 0; i < output.length; i++) {
        const item = output[i];
        if (item.type === 'created') {
            if (item.objectType === `0x2::kiosk::Kiosk`) {
                Kiosk = String(item.objectId);
            }
            if (item.objectType === `0x2::kiosk::KioskOwnerCap`) {
                KioskOwnerCap = String(item.objectId);
            }
        }
    }
    return { "kioskId": Kiosk, "kisokOwnerCapId": KioskOwnerCap }
}
// createKiosk('0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6');
export default createKioskFn;