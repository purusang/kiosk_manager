import getPackageId from "../../utils/setup";
import createKioskFn from "../kiosk/create_kiosk";
import { placeList } from "../kiosk/place_and_list";
import { purchaseItem } from "../kiosk/purchase";
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

    await placeList(kioskId, KioskOwnerCapId, nftList[0], itemType);

    await purchaseItem(kioskId, nftList[0], buyerKioskId, buyerKioskCapId, policyId, itemType, packageId);
}
main()
