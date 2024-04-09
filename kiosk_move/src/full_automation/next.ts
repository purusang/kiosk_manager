// import { TransferPolicyId, TransferPolicyCapId } from './../../utils/packageInfo';
import getPackageId from "../../utils/setup";
import createKioskFn from "../kiosk/create_kiosk";
import { placeList } from "../kiosk/place_and_list";
import { lock } from "../kiosk/lock_nft";
import { purchaseItemRoyaltyRule } from "../kiosk/purchase";
import mintNfts from "../mint_nft/mint_nft";
//import { add_rule, createPolicy } from "../policy/policy";
import { addRule } from "../policy/add_rule";
import { withdraw } from "../kiosk/withdraw";

const CALLER_ADDRESS = "0x16b80901b9e6d3c8b5f54dc8a414bb1a75067db897e7a3624793176b97445ec6";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    console.log("Deploying the Kiosk\n")
    const resPackage = await getPackageId();
    let packageId = resPackage.packageId;
    let TransferPolicyId: string = resPackage.TransferPolicyId;
    let TransferPolicyCapId: string = resPackage.TransferPolicyCapId;
    let itemType = `${packageId}::nft::Sword`;
    console.log("Creating the Kiosk\n");
    const resKiosk = await createKioskFn(CALLER_ADDRESS);
    let kioskId = resKiosk.kioskId;
    let kioskOwnerCapId = resKiosk.kisokOwnerCapId;

    console.log("minting the NFT\n");
    const resNfts = await mintNfts(packageId);
    let nftList = resNfts;
    console.log(nftList);
    console.log("Adding the rule\n");
    await addRule(packageId, TransferPolicyId, TransferPolicyCapId, itemType);
    console.log("placing and listing Nft \n");
    for (let i = 0; i < 5; i++) {
        console.log(nftList[i]);
        await placeList(kioskId, kioskOwnerCapId, nftList[i], itemType);
    }
    const lockNfts = await mintNfts(packageId);
    let lockNftList = lockNfts;
    console.log("locking Nfts");
    for (let i = 5; i < lockNftList.length; i++) {
        await lock(kioskId, kioskOwnerCapId, TransferPolicyId, lockNftList[i], itemType);
    }
    console.log("purchasing Nfts");
    for (let i = 2; i < 5; i++) {
        await purchaseItemRoyaltyRule(
            kioskId,
            nftList[i],
            TransferPolicyId,
            itemType,
            packageId,
        )
    }
    await withdraw(kioskId, kioskOwnerCapId);

    // @audit 
    // - 10 items place and list 5 
    // - 3 place and 2 lock
    // - 3 purchase 
    // - item 4 delist
}
main()