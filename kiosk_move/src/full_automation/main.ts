import getPackageId from "../../utils/setup";
import createKioskFn from "../kiosk/create_kiosk";
import { deList } from "../kiosk/delist";
import { lock } from "../kiosk/lock_nft";
import { placeList } from "../kiosk/place_and_list";
import { purchaseItem } from "../kiosk/purchase";
import { take_item } from "../kiosk/take_item";
import { withdraw } from "../kiosk/withdraw";
import mintNfts from "../mint_nft/mint_nft";
import { add_rule, createPolicy } from "../policy/policy";

const CALLER_ADDRESS = "0x856457e720ea48cbab8307375a9e1d826632186832bb883d20c298ecf71ae9f5";

async function main() {

    const resPackage = await getPackageId();
    let packageId = resPackage.packageId;
    let publisherId = resPackage.Publisher;
    let itemType = `${packageId}::nft::Sword`;

    const resNfts = await mintNfts(packageId);
    let nftList = resNfts
    const resKiosk = await createKioskFn(CALLER_ADDRESS);
    let kioskId = resKiosk.kioskId;
    let KioskOwnerCapId = resKiosk.kisokOwnerCapId;

    const resKioskBuyer = await createKioskFn(CALLER_ADDRESS);
    let buyerKioskId = resKioskBuyer.kioskId;
    let buyerKioskCapId = resKioskBuyer.kisokOwnerCapId;

    const resPolicy = await createPolicy(publisherId, itemType);
    let policyId = resPolicy.policyId;
    let policyCapId = resPolicy.policyCapId;

    await add_rule(policyId, policyCapId, packageId, itemType);
    for (let i = 0; i < 5; i++) {
        await placeList(kioskId, KioskOwnerCapId, nftList[i], itemType);
    }
    for (let i = 5; i < nftList.length; i++) {
        await lock(kioskId, KioskOwnerCapId, policyId, nftList[i], itemType);
    }
    for (let i = 2; i < 5; i++) {
        await purchaseItem(kioskId, nftList[i], buyerKioskId, buyerKioskCapId, policyId, itemType, packageId);
    }
    await deList(kioskId, KioskOwnerCapId, nftList[0], itemType);
    await take_item(kioskId, KioskOwnerCapId, nftList[1], itemType, CALLER_ADDRESS);
    await withdraw(kioskId, KioskOwnerCapId);
}
for (let i = 0; i < 10; i++) {
    main();
}
